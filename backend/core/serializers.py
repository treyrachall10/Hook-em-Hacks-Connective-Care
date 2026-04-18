from rest_framework import serializers

from .models import Message


class PatientMessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source="sender.id", read_only=True)
    sender_role = serializers.CharField(source="sender.role", read_only=True)
    message = serializers.CharField(source="text", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender_id", "sender_role", "message", "created_at"]
