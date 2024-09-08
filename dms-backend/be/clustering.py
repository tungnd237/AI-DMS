import numpy as np
from sklearn.cluster import KMeans

data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/features.npz')
all_features = data['features']
all_labels = data['labels']
all_paths = data['image_paths']

# Print the shape of the features array
print(all_features.shape)

# Print the first feature vector
print(all_features[0])

# Perform KMeans clustering with 5 clusters
kmeans = KMeans(n_clusters=8, random_state=42)
kmeans.fit(all_features)
cluster_labels = kmeans.labels_

# Save the clustered data
np.savez('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data.npz', 
         features=all_features, 
         labels=all_labels, 
         image_paths=all_paths, 
         cluster_labels=cluster_labels)

print("done")

data1 = np.load('/home/ubuntu/20thao.nt/dms-backend/be/clustered_data.npz')
all_features1 = data1['features']
all_labels1 = data1['labels']
all_paths1 = data1['image_paths']
all_clusters1 = data1['cluster_labels']

data = np.load('/home/ubuntu/20thao.nt/dms-backend/be/reduced_features.npz')
all_features2 = data['features']
all_labels2 = data['labels']
all_paths2 = data['image_paths']

print(all_paths[10])
print(all_paths1[10])
print(all_paths2[10])
print(all_features[10])
print(all_features1[10])
print(all_features2[10])
print(all_labels[10])
print(all_labels1[10])
print(all_labels2[10])

print(all_paths[1])
print(all_paths1[1])
print(all_paths2[1])
print(all_features[1])
print(all_features1[1])
print(all_features2[1])
print(all_labels[1])
print(all_labels1[1])
print(all_labels2[1])
