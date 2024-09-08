from django.db import models

# Create your models here.
class Tag(models.Model):
    tag_name = models.CharField(max_length=100)
    confidence = models.FloatField()

class Camera(models.Model):
    type = models.CharField(max_length=50)
    position = models.CharField(max_length=50)

class Image(models.Model):
    image_url = models.URLField()
    created_at = models.DateTimeField()
    collected_at = models.DateTimeField()
    tags = models.ManyToManyField(Tag)
    # For metadata, you could create a JSON field or a related model
    metadata = models.JSONField()

class FeatureData(models.Model):
    features = models.JSONField()
    labels = models.IntegerField()
    image_path = models.CharField(max_length=255)
    cluster_labels = models.IntegerField(default=1)

class FeatureData2(models.Model):
    features = models.JSONField()
    labels = models.JSONField()  # Change labels to JSONField to accommodate multi-class labels
    image_path = models.CharField(max_length=255)
    cluster_labels = models.IntegerField(default=1)

