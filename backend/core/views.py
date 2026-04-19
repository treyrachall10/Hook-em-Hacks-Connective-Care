from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Actor, Message, Patient
from .serializers import PatientMessageSerializer


class PatientMessageListView(generics.ListAPIView):
    serializer_class = PatientMessageSerializer

    def get_queryset(self):
        patient_id = self.kwargs["patient_id"]
        return Message.objects.filter(patient_id=patient_id).order_by("created_at", "id")


class MessagePatchView(APIView):
    """
    PATCH body JSON: patient_id, sender_id, message (maps to Message.text).
    """

    def patch(self, request, *args, **kwargs):
        patient_id = request.data.get("patient_id")
        sender_id = request.data.get("sender_id")
        text = request.data.get("message")

        if patient_id is None or sender_id is None or text is None:
            return Response(
                {"detail": "patient_id, sender_id, and message are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        get_object_or_404(Patient, pk=patient_id)
        get_object_or_404(Actor, pk=sender_id)

        msg = Message.objects.create(
            patient_id=patient_id,
            sender_id=sender_id,
            text=text,
        )
        return Response(
            PatientMessageSerializer(msg).data,
            status=status.HTTP_200_OK,
        )
