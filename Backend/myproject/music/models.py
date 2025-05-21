from django.db import models
import os
from django.contrib.auth.models import AbstractUser
from mutagen import File as MutagenFile
from django.conf import settings
from moviepy import *
def track_upload_path(instance, filename):
    category = instance.category.lower()
    return os.path.join(category, filename)
class Artists(models.Model):
    name = models.CharField(max_length=50)
    image_url = models.ImageField(upload_to='Img/Artists/',null=True,blank=True)
class Track(models.Model):
    title = models.CharField(max_length=100)
    artists = models.ForeignKey('Artists', on_delete=models.CASCADE, related_name='tracks')
    album = models.ForeignKey('Album', on_delete=models.CASCADE, null=True,blank=True)
    duration = models.FloatField(blank=True, null=True)
    release_date = models.DateField(auto_now_add=True)
    image_url = models.ImageField(upload_to='Img/Track/',null=True,blank=True)
    point = models.IntegerField(null=True,blank=True)
    is_Premium = models.BooleanField(default=False)
    category = models.CharField(choices=[('audio', 'Audio'), ('video', 'Video')], max_length=50)
    file = models.FileField(upload_to=track_upload_path)
    lyrics = models.TextField(blank=True, null=True)
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Lưu file trước để self.file.path có giá trị
        if self.file and self.file.path and os.path.exists(self.file.path):
            try:
                if self.category == 'audio':
                    audio = MutagenFile(self.file.path)
                    if audio and audio.info.length:
                        self.duration = round(audio.info.length, 2)

                elif self.category == 'video':
                    clip = VideoFileClip(self.file.path)
                    self.duration = round(clip.duration, 2)
                    clip.close()  # rất quan trọng để tránh khóa file
            except Exception as e:
                print("Lỗi khi đọc duration:", e)
            # Ghi lại duration nếu có
            super().save(update_fields=['duration'])

class Album(models.Model):
    title = models.CharField(max_length=50)
    artists =  models.ForeignKey('Artists', on_delete=models.CASCADE)
    image_url = models.ImageField(upload_to='Img/Album/',null=True,blank=True)
    point = models.IntegerField()
    decription=models.TextField(blank=True,null=True)
    release_date = models.DateField(auto_now_add=True)
class CustomUser(AbstractUser):
    is_premium = models.BooleanField(default=False)
    image_url = models.ImageField(upload_to='Img/media/User/',null=True,blank=True)
class Playlist(models.Model):
    title = models.CharField( max_length=50)
    users = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image_url = models.ImageField(upload_to='Img/Playlist/',null=True,blank=True)
    song = models.ManyToManyField('Track',blank=True)

