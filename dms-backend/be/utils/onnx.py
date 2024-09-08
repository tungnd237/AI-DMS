import onnxruntime as ort
import numpy as np
from PIL import Image

class ImageClassifier:
    def __init__(self, model_path):
        self.session = ort.InferenceSession(model_path)
        self.class_labels = ['drinking', 'eating', 'using phone', 'texting']

    def preprocess_image(self, image_path):
        img = Image.open(image_path)
        img = img.resize((224, 224))
        img_data = np.array(img)
        img_data = img_data.astype('float32') / 255.0
        img_data = np.transpose(img_data, [2, 0, 1])
        img_data = np.expand_dims(img_data, axis=0)
        return img_data

    def predict(self, image_path):
        img_data = self.preprocess_image(image_path)
        outputs = self.session.run(None, {self.session.get_inputs()[0].name: img_data})
        probabilities = outputs[0]
        predictions = {label: float(prob) for label, prob in zip(self.class_labels, probabilities[0])}
        return predictions

class ImageEmbeddingExtractor:
    def __init__(self, model_path):
        self.session = ort.InferenceSession(model_path)

    def preprocess_image(self, image_path):
        img = Image.open(image_path)
        img = img.resize((224, 224))
        img_data = np.array(img)
        img_data = img_data.astype('float32') / 255.0
        img_data = np.transpose(img_data, [2, 0, 1])
        img_data = np.expand_dims(img_data, axis=0)
        return img_data

    def extract_features(self, image_path):
        img_data = self.preprocess_image(image_path)
        feature_map = self.session.run(None, {self.session.get_inputs()[0].name: img_data})
        return feature_map[0]  
