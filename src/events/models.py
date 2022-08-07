from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Event(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    shared_users = models.ManyToManyField(User, related_name='shared_events', blank=True)
    title = models.CharField(max_length=100)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()