from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Event

User = get_user_model()

class EventSerializer(serializers.ModelSerializer):
    creator = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username'
    )
    shared_users = serializers.SlugRelatedField(
        many=True,
        queryset=User.objects.all(),
        slug_field='username'
    )
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id']