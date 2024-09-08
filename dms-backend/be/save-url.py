import numpy as np
import json
# from django.http import JsonResponse
# from rest_framework.views import APIView
# from rest_framework.parsers import JSONParser
# views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Image, FeatureData, FeatureData2
# from .serializers import ImageSerializer, ImageUploadSerializer
# from faker import Faker
# from .utils.onnx import ImageClassifier, ImageEmbeddingExtractor
# from django.http import JsonResponse, HttpResponse
# from rest_framework.parsers import JSONParser
from PIL import Image
import argparse
import os
import torch
import numpy as np
from torch.utils.data import DataLoader
from torchvision import transforms
import timm
# from .preprocess_sim import *
from scipy.spatial import distance
# from .s3_service import generate_results_with_presigned_urls, generate_presigned_urls

import logging
import boto3
from botocore.exceptions import ClientError
from django.conf import settings
import concurrent.futures


session = boto3.Session(
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )

def create_presigned_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = session.client('s3')
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response

def generate_results_with_presigned_urls(distances, num_k, model_id):
    bucket_name = 'vinai-vinuni-dms-test'
    base_s3_path = 'raw/OCC' if model_id == 1 else 'raw/AIC'
    local_base_path = '/home/ubuntu/20thao.nt/OCC' if model_id == 1 else '/home/ubuntu/20thao.nt/AIC/AIC_frames_cut'

    response = []

    for score, label, path in distances[:num_k]:
        # Replace local base path with S3 base path
        s3_relative_path = path.replace(local_base_path, base_s3_path)
        # Create the presigned URL
        presigned_url = create_presigned_url(bucket_name, s3_relative_path)
        # Extract the file name
        file_name = path.split('/')[-1]
        # Append the result
        response.append({
            'presigned_url': presigned_url if presigned_url else 'Error generating presigned URL',
            'file_name': file_name,
            'label': label,
            'similarity_score': score
        })

    # Return the results as a JSON response
    return response


def generate_presigned_url(path, bucket_name, base_s3_path, model_id):
    if model_id == 1:
        s3_relative_path = path.replace('/home/ubuntu/20thao.nt/OCC', base_s3_path)
    else:
        s3_relative_path = path.replace('/home/ubuntu/20thao.nt/AIC/AIC_frames_cut', base_s3_path)
    return create_presigned_url(bucket_name, s3_relative_path)

def generate_presigned_urls(image_paths, model_id):
    bucket_name = 'vinai-vinuni-dms-test'
    base_s3_path = 'raw/OCC' if model_id == 1 else 'raw/AIC'
    presigned_urls = [None] * len(image_paths)

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_index = {executor.submit(generate_presigned_url, path, bucket_name, base_s3_path, model_id): idx for idx, path in enumerate(image_paths)}
        for future in concurrent.futures.as_completed(future_to_index):
            idx = future_to_index[future]
            try:
                presigned_urls[idx] = future.result() or 'Error generating presigned URL'
            except Exception as exc:
                print(f'{image_paths[idx]} generated an exception: {exc}')
                presigned_urls[idx] = 'Error generating presigned URL'

    return presigned_urls

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

# Import tqdm for progress bar
from tqdm.auto import tqdm
# Shuffle the image paths
# class ResizeMax:
#     """
#     A PyTorch Transform class that resizes an image such that the maximum dimension 
#     is equal to a specified size while maintaining the aspect ratio.
#     """
    
#     def __init__(self, 
#                  max_sz:int=256 # The maximum size for any dimension (height or width) of the image.
#                 ):
#         """
#         Initialize ResizeMax object with a specified max_sz. 
#         """
#         # Call to the parent class (Transform) constructor
#         super().__init__()

#         # Set the maximum size for any dimension of the image
#         self.max_sz = max_sz
        
#     def __call__(self, 
#                    inpt, # The input image tensor to be resized.
#                    params=None # A dictionary of parameters. Not used in this method but is present for compatibility with the parent's method signature.
#                   ) -> torch.Tensor: # The resized image tensor.
#         """
#         Apply the ResizeMax transformation on an input image tensor.
#         """

