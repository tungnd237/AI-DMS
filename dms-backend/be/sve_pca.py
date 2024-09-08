import numpy as np
from sklearn.decomposition import PCA

data = np.load('features2.npz')
features = data['features']
labels = data['labels']
image_paths = data['image_paths']

pca = PCA(n_components=3)
reduced_features = pca.fit_transform(features)

np.savez('reduced_features2.npz', features=reduced_features, labels=labels, image_paths=image_paths)
print("it is saved")

