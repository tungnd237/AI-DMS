# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Image, FeatureData, FeatureData2
from .serializers import ImageSerializer, ImageUploadSerializer
from faker import Faker
from .utils.onnx import ImageClassifier, ImageEmbeddingExtractor
from django.http import JsonResponse, HttpResponse
from rest_framework.parsers import JSONParser
from PIL import Image
import argparse
import os
import torch
import numpy as np
from torch.utils.data import DataLoader
from torchvision import transforms
import timm
from .preprocess_sim import *
from scipy.spatial import distance
from .s3_service import generate_results_with_presigned_urls, generate_presigned_urls

class ImageUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            # Use Faker to generate the response data
            faker = Faker()
            response_data = {
                "related_images": [
                    {
                        "image_id": faker.unique.uuid4(),
                        "image_url": request.data['image_url'],
                        "created_at": "2017-01-01",
                        "collected_at": "2017-01-01",
                        "tags": [
                            {"tag_id": "1", "tag_name": "drinking", "confidence": "0.9"},
                            {"tag_id": "2", "tag_name": "using phone", "confidence": "0.8"},
                        ],
                        "metadata": {
                            "collectedAt": "Kaggle",
                            "collectedTime": 1690294174,
                            "dataname": "drinking person",
                            "camera": {"type": "DSLR", "position": "front"},
                        },
                    }
                    for _ in range(int(request.data['page_limit']))  # Generate multiple entries based on page_limit
                ]
            }
            return Response(response_data)
        else:
            return Response(serializer.errors, status=400)
        
class ImageQueryView(APIView):
    def get(self, request, format=None):
        # Query the Image model
        images = Image.objects.all()  # Add filtering logic based on query params
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data)

class ImageClassifierView(APIView):
    def post(self, request, *args, **kwargs):
        image_path = request.data.get('image_path')
        if not image_path:
            return JsonResponse({'error': 'No image path provided'}, status=400)

        # You might want to save the image temporarily or process it directly
        # Saving the file temporarily
        #image_path = 'be/test_images/istockphoto-1397785595-612x612.jpg'


        # Instantiate the classifier
        classifier = ImageClassifier('be/ml_models/resnet18d_simplify.onnx')
        
        # Get predictions
        predictions = classifier.predict(image_path)

        # Send back the response
        return JsonResponse(predictions)

class DirectImageSimilarity(APIView):
    def post(self, request, *args, **kwargs):
        # Retrieve the image path from the request data
        uploaded_file = request.FILES.get('image_file')
        if not uploaded_file:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        # Further configuration and setup remain similar
        dataset_dir = request.data.get('dataset_dir')
        if not dataset_dir:
            return JsonResponse({'error': 'No dataset path provided'}, status=400)

        num_k = request.data.get('num_k')
        if not num_k:
            return JsonResponse({'error': 'No relate number provided'}, status=400)

        num_k = int(num_k)

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        model_file_name = 'resnet18d.ra2_in1k.pth'
        checkpoint = "2024-04-01_01-39-46"
        model_path = f"/home/ubuntu/20thao.nt/AIC/pytorch-timm-image-classifier/{checkpoint}/{model_file_name}"

        CLASS_LIST =  [d for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))]

        ###-------------LOAD DATA
        lr = 1e-3
        epochs=3
        bs=32
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

        model = timm.create_model('resnet18d', pretrained=True, num_classes=len(CLASS_LIST))
        model.load_state_dict(torch.load(model_path))
        model.to(device)
        model.eval()

        print(f"Model Configuration: {model.default_cfg}")
        print(f'Number of batches in train DataLoader: {len(train_dataloader)}')
        print(f'Number of batches in validation DataLoader: {len(valid_dataloader)}')

        # Instead of opening an image from a path, use the uploaded file
        input_image = Image.open(uploaded_file).convert('RGB')
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        input_image_tensor = transform(input_image).unsqueeze(0).to(device)

        with torch.no_grad():
            input_feature = model(input_image_tensor).view(-1)

        labels = []
        image_paths = []  

        for image_tensors, label_tensors, paths in valid_dataloader:  
            labels.append(label_tensors.numpy())
            image_paths.extend(paths)  


        all_features = np.load('/home/ubuntu/20thao.nt/dms-backend/be/all_features.npy')

        input_feature = input_feature.cpu().numpy().flatten()

        # Calculate distances and find closest images
        distances = [(distance.cosine(input_feature, feature), path) for feature, path in zip(all_features, image_paths)]
        distances.sort(key=lambda x: x[0])

        # Collect the results
        results = [{'path': path, 'similarity_score': score} for score, path in distances[:num_k]]

        # Return the results as a JSON response
        return JsonResponse({'results': results})

