# serializers.py
from rest_framework import serializers
from .models import Image, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    class Meta:
        model = Image
        fields = ['image_id', 'image_url', 'created_at', 'collected_at', 'tags', 'metadata']

class ImageUploadSerializer(serializers.Serializer):
    image_url = serializers.URLField()
    model_id = serializers.CharField()
    page_offset = serializers.CharField()
    page_limit = serializers.CharField()