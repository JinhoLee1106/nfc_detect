from rest_framework import generics, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from .models import NFCTag
from .serializers import NFCTagSerializer
from django.db.models import Q


class NFCTagListCreateView(generics.ListCreateAPIView):
    queryset = NFCTag.objects.all()
    serializer_class = NFCTagSerializer

    def create(self, request, *args, **kwargs):
        tag_id = request.data.get('tag_id')
        if tag_id:
            tag_id = tag_id.lower()
            request.data['tag_id'] = tag_id

            existing = NFCTag.objects.filter(tag_id__iexact=tag_id).first()
            if existing:
                serializer = self.get_serializer(existing)
                return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(tag_id=tag_id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NFCTagRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NFCTag.objects.all()
    serializer_class = NFCTagSerializer
    lookup_field = 'tag_id'

    def get_object(self):
        queryset = self.get_queryset()
        tag_id = self.kwargs.get('tag_id').lower()
        return get_object_or_404(queryset, tag_id__iexact=tag_id)
