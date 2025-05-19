from django.db import models
import os
import shutil
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
    artists = models.ForeignKey('Artists', on_delete=models.CASCADE,null=True,blank=True)
    album = models.ForeignKey('Album', on_delete=models.CASCADE, null=True,blank=True)
    duration = models.FloatField(blank=True, null=True)
    release_date = models.DateField(auto_now_add=True)
    image_url = models.ImageField(upload_to='Img/Track/',null=True,blank=True)
    point = models.IntegerField(null=True,blank=True)
    is_Prenium = models.BooleanField(default=False)
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
    image_url = models.ImageField(upload_to='Img/media/User/', null=True, blank=True)
    
    def save(self, *args, **kwargs):
        is_new_user = not self.pk
        
        # Lưu user trước để có ID
        super().save(*args, **kwargs)
        
        # Nếu là user mới và chưa có avatar, gán avatar mặc định
        if is_new_user and not self.image_url:
            # Đường dẫn đến avatar mặc định
            # Thay đổi đường dẫn từ 'default_avatar' thành 'Img/default_avatar'
            default_avatar = os.path.join(settings.MEDIA_ROOT, 'Img', 'default_avatar', 'default_avatar.png')
            
            # Tạo thư mục lưu avatar người dùng nếu chưa có
            user_avatar_dir = os.path.join(settings.MEDIA_ROOT, 'Img', 'media', 'User')
            os.makedirs(user_avatar_dir, exist_ok=True)
            
            # Tạo tên file mới với ID người dùng để tránh trùng lặp
            new_avatar_name = f'avatar_{self.username}_{self.id}.png'
            new_avatar_path = os.path.join(user_avatar_dir, new_avatar_name)
            
            # Sao chép avatar mặc định sang vị trí mới
            try:
                # Kiểm tra nếu file mặc định tồn tại
                if os.path.exists(default_avatar):
                    # Sao chép file
                    shutil.copy(default_avatar, new_avatar_path)
                    
                    # Cập nhật đường dẫn avatar trong database
                    # Lưu ý: đường dẫn phải tương đối với MEDIA_ROOT
                    relative_path = os.path.join('Img', 'media', 'User', new_avatar_name)
                    self.image_url = relative_path
                    
                    # Lưu lại (chỉ cập nhật trường image_url)
                    super().save(update_fields=['image_url'])
                else:
                    print(f"Không tìm thấy avatar mặc định tại: {default_avatar}")
            except Exception as e:
                print(f"Lỗi khi sao chép avatar mặc định: {e}")
class Playlist(models.Model):
    title = models.CharField( max_length=50)
    users = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image_url = models.ImageField(upload_to='Img/Playlist/',null=True,blank=True)
    song = models.ManyToManyField('Track',blank=True)