class ImageFeatures(APIView):
    def get(self, request, *args, **kwargs):
        data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data.npz')
        data2 = np.load('/home/ubuntu/20thao.nt/dms-backend/be/reduced_features.npz')
        features = data2['features']
        labels = data['labels']
        image_paths = data['image_paths']
        cluster_labels = data['cluster_labels']
        
        print(len(cluster_labels))
        print(len(image_paths))
        print("-----------------------------------------")
        print(cluster_labels)

        FeatureData.objects.all().delete()

        for feature, label, image_path, cluster_label in zip(features, labels, image_paths, cluster_labels):
            FeatureData.objects.create(features=feature.tolist(), labels=label, image_path=image_path, cluster_labels=cluster_label)

        data = list(FeatureData.objects.values('features', 'labels', 'image_path', 'cluster_labels'))
        print(len(data))
        
        # Generate presigned URLs for image paths
        image_paths_list = [item['image_path'] for item in data]
        presigned_urls = generate_presigned_urls(image_paths_list)
        
        # Attach presigned URLs to the response data
        for item, presigned_url in zip(data, presigned_urls):
            item['presigned_url'] = presigned_url

        return JsonResponse(data, safe=False)


# Fastest sim search version
class SimilaritySearch(APIView):
    def post(self, request, *args, **kwargs):
        # Retrieve the image path from the request data
        print("=====================Similarity search endpoint called...===========================")
        uploaded_file = request.FILES.get('image_file')
        if not uploaded_file:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        dataset_dir = request.data.get('dataset_dir')
        if not dataset_dir:
            return JsonResponse({'error': 'No dataset path provided'}, status=400)

        num_k = request.data.get('num_k')
        if not num_k:
            return JsonResponse({'error': 'No relate number provided'}, status=400)
        
        num_k = int(num_k)

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        model_file_name = 'resnet18d.ra2_in1k.pth'
        checkpoint = "2024-04-01_01-39-46"
        model_path = f"/home/ubuntu/20thao.nt/AIC/pytorch-timm-image-classifier/{checkpoint}/{model_file_name}"

        CLASS_LIST =  [d for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))]

        ###-------------LOAD DATA
        lr = 1e-3
        epochs=3
        bs=32
        num_workers = 4

        data_loader_params = {
            'batch_size': bs, 
            'num_workers': num_workers,  
            'persistent_workers': True, 
            'pin_memory': device.type == 'cuda',  
            'pin_memory_device': 'cuda' if torch.cuda.is_available() else 'cpu',  
        }

        model = timm.create_model('resnet18d', pretrained=True, num_classes=len(CLASS_LIST))
        model.load_state_dict(torch.load(model_path))
        model.to(device)
        model.eval()

        print(f"Model Configuration: {model.default_cfg}")


        input_image = Image.open(uploaded_file).convert('RGB')
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        input_image_tensor = transform(input_image).unsqueeze(0).to(device)

        with torch.no_grad():
            input_feature = model(input_image_tensor).view(-1)
 

        data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features.npz')
        all_features = data['features']
        all_labels = data['labels']
        image_paths = data['image_paths']

        # Convert input_feature to numpy array
        input_feature = input_feature.cpu().numpy().flatten()

        # Calculate distances and find closest images
        distances = [(distance.cosine(input_feature, feature), int(label), path) for feature, label, path in zip(all_features, all_labels, image_paths)]
        distances.sort(key=lambda x: x[0])

        # Collect the results
        results = [{'path': path, 'tags': label, 'similarity_score': score} for score, label, path in distances[:num_k]]

        # results = generate_results_with_presigned_urls(distances, num_k)
        # Return the results as a JSON response
        return JsonResponse({'results': results})