#         # Copy the input tensor to a new variable
#         x = inpt

#         # Get the width and height of the image tensor
#         spatial_size = TF.get_image_size(x)

#         # Calculate the size for the smaller dimension, such that the aspect ratio 
#         # of the image is maintained when the larger dimension is resized to max_sz
#         size = int(min(spatial_size) / (max(spatial_size) / self.max_sz))

#         # Resize the image tensor with antialiasing for smoother output
#         x = TF.resize(x, size=size, antialias=True)

#         # Return the transformed (resized) image tensor
#         return x

# # %% ../nbs/00_core.ipynb 11
# class PadSquare:
#     """
#     PadSquare is a PyTorch Transform class used to pad images to make them square. 
#     Depending on the configuration, padding can be applied equally on both sides, 
#     or can be randomly split between the two sides.
#     """

#     def __init__(self, 
#                  padding_mode:str='constant', # The method to use for padding. Default is 'constant'.
#                  fill:tuple=(123, 117, 104), # The RGB values to use for padding if padding_mode is 'constant'.
#                  shift:bool=True # If True, padding is randomly split between the two sides. If False, padding is equally applied.
#                 ):
#         """
#         The constructor for PadSquare class.
#         """
#         super().__init__()
#         self.padding_mode = padding_mode
#         self.fill = fill
#         self.shift = shift
#         self.pad_split = None

#     def forward(self, 
#                 *inputs # The inputs to the forward method.
#                ): # The result of the superclass forward method.
#         """
#         The forward method that sets up the padding split factor if 'shift' is True, 
#         and then calls the superclass forward method.
#         """
#         self.pad_split = random.random() if self.shift else None
#         return super().forward(*inputs)

#     def __call__(self, 
#                    inpt, # The input to be transformed.
#                    params={} # A dictionary of parameters for the transformation.
#                   ): # The transformed input.
#         """
#         The _transform method that applies padding to the input to make it square.
#         """
#         x = inpt
        
#         # Get the width and height of the image tensor
#         h, w = TF.get_image_size(x)
        
#         # If shift is true, padding is randomly split between two sides
#         if self.shift:
#             offset = (max(w, h) - min(w, h))
#             pad_1 = int(offset*self.pad_split)
#             pad_2 = offset - pad_1
            
#             # The padding is applied to the shorter dimension of the image
#             self.padding = [0, pad_1, 0, pad_2] if h < w else [pad_1, 0, pad_2, 0]
#             padding = self.padding
#         else:
#             # If shift is false, padding is equally split between two sides
#             offset = (max(w, h) - min(w, h)) // 2
#             padding = [0, offset] if h < w else [offset, 0]
        
#         # Apply the padding to the image
#         x = TF.pad(x, padding=padding, padding_mode=self.padding_mode, fill=self.fill)
        
#         return x
        
# def image_transform(train_sz = 288):

#     # Set the fill color for padding images
#     fill = (0,0,0)

#     # Create a `ResizeMax` object
#     resize_max = ResizeMax(max_sz=train_sz)

#     # Create a `PadSquare` object
#     pad_square = PadSquare(shift=True, fill=fill)

#     # # Create a TrivialAugmentWide object
#     trivial_aug = transforms.TrivialAugmentWide(fill=fill)


#     # Ensure the padded image is the target size
#     resize = transforms.Resize([train_sz] * 2, antialias=True)

#     # Compose transforms to resize and pad input images
#     resize_pad_tfm = transforms.Compose([
#         resize_max, 
#         pad_square,
#         transforms.Resize([train_sz] * 2, antialias=True)
#     ])

#     # Compose transforms to sanitize bounding boxes and normalize input data
#     final_tfms = transforms.Compose([
#         transforms.ToTensor(), 
#         # transforms.to(torch.float32, scale=True),
#         transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
#     ])

#     # Define the transformations for training and validation datasets
#     # Note: Data augmentation is performed only on the training dataset
#     train_tfms = transforms.Compose([
#         trivial_aug,
#         resize_pad_tfm, 
#         final_tfms
#     ])

