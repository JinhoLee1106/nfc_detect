from django.db import models

# Create your models here.

class NFCTag(models.Model):
    tag_id = models.CharField(max_length=100, unique=True)
    user_name = models.CharField(max_length=100)
    user_role = models.CharField(max_length=50, blank=True)
    auth_hash = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tag_id} - {self.user_name}"