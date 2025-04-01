from django.urls import path
from .views import NFCTagListCreateView, NFCTagRetrieveUpdateDestroyView

urlpatterns = [
    path('tags/', NFCTagListCreateView.as_view(), name='tag-list-create'),
    path('tags/<str:tag_id>/', NFCTagRetrieveUpdateDestroyView.as_view(), name='tag-detail'),
]
