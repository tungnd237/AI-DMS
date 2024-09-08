# urls.py
from django.urls import path
from .views import ImageUploadView, ImageQueryView, ImageClassifierView, DirectImageSimilarity, ImageFeatures, SimilaritySearch, SimilaritySearchTest, ImageFeaturesTest, SimilaritySearchDemo, ImageFeaturesSave, LoadImageFeatures, SimilaritySearchPreLoad

urlpatterns = [
    path('api/v1/images/upload', ImageUploadView.as_view(), name='image-upload'),
    path('api/v1/images/query', ImageQueryView.as_view(), name='image-query'),
    # onnx api
    path('api/v1/images/classify', ImageClassifierView.as_view(), name='image-classify'),
    path('api/v1/images/simsearch-dr', DirectImageSimilarity.as_view(), name='image-similarity-search-direct'),
    path('api/v1/images/features', ImageFeatures.as_view(), name='get_features'),
    path('api/v1/images/search', SimilaritySearch.as_view(), name='similarity-search'),
    path('api/v1/images/search2', SimilaritySearchTest.as_view(), name='simi-search2'),
    path('api/v1/images/features2', ImageFeaturesTest.as_view(), name='get_features2'),
    path('api/v1/images/search3', SimilaritySearchDemo.as_view(), name='search-demo'), #version for demo without loading model
    path('api/v1/images/save', ImageFeaturesSave.as_view(), name='save'),
    path('api/v1/images/features3', LoadImageFeatures.as_view(), name='get_features3'),
    path('api/v1/images/search4', SimilaritySearchPreLoad.as_view(), name='simi-search3')
]
