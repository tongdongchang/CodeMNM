from django.contrib import admin
from .models import Artists  # ← Thay thế bằng model của bạn
from .models import  Track 
from django.contrib.auth.admin import UserAdmin
from .models import  Album 
from .models import  Playlist 
from .models import  CustomUser
admin.site.register(Artists)
admin.site.register(Track)
admin.site.register(Album)
admin.site.register(Playlist)
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Hiển thị trong list view
    list_display = ['username', 'email', 'is_staff', 'is_active', 'is_premium','image_url']
    # Cho phép filter
    list_filter = ['is_staff', 'is_active', 'is_premium','image_url']

    # Thêm is_premium vào phần form khi tạo/sửa user
    fieldsets = UserAdmin.fieldsets + (
        ('Tai Khoan Prenium', {'fields': ('is_premium','image_url')}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Tai Khoan Prenium', {'fields': ('is_premium','image_url')}),
    )
# Register your models here.
