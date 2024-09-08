from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from faker import Faker

class ImageUploadViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/image-upload/'  # Update this to your actual endpoint URL

    def test_image_upload(self):
        payload = {
            'image_url': 'http://example.com/image.jpg',
            'page_limit': '5'
        }
        response = self.client.post(self.url, payload, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('related_images', response.data)
        self.assertEqual(len(response.data['related_images']), int(payload['page_limit']))

        for image in response.data['related_images']:
            self.assertIn('image_id', image)
            self.assertIn('image_url', image)
            self.assertIn('created_at', image)
            self.assertIn('collected_at', image)
            self.assertIn('tags', image)
            self.assertIn('metadata', image)

            for tag in image['tags']:
                self.assertIn('tag_id', tag)
                self.assertIn('tag_name', tag)
                self.assertIn('confidence', tag)

class ImageUploadComponentTest(APITestCase):
    def setUp(self):
        self.url = reverse('image-upload')  # Update this to your actual endpoint URL
        self.payload = {
            'image_url': 'http://example.com/image.jpg',
            'page_limit': '5'
        }
        self.faker = Faker()

    @patch('your_app.views.Faker')
    def test_image_upload_integration(self, MockFaker):
        faker_instance = MockFaker.return_value
        faker_instance.unique.uuid4.return_value = self.faker.unique.uuid4()
        
        response = self.client.post(self.url, self.payload, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('related_images', response.data)
        self.assertEqual(len(response.data['related_images']), int(self.payload['page_limit']))

        for image in response.data['related_images']:
            self.assertIn('image_id', image)
            self.assertIn('image_url', image)
            self.assertIn('created_at', image)
            self.assertIn('collected_at', image)
            self.assertIn('tags', image)
            self.assertIn('metadata', image)

            for tag in image['tags']:
                self.assertIn('tag_id', tag)
                self.assertIn('tag_name', tag)
                self.assertIn('confidence', tag)
                
