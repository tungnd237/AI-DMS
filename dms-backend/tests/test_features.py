from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
import numpy as np
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
import numpy as np

class ImageFeaturesTestUnitTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = 'api/v1/images/features2'  # Update this to your actual endpoint URL

    @patch('be.views.FeatureData')
    @patch('be.views.generate_presigned_urls')
    @patch('be.views.np.load')
    def test_get_features(self, mock_np_load, mock_generate_presigned_urls, mock_FeatureData):
        # Mock the np.load return value
        mock_np_load.side_effect = [
            {
                'labels': np.array([0, 1]),
                'image_paths': np.array(['path1.jpg', 'path2.jpg']),
                'cluster_labels': np.array([0, 1])
            },
            {
                'features': np.array([[0.1, 0.2], [0.3, 0.4]])
            }
        ]

        # Mock the FeatureData model
        mock_FeatureData.objects.values.return_value = [
            {'features': [0.1, 0.2], 'labels': 0, 'image_path': 'path1.jpg', 'cluster_labels': 0},
            {'features': [0.3, 0.4], 'labels': 1, 'image_path': 'path2.jpg', 'cluster_labels': 1}
        ]

        # Mock the generate_presigned_urls function
        mock_generate_presigned_urls.return_value = ['url1', 'url2']

        response = self.client.get(self.url, {'model_id': 0})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 2)
        for item in response.json():
            self.assertIn('features', item)
            self.assertIn('labels', item)
            self.assertIn('cluster_labels', item)
            self.assertIn('presigned_url', item)
            self.assertIn('file_name', item)

class ImageFeaturesComponentTest(APITestCase):
    def setUp(self):
        self.url = reverse('api/v1/images/features2')  # Update this to your actual endpoint URL

    @patch('be.views.FeatureData')
    @patch('be.views.generate_presigned_urls')
    @patch('be.views.np.load')
    def test_get_features_integration(self, mock_np_load, mock_generate_presigned_urls, mock_FeatureData):
        # Mock the np.load return value
        mock_np_load.side_effect = [
            {
                'labels': np.array([0, 1]),
                'image_paths': np.array(['path1.jpg', 'path2.jpg']),
                'cluster_labels': np.array([0, 1])
            },
            {
                'features': np.array([[0.1, 0.2], [0.3, 0.4]])
            }
        ]

        # Mock the FeatureData model
        mock_FeatureData.objects.values.return_value = [
            {'features': [0.1, 0.2], 'labels': 0, 'image_path': 'path1.jpg', 'cluster_labels': 0},
            {'features': [0.3, 0.4], 'labels': 1, 'image_path': 'path2.jpg', 'cluster_labels': 1}
        ]

        # Mock the generate_presigned_urls function
        mock_generate_presigned_urls.return_value = ['url1', 'url2']

        response = self.client.get(self.url, {'model_id': 0})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 2)
        for item in response.json():
            self.assertIn('features', item)
            self.assertIn('labels', item)
            self.assertIn('cluster_labels', item)
            self.assertIn('presigned_url', item)
            self.assertIn('file_name', item)
