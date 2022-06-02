from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
  owner = models.OneToOneField(User, on_delete=models.CASCADE)
  avatar = models.ImageField(blank=True, null=True)
  birth_date = models.DateField(blank=True, null=True)