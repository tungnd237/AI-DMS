# Import Python Standard Library dependencies
from copy import copy
import datetime
from glob import glob
import json
import math
import os
from pathlib import Path
import random
import urllib.request
from torchvision.transforms import functional as F
# Import utility functions
from cjm_pil_utils.core import resize_img, get_img_files
from cjm_pytorch_utils.core import set_seed, pil_to_tensor, tensor_to_pil, get_torch_device, denorm_img_tensor
# Import numpy 
import numpy as np
import pandas as pd
# Import PIL for image manipulation
from PIL import Image

# Import timm library
import timm

# Import PyTorch dependencies
import torch
from torch.utils.data import Dataset, DataLoader
import matplotlib.pyplot as plt
import torchvision
import torchvision.transforms as transforms
from torchvision.transforms import functional as TF
from multilabel_preprocess import *
from tqdm.auto import tqdm

def image_transform():
    train_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),  # Convert the image to a PyTorch tensor
        transforms.Normalize(mean=[0.485, 0.456, 0.406],  # Normalize using ImageNet's mean
                            std=[0.229, 0.224, 0.225])    # and standard deviation
    ])

    # For the validation set, you usually don't apply augmentation, only resizing and normalization
    val_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return train_transform, val_transform

def load_data(dataset_dir="/home/ubuntu/20thao.nt/OCC/dataset", test=True):
    # Set the name of the dataset
    train_paths, val_paths = np.array([]), np.array([])
    train_dir = ['/home/ubuntu/20thao.nt/OCC/dataset/eye_mouth_task_1150/test', '/home/ubuntu/20thao.nt/OCC/dataset/eye_mouth_task_1147/test']
    test_dir = '/home/ubuntu/20thao.nt/OCC/dataset/eye_mouth_task_1148/train'
    # Create the path to the directory where the dataset will be extracted
    for dir in train_dir:
        paths, _ = get_img_path(dir)
        train_paths = np.append(train_paths, paths)
    val_paths, class_counts_dict = get_img_path(test_dir)
    if test == False:
       train_paths = np.append(train_paths, val_paths)
       val_paths = []     
    print(f"Number of Training Images: {len(train_paths)}")
    print(f"Number of Testing Images: {len(val_paths)}")
        
    random.shuffle(train_paths)
    class_names = list(class_counts_dict.keys())
    train_tfms, valid_tfms = image_transform()
    train_dataset = ImageDataset(train_paths, train_tfms, class_names)
    valid_dataset = ImageDataset(val_paths, valid_tfms, class_names)
    return train_dataset, valid_dataset
    
    
if __name__=='__main__':
    seed = 42
    set_seed(seed)
    device = get_torch_device()

    # The name for the project
    project_name = f"pytorch-timm-image-classifier"

    # The path for the project folder
    project_dir = Path(f"./{project_name}/")
    load_data()
   