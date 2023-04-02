from django.db import models
from django.utils import timezone
import hashlib
import datetime

# Create your models here.
class Auth(models.Model):
    username = models.CharField(max_length=50)
    email = models.CharField(max_length=60)
    password = models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"{self.id}, {self.username}, {self.email}, {self.password}"


class Posts(models.Model):
    user = models.ForeignKey(Auth, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    content = models.CharField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.user.id, self.title, self.content}"