from rest_framework import generics
from .models import NFCTag
from .serializers import NFCTagSerializer

#ADD new tags & view all tags
class NFCTagListCreateView(generics.ListCreateAPIView):
    queryset = NFCTag.objects.all()
    serializer_class = NFCTagSerializer

#search, edit, remove tag
class NFCTagRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NFCTag.objects.all()
    serializer_class = NFCTagSerializer
    lookup_field = 'tag_id'