class SimiSearch(APIView):
    def get(self, request, *args, **kwargs):
        image_path = request.data.get('image_path')
        if not image_path:
            return JsonResponse({'error': 'No image path provided'}, status=400)

        dataset_dir = request.data.get('dataset_dir')
        if not dataset_dir:
            return JsonResponse({'error': 'No dataset path provided'}, status=400)

        num_k = request.data.get('num_k')
        if not num_k:
            return JsonResponse({'error': 'No relate number provided'}, status=400)
        num_k = int(num_k)

        # Specify your ONNX model path here
        model_path = '/home/ubuntu/20thao.nt/Capstone-Project/onnx-model/resnet18d_emb.onnx'
        extractor = ImageEmbeddingExtractor(model_path)
        input_feature = extractor.extract_features(image_path)

        # Load the dataset features previously extracted
        data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features.npz')
        all_features = data['features']
        all_labels = data['labels']
        image_paths = data['image_paths']

        # Calculate distances and find closest images
        distances = [(distance.cosine(input_feature, feature), int(label), path) for feature, label, path in zip(all_features, all_labels, image_paths)]
        distances.sort(key=lambda x: x[0])

        # Collect the results
        results = [{'path': path, 'label': label, 'similarity_score': score} for score, label, path in distances[:num_k]]

        # Return the results as a JSON response
        return JsonResponse({'results': results})

# With model id
class SimilaritySearchTest(APIView):
    def post(self, request, *args, **kwargs):
        # Retrieve the image path from the request data
        print("=====================Similarity search endpoint called...===========================")
        uploaded_file = request.FILES.get('image_file')
        if not uploaded_file:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        num_k = request.data.get('num_k')
        if not num_k:
            return JsonResponse({'error': 'No relate number provided'}, status=400)
        
        num_k = int(num_k)

        model_id = request.data.get('model_id')
        if model_id is None:
            return JsonResponse({'error': 'No model ID provided'}, status=400)
        
        model_id = int(model_id)

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        if model_id == 0:
            model_file_name = 'resnet18d.ra2_in1k.pth'
            checkpoint = "2024-04-01_01-39-46"
            model_path = f"/home/ubuntu/20thao.nt/AIC/pytorch-timm-image-classifier/{checkpoint}/{model_file_name}"
            CLASS_LIST = ["drinking", "eating", "normal-driving", "phone-call", "text"]

            model = timm.create_model('resnet18d', pretrained=True, num_classes=len(CLASS_LIST))
            model.load_state_dict(torch.load(model_path))
            model.to(device)
            model.eval()

            print(f"Model Configuration: {model.default_cfg}")

            input_image = Image.open(uploaded_file).convert('RGB')
            transform = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            input_image_tensor = transform(input_image).unsqueeze(0).to(device)

            with torch.no_grad():
                input_feature = model(input_image_tensor).view(-1)

            data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features.npz')
            all_features = data['features']
            all_labels = data['labels']
            image_paths = data['image_paths']

            input_feature = input_feature.cpu().numpy().flatten()

            distances = [(distance.cosine(input_feature, feature), int(label), path) for feature, label, path in zip(all_features, all_labels, image_paths)]
            distances.sort(key=lambda x: x[0])

            results = [{'path': path, 'label': label, 'similarity_score': score} for score, label, path in distances[:num_k]]
        elif model_id == 1:
            data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features2.npz')
            all_features = data['features']
            all_labels = data['labels']
            image_paths = data['image_paths']

            model_file_name = 'resnet18d.ra2_in1k.pth'
            checkpoint = "2024-04-21_15-04-57"
            model_path = f"/home/ubuntu/20thao.nt/OCC/pytorch-timm-image-classifier/{checkpoint}/{model_file_name}"
            CLASS_LIST = ['left_eye', 'right_eye', 'mouth']

            model = timm.create_model('resnet18d', pretrained=True, num_classes=len(CLASS_LIST))
            model.load_state_dict(torch.load(model_path))
            model.to(device)
            model.eval()

            print(f"Model Configuration: {model.default_cfg}")

            input_image = Image.open(uploaded_file).convert('RGB')
            transform = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            input_image_tensor = transform(input_image).unsqueeze(0).to(device)

            with torch.no_grad():
                input_feature = model(input_image_tensor).view(-1)

            input_feature = input_feature.cpu().numpy().flatten()
            distances = [
                (distance.cosine(input_feature, feature), convert_multiclass_label(label), path) 
                for feature, label, path in zip(all_features, all_labels, image_paths)
            ]
            distances.sort(key=lambda x: x[0])

            results = [{'path': path, 'label': label, 'similarity_score': score} for score, label, path in distances[:num_k]]
        else:
            return JsonResponse({'error': 'Invalid model ID provided'}, status=400)

        results = generate_results_with_presigned_urls(distances, num_k, model_id)
        return JsonResponse({'results': results})



