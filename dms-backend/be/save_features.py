import argparse
import os
import torch
import numpy as np
from torch.utils.data import DataLoader
from torchvision import transforms
from PIL import Image
import timm
from preprocess_sim import *
from scipy.spatial import distance
import torch.nn.functional as F

dataset_dir = '/home/ubuntu/20thao.nt/AIC/AIC_frames_cut'

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model_file_name = 'resnet18d.ra2_in1k.pth'
checkpoint = "2024-04-01_01-39-46"
model_path = f"/home/ubuntu/20thao.nt/AIC/pytorch-timm-image-classifier/{checkpoint}/{model_file_name}"

lr = 1e-3
epochs = 3
bs = 32
num_workers = 4

data_loader_params = {
    'batch_size': bs,
    'num_workers': num_workers,
    'persistent_workers': True,
    'pin_memory': device.type == 'cuda',
    'pin_memory_device': 'cuda' if torch.cuda.is_available() else 'cpu',
}

train_dataset, valid_dataset = load_data(dataset_dir=dataset_dir, train_pct=0.9, val_pct=0.1)
train_dataloader = DataLoader(train_dataset, **data_loader_params, shuffle=True)
valid_dataloader = DataLoader(valid_dataset, **data_loader_params)
CLASS_LIST = [d for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))]

model = timm.create_model('resnet18d', pretrained=True, num_classes=len(CLASS_LIST))
model.load_state_dict(torch.load(model_path))
model.to(device)
model.eval()

print(f"Model Configuration: {model.default_cfg}")
print(f'Number of batches in train DataLoader: {len(train_dataloader)}')
print(f'Number of batches in validation DataLoader: {len(valid_dataloader)}')

all_features = []
labels = []
image_paths = []

# Function to process a dataloader and append features, labels, and paths
def process_dataloader(dataloader):
    global all_features, labels, image_paths
    counter = 1
    for image_tensors, label_tensors, paths in dataloader:
        image_tensors = image_tensors.to(device)
        with torch.no_grad():
            # features = model.forward_features(image_tensors)
            features = model(image_tensors)
            features = features.view(features.size(0), -1)
        counter += 1
        if counter == 5:
            print(features.shape)
        all_features.append(features.cpu().numpy())
        labels.append(label_tensors.numpy())
        image_paths.extend(paths)

# Process both training and validation dataloaders
process_dataloader(train_dataloader)
process_dataloader(valid_dataloader)

all_features = np.concatenate(all_features, axis=0)
labels = np.concatenate(labels, axis=0)
print(all_features.shape)
np.savez('features.npz', features=all_features, labels=labels, image_paths=image_paths)
