import numpy as np
from models import FeatureData

data = np.load('reduced_features.npz')
features = data['features']
labels = data['labels']
image_paths = data['image_paths']

for feature, label, image_path in zip(features, labels, image_paths):
    FeatureData.objects.create(features=feature.tolist(), labels=label, image_path=image_path)