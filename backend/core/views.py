from rest_framework import generics

from .models import Message
from .serializers import PatientMessageSerializer


class PatientMessageListView(generics.ListAPIView):
    serializer_class = PatientMessageSerializer

    def get_queryset(self):
        patient_id = self.kwargs["patient_id"]
        return Message.objects.filter(patient_id=patient_id).order_by("created_at", "id")