#     valid_tfms = transforms.Compose([resize_pad_tfm, final_tfms])
#     return train_tfms, valid_tfms

def image_transform():
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(224),  # Randomly crop and resize to 224x224
        transforms.RandomHorizontalFlip(),  # Randomly flip the image horizontally
        transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1, hue=0.1),  # Randomly adjust brightness, contrast, saturation, and hue
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

class ImageDataset(Dataset):
    """
    A PyTorch Dataset class for handling images.
    
    This class extends PyTorch's Dataset and is designed to work with image data. 
    It supports loading images, and applying transformations.

    Attributes:
        img_paths (list): List of image file paths.
        class_to_idx (dict): Dictionary mapping class names to class indices.
        transforms (callable, optional): Transformations to be applied to the images.
    """

    def __init__(self, img_paths, class_to_idx, transforms=None, class_names=None):
        """
        Initializes the ImageDataset with image keys and other relevant information.
        
        Args:
            img_paths (list): List of image file paths.
            class_to_idx (dict): Dictionary mapping class names to class indices.
            transforms (callable, optional): Transformations to be applied to the images.
        """
        super(Dataset, self).__init__()
        
        self._img_paths = img_paths
        self._class_to_idx = class_to_idx
        self._transforms = transforms
        self._class_names = class_names

    def __len__(self):
        """
        Returns the number of items in the dataset.
        
        Returns:
            int: Number of items in the dataset.
        """
        return len(self._img_paths)
        
    def __getitem__(self, index):
        """
        Retrieves an item from the dataset at the specified index.
        
        Args:
            index (int): Index of the item to retrieve.

        Returns:
            tuple: A tuple containing the image and its corresponding label.
        """
        img_path = self._img_paths[index]
        image, label = self._load_image(img_path)
        
        # Applying transformations if specified
        if self._transforms:
            image = self._transforms(image)

        return image, label, str(img_path) 

    def _load_image(self, img_path):
        """
        Loads an image from the provided image path.
        
        Args:
            img_path (string): Image path.
            Returns:
        tuple: A tuple containing the loaded image and its corresponding target data.
        """
        # Load the image from the file path
        image = Image.open(img_path).convert('RGB')
        
        return image, self._class_to_idx[img_path.parent.name]

# Define parameters for DataLoader

def load_data(dataset_dir="/home/ubuntu/20thao.nt/AIC/AIC_frames_cut", train_pct=0.9, val_pct=0.1):
    # Set the name of the dataset
    dataset_name = 'aic'
    # Create the path to the directory where the dataset will be extracted
    dataset_path = Path(dataset_dir)

    img_folder_paths = [folder for folder in dataset_path.iterdir() if folder.is_dir()]
    # Display the names of the folders using a Pandas DataFrame
    class_file_paths = [get_img_files(folder) for folder in img_folder_paths]
    print(class_file_paths)

    # Get all image files in the 'img_dir' directory
    img_paths = [
        file
        for folder in class_file_paths # Iterate through each image folder
        for file in folder # Get a list of image files in each image folder
    ]
    print(f"Number of Images: {len(img_paths)}")
    

    # Get the number of samples for each image class
    class_counts_dict = {folder[0].parent.name:len(folder) for folder in class_file_paths}
    class_counts = pd.DataFrame.from_dict({'Count':class_counts_dict})
    random.shuffle(img_paths)
    class_names = list(class_counts_dict.keys())
    class_to_idx = {c: i for i, c in enumerate(class_names)}

    # Define the percentage of the images that should be used for training
    train_pct = 0.9
    val_pct = 0.1
    test_user = '24026'
    is_test_split = np.array([True if test_user in str(img_path) else False
                         for img_path in img_paths])
    
    print(f">>>>>>>>>> Validation Percentage: {np.sum(is_test_split)/len(is_test_split)}; Test User ID {test_user}")

    # Calculate the index at which to split the subset of image paths into training and validation sets
    # train_split = int(len(img_paths)*train_pct)
    # val_split = int(len(img_paths)*(train_pct+val_pct))

    # Split the subset of image paths into training and validation sets
    img_paths = np.array(img_paths)
    train_paths = img_paths[~is_test_split]
    val_paths = img_paths[is_test_split]
    for id in train_paths:
        if test_user in str(id):
            raise Exception('Test user exists in train paths')
    print(f">>>>>>>>>> Train size/Test size: {len(train_paths)}/{len(val_paths)}")
    # Create a mapping from class names to class indices
    class_names = list(class_counts_dict.keys())
    class_to_idx = {c: i for i, c in enumerate(class_names)}

    # Instantiate the dataset using the defined transformations
    train_tfms, valid_tfms = image_transform()
    train_dataset = ImageDataset(train_paths, class_to_idx, train_tfms, class_names)
    valid_dataset = ImageDataset(val_paths, class_to_idx, valid_tfms, class_names)

    ## TEST-------------
    # image = Image.open(img_paths[0]).convert('RGB')  # Open and convert to RGB

    # # Apply the transformation
    # transformed_image = valid_tfms(image)

    # # Convert the tensor to a PIL image for visualization
    # transformed_image_pil = TF.to_pil_image(transformed_image)
    
    # # Display the annotated image
    # plt.imshow(transformed_image_pil)
    # plt.savefig('sample_test_img.png')
    # plt.close()
    # plt.imshow(image)
    # plt.savefig('original_image.png')
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
   