class ImageFeaturesTest(APIView):
    parser_classes = [JSONParser]  # Add this line to enable JSON parsing

    def get(self, request, *args, **kwargs):
        model_id = request.query_params.get('model_id')  # Retrieve model_id from query parameters
        if model_id is None:
            return JsonResponse({'error': 'No model ID provided'}, status=400)
        
        model_id = int(model_id)
        
        if model_id == 0:
            data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data.npz')
            data2 = np.load('/home/ubuntu/20thao.nt/dms-backend/be/reduced_features.npz')
            features = data2['features']
            labels = data['labels']
            image_paths = data['image_paths']
            cluster_labels = data['cluster_labels']

            FeatureData.objects.all().delete()

            # Process only the first 2000 records
            for feature, label, image_path, cluster_label in zip(features[:2000], labels[:2000], image_paths[:2000], cluster_labels[:2000]):
                FeatureData.objects.create(features=feature.tolist(), labels=label, image_path=image_path, cluster_labels=cluster_label)

            data = list(FeatureData.objects.values('features', 'labels', 'image_path', 'cluster_labels'))
            print(len(data))
        
        elif model_id == 1:
            data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data2.npz')
            data2 = np.load('/home/ubuntu/20thao.nt/dms-backend/be/reduced_features2.npz')
            features = data2['features']
            labels = data['labels']
            image_paths = data['image_paths']
            cluster_labels = data['cluster_labels']

            FeatureData.objects.all().delete()

            # Process only the first 2000 records
            for feature, label, image_path, cluster_label in zip(features[:2000], labels[:2000], image_paths[:2000], cluster_labels[:2000]):
                converted_label = convert_multiclass_label(label)
                FeatureData.objects.create(features=feature.tolist(), labels=converted_label, image_path=image_path, cluster_labels=cluster_label)

            data = list(FeatureData.objects.values('features', 'labels', 'image_path', 'cluster_labels'))
            print(len(data))
        else:
            return JsonResponse({'error': 'Invalid model ID provided'}, status=400)
        
        # Generate presigned URLs for image paths
        image_paths_list = [item['image_path'] for item in data]
        presigned_urls = generate_presigned_urls(image_paths_list, model_id)
        
        # Attach presigned URLs to the response data
        for item, presigned_url in zip(data, presigned_urls):
            item['presigned_url'] = presigned_url
            item['file_name'] = item['image_path'].split('/')[-1]
            del item['image_path']

        return JsonResponse(data, safe=False)

