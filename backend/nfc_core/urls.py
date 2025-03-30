from django.urls import path
from . import views

urlpatterns = [
    path('tags/', views.NFCTagListCreateView.as_view(), name='nfc-tag-list-create'),
    path('tags/<str:tag_id>/', views.NFCTagRetrieveUpdateDestroyView.as_view(), name='nfc-tag-detail'),
]
