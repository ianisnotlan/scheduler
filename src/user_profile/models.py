from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)