class SimilaritySearchDemo(APIView):
    def post(self, request, *args, **kwargs):
        print("=====================Similarity search endpoint called...===========================")

        # uploaded_file = request.FILES.get('image_file')
        # if not uploaded_file:
        #     return JsonResponse({'error': 'No image file provided'}, status=400)

        num_k = request.data.get('num_k')
        if not num_k:
            return JsonResponse({'error': 'No relate number provided'}, status=400)
        
        num_k = int(num_k)

        model_id = request.data.get('model_id')
        if model_id is None:
            return JsonResponse({'error': 'No model ID provided'}, status=400)
        
        model_id = int(model_id)

        if model_id == 0:
            image_path = '/home/ubuntu/20thao.nt/AIC/AIC_frames_cut/drinking/Dashboard_User_id_24026_NoAudio_3_130_147_second_1.png'
        elif model_id == 1:
            image_path = '/home/ubuntu/20thao.nt/OCC/dataset/eye_mouth_task_1147/test/leftfalse_righttrue_mouthtrue/04e454ccf2c3223daa6f8d5bdbea33c4/000000000_0.95.png'
        else:
            return JsonResponse({'error': 'Invalid model ID provided'}, status=400)

        # Load metadata
        if model_id == 0:
            data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features.npz')
        else:
            data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features2.npz')
        
        all_features = data['features']
        all_labels = data['labels']
        image_paths = data['image_paths']
        
        # Calculate similarities
        predefined_feature = None
        if model_id == 0:
            predefined_feature = all_features[np.where(image_paths == image_path)][0]
        elif model_id == 1:
            predefined_feature = all_features[np.where(image_paths == image_path)][0]
        
        if predefined_feature is None:
            return JsonResponse({'error': 'Predefined image feature not found'}, status=400)
        
        predefined_feature = predefined_feature.flatten()

        distances = [
            (distance.cosine(predefined_feature, feature), convert_multiclass_label(label) if model_id == 1 else int(label), path) 
            for feature, label, path in zip(all_features, all_labels, image_paths)
        ]
        distances.sort(key=lambda x: x[0])

        results = [{'path': path, 'label': label, 'similarity_score': score} for score, label, path in distances[:num_k]]
        
        results = generate_results_with_presigned_urls(distances, num_k, model_id)
        return JsonResponse({'results': results})

class ImageFeaturesSave(APIView):
    parser_classes = [JSONParser]
    
    def get(self, request, *args, **kwargs):
        print("=============================Saving============================")
        model_id = request.data.get('model_id')
        if model_id is None:
            return JsonResponse({'error': 'No model ID provided'}, status=400)
        
        model_id = int(model_id)
        
        if model_id == 0:
            data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data.npz')
            data2 = np.load('/home/ubuntu/20thao.nt/dms-backend/be/reduced_features.npz')
            features = data2['features']
            labels = data['labels']
            image_paths = data['image_paths']
            cluster_labels = data['cluster_labels']

            FeatureData.objects.all().delete()

            for feature, label, image_path, cluster_label in zip(features[:2000], labels[:2000], image_paths[:2000], cluster_labels[:2000]):
                FeatureData.objects.create(features=feature.tolist(), labels=label, image_path=image_path, cluster_labels=cluster_label)

            data = list(FeatureData.objects.values('features', 'labels', 'image_path', 'cluster_labels'))
        
        elif model_id == 1:
            data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data2.npz')
            data2 = np.load('/home/ubuntu/20thao.nt/dms-backend/be/reduced_features2.npz')
            features = data2['features']
            labels = data['labels']
            image_paths = data['image_paths']
            cluster_labels = data['cluster_labels']

            FeatureData.objects.all().delete()

            for feature, label, image_path, cluster_label in zip(features[:2000], labels[:2000], image_paths[:2000], cluster_labels[:2000]):
                converted_label = convert_multiclass_label(label)
                FeatureData.objects.create(features=feature.tolist(), labels=converted_label, image_path=image_path, cluster_labels=cluster_label)

            data = list(FeatureData.objects.values('features', 'labels', 'image_path', 'cluster_labels'))
        else:
            return JsonResponse({'error': 'Invalid model ID provided'}, status=400)
        
        image_paths_list = [item['image_path'] for item in data]
        presigned_urls = generate_presigned_urls(image_paths_list, model_id)
        
        for item, presigned_url in zip(data, presigned_urls):
            item['presigned_url'] = presigned_url
            item['file_name'] = item['image_path'].split('/')[-1]
            del item['image_path']

        self.save_to_npz(data, model_id)
        
        return JsonResponse(data, safe=False)

    def save_to_npz(self, data, model_id):
        file_name = f'/home/ubuntu/20thao.nt/dms-backend/be/data_model_{model_id}.npz'
        np.savez(file_name, data=json.dumps(data))
        print(f"File saved at {file_name}")

