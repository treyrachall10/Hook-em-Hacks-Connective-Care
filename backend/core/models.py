from django.db import models


class ActorRole(models.TextChoices):
    PATIENT = "patient", "Patient"
    FAMILY = "family", "Family"
    NURSE = "nurse", "Nurse"


class ConsciousnessStatus(models.TextChoices):
    AWAKE = "awake", "Awake"
    ASLEEP = "asleep", "Asleep"
    RESTLESS = "restless", "Restless"


class CallRequestStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    APPROVED = "approved", "Approved"
    DECLINED = "declined", "Declined"
    COMPLETED = "completed", "Completed"


class Actor(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=32, choices=ActorRole.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return f"{self.name} ({self.role})"


class Patient(models.Model):
    name = models.CharField(max_length=255)
    room_number = models.CharField(max_length=64)
    current_state = models.CharField(
        max_length=32, choices=ConsciousnessStatus.choices
    )
    current_status_started_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return f"{self.name} ({self.room_number})"


class ActorPatientLink(models.Model):
    actor = models.ForeignKey(
        Actor,
        on_delete=models.CASCADE,
        related_name="patient_links",
    )
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="actor_links",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return f"{self.actor_id} -> {self.patient_id}"


class PatientStatusHistory(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="status_history",
    )
    status = models.CharField(max_length=32, choices=ConsciousnessStatus.choices)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    source = models.CharField(max_length=128, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at", "-id"]
        verbose_name_plural = "Patient status histories"

    def __str__(self) -> str:
        return f"{self.patient_id} {self.status} @ {self.started_at}"


class CallRequest(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="call_requests",
    )
    requested_by = models.ForeignKey(
        Actor,
        on_delete=models.CASCADE,
        related_name="call_requests_requested",
    )
    reviewed_by = models.ForeignKey(
        Actor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="call_requests_reviewed",
    )
    status = models.CharField(
        max_length=32,
        choices=CallRequestStatus.choices,
        default=CallRequestStatus.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self) -> str:
        return f"CallRequest {self.patient_id} ({self.status})"


class Message(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.ForeignKey(
        Actor,
        on_delete=models.CASCADE,
        related_name="messages_sent",
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at", "id"]

    def __str__(self) -> str:
        return f"Message {self.id} (patient {self.patient_id})"
