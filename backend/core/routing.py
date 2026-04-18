from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path("ws/chat/<int:patient_id>/", ChatConsumer.as_asgi()),
]