def save_data_to_npz(model_id):
    if model_id == 0:
        data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data.npz')
        data2 = np.load('/home/ubuntu/20thao.nt/dms-backend/be/reduced_features.npz')
        features = data2['features']
        labels = data['labels']
        image_paths = data['image_paths']
        cluster_labels = data['cluster_labels']

        data = [{'features': feature.tolist(), 'labels': label, 'image_path': image_path, 'cluster_labels': cluster_label}
                for feature, label, image_path, cluster_label in zip(features[:2000], labels[:2000], image_paths[:2000], cluster_labels[:2000])]
    
    elif model_id == 1:
        data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data2.npz')
        data2 = np.load('/home/ubuntu/20thao.nt/dms-backend/be/reduced_features2.npz')
        features = data2['features']
        labels = data['labels']
        image_paths = data['image_paths']
        cluster_labels = data['cluster_labels']

        data = [{'features': feature.tolist(), 'labels': convert_multiclass_label(label), 'image_path': image_path, 'cluster_labels': cluster_label}
                for feature, label, image_path, cluster_label in zip(features[:2000], labels[:2000], image_paths[:2000], cluster_labels[:2000])]
    
    else:
        raise ValueError('Invalid model ID provided')
    
    image_paths_list = [item['image_path'] for item in data]
    presigned_urls = generate_presigned_urls(image_paths_list, model_id)
    
    for item, presigned_url in zip(data, presigned_urls):
        item['presigned_url'] = presigned_url
        item['file_name'] = item['image_path'].split('/')[-1]
        del item['image_path']

    file_name = f'/home/ubuntu/20thao.nt/dms-backend/be/data_model_{model_id}.npz'
    np.savez(file_name, data=json.dumps(data))
    print(f'Data saved to {file_name}')

# Save data for both model_id 0 and 1
save_data_to_npz(0)
save_data_to_npz(1)



def convert_multiclass_label(label):
    if np.array_equal(label, [0, 0, 0]):
        return 0
    elif np.array_equal(label, [1, 0, 0]):
        return 1
    elif np.array_equal(label, [0, 1, 0]):
        return 2
    elif np.array_equal(label, [0, 0, 1]):
        return 3
    elif np.array_equal(label, [1, 1, 0]):
        return 4
    elif np.array_equal(label, [1, 0, 1]):
        return 5
    elif np.array_equal(label, [0, 1, 1]):
        return 6
    elif np.array_equal(label, [1, 1, 1]):
        return 7
    else:
        return -1  # Invalid label or other cases