class LoadImageFeatures(APIView):
    parser_classes = [JSONParser]

    def get(self, request, *args, **kwargs):
        model_id = request.query_params.get('model_id')
        if model_id is None:
            return JsonResponse({'error': 'No model ID provided'}, status=400)
        
        model_id = int(model_id)
        file_name = f'/home/ubuntu/20thao.nt/dms-backend/be/data_model_{model_id}.npz'
        
        try:
            data = np.load(file_name)
            data = json.loads(data['data'].item())  # Convert the loaded string back to a Python object
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
        return JsonResponse(data, safe=False)

class SimilaritySearchPreLoad(APIView):
    def post(self, request, *args, **kwargs):
        print("=====================Similarity search endpoint called...===========================")
        uploaded_file = request.FILES.get('image_file')
        if not uploaded_file:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        num_k = request.data.get('num_k')
        if not num_k:
            return JsonResponse({'error': 'No relate number provided'}, status=400)
        
        num_k = int(num_k)

        model_id = request.data.get('model_id')
        if model_id is None:
            return JsonResponse({'error': 'No model ID provided'}, status=400)
        
        model_id = int(model_id)

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        if model_id == 0:
            model_file_name = 'resnet18d.ra2_in1k.pth'
            checkpoint = "2024-04-01_01-39-46"
            model_path = f"/home/ubuntu/20thao.nt/AIC/pytorch-timm-image-classifier/{checkpoint}/{model_file_name}"
            CLASS_LIST = ["drinking", "eating", "normal-driving", "phone-call", "text"]

            model = timm.create_model('resnet18d', pretrained=True, num_classes=len(CLASS_LIST))
            model.load_state_dict(torch.load(model_path))
            model.to(device)
            model.eval()

            input_image = Image.open(uploaded_file).convert('RGB')
            transform = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            input_image_tensor = transform(input_image).unsqueeze(0).to(device)

            with torch.no_grad():
                input_feature = model(input_image_tensor).view(-1)

            feature_data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features.npz')
            all_features = feature_data['features']
            all_labels = feature_data['labels']
            image_paths = feature_data['image_paths']

            pre_gen_data = np.load(f'/home/ubuntu/20thao.nt/dms-backend/be/data_model_0.npz')
            pre_gen_data = json.loads(pre_gen_data['data'].item())
        elif model_id == 1:
            feature_data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features2.npz')
            all_features = feature_data['features']
            all_labels = feature_data['labels']
            image_paths = feature_data['image_paths']

            model_file_name = 'resnet18d.ra2_in1k.pth'
            checkpoint = "2024-04-21_15-04-57"
            model_path = f"/home/ubuntu/20thao.nt/OCC/pytorch-timm-image-classifier/{checkpoint}/{model_file_name}"
            CLASS_LIST = ['left_eye', 'right_eye', 'mouth']

            model = timm.create_model('resnet18d', pretrained=True, num_classes=len(CLASS_LIST))
            model.load_state_dict(torch.load(model_path))
            model.to(device)
            model.eval()

            input_image = Image.open(uploaded_file).convert('RGB')
            transform = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            input_image_tensor = transform(input_image).unsqueeze(0).to(device)

            with torch.no_grad():
                input_feature = model(input_image_tensor).view(-1)

            pre_gen_data = np.load(f'/home/ubuntu/20thao.nt/dms-backend/be/data_model_1.npz')
            pre_gen_data = json.loads(pre_gen_data['data'].item())
        else:
            return JsonResponse({'error': 'Invalid model ID provided'}, status=400)

        input_feature = input_feature.cpu().numpy().flatten()
        distances = [
            (distance.cosine(input_feature, feature), label, path) 
            for feature, label, path in zip(all_features, all_labels, image_paths)
        ]
        distances.sort(key=lambda x: x[0])

        # Retrieve pre-generated URLs
        results = []
        for score, label, path in distances[:num_k]:
            pre_gen_item = next((item for item in pre_gen_data if item['file_name'] == path.split('/')[-1]), None)
            if pre_gen_item:
                result = {
                    'path': path,
                    'label': label,
                    'similarity_score': score,
                    'presigned_url': pre_gen_item['presigned_url']
                }
                results.append(result)

        return JsonResponse({'results': results})

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








