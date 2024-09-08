# Create your tests here.
from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from unittest.mock import patch
import numpy as np
from .models import FeatureData
from PIL import Image
import torch
import timm
from .views import convert_multiclass_label, generate_presigned_urls

class SimilaritySearchTestCase(APITestCase):
    
    def setUp(self):
        self.client = APIClient()

    def test_missing_image_file(self):
        response = self.client.post('/api/v1/similarity-search/', data={'num_k': 5, 'model_id': 0})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'No image file provided'})

    def test_missing_num_k(self):
        with open('test_image.jpg', 'rb') as image:
            response = self.client.post('/api/v1/similarity-search/', data={'image_file': image, 'model_id': 0})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'No relate number provided'})

    def test_missing_model_id(self):
        with open('test_image.jpg', 'rb') as image:
            response = self.client.post('/api/v1/similarity-search/', data={'image_file': image, 'num_k': 5})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'No model ID provided'})

    def test_invalid_model_id(self):
        with open('test_image.jpg', 'rb') as image:
            response = self.client.post('/api/v1/similarity-search/', data={'image_file': image, 'num_k': 5, 'model_id': 99})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Invalid model ID provided'})

    def test_similarity_search_model_0(self):
        with open('test_image.jpg', 'rb') as image:
            response = self.client.post('/api/v1/similarity-search/', data={'image_file': image, 'num_k': 5, 'model_id': 0})
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.json())

    def test_similarity_search_model_1(self):
        with open('test_image.jpg', 'rb') as image:
            response = self.client.post('/api/v1/similarity-search/', data={'image_file': image, 'num_k': 5, 'model_id': 1})
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.json())

class ImageFeaturesTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()

    def test_missing_model_id(self):
        response = self.client.get('/api/v1/images/features2/')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'No model ID provided'})

    def test_invalid_model_id(self):
        response = self.client.get('/api/v1/images/features2/?model_id=99')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Invalid model ID provided'})

    def test_image_features_model_0(self):
        response = self.client.get('/api/v1/images/features2/?model_id=0')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_image_features_model_1(self):
        response = self.client.get('/api/v1/images/features2/?model_id=1')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
