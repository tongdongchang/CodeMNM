from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artists
        fields = '__all__'

class TrackSerializer(serializers.ModelSerializer):
    artists = serializers.CharField(source='artists.name', read_only=True)
    album = serializers.CharField(source='album.id', read_only=True)
    image_url = serializers.SerializerMethodField()
    file = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = [
            'id', 'title', 'artists', 'album', 'duration', 'release_date',
            'is_Premium', 'category', 'image_url', 'file'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_url and hasattr(obj.image_url, 'url'):
            return request.build_absolute_uri(obj.image_url.url)
        return None

    def get_file(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None
    
class AlbumSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    artist_name = serializers.CharField(source='artists.name', read_only=True)
    total_tracks = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = '__all__'  # hoặc liệt kê cụ thể: ['id', 'title', 'artists', 'image_url', 'point', 'release_date', 'decription', 'artist_name', 'total_tracks']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_url and hasattr(obj.image_url, 'url'):
            return request.build_absolute_uri(obj.image_url.url)
        return None

    def get_total_tracks(self, obj):
        return obj.track_set.count()

    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['is_premium','image_url']

class TrackASerializer(serializers.ModelSerializer):
    artists = serializers.CharField(source='artists.name')
    album = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = [
            'id', 'title', 'duration', 'release_date', 'is_Premium',
            'file', 'image_url', 'artists', 'album', 'category'  # Thêm dòng này
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_url and hasattr(obj.image_url, 'url'):
            return request.build_absolute_uri(obj.image_url.url)
        return None

    def get_album(self, obj):
        return obj.album.title if obj.album else None
    
class ListTrackFromAlbumSerializer(serializers.ModelSerializer):
    track_set = TrackASerializer(many=True, read_only=True)
    artists= serializers.CharField(source='artists.name')
    image_url=serializers.SerializerMethodField()
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_url and hasattr(obj.image_url, 'url'):
            return request.build_absolute_uri(obj.image_url.url)
        return None
    class Meta: 
        model = Album
        fields = ['title','artists','image_url','decription','release_date','track_set']

class PlaylistSerializer(serializers.ModelSerializer):
    image_url=serializers.SerializerMethodField()
    song = TrackASerializer(many=True)
    users = serializers.CharField(source='users.username')
    class Meta:
        model=Playlist
        fields='__all__'
    def get_image_url(self,obj):
        if obj.image_url:
           request=self.context.get('request')
           return request.build_absolute_uri(obj.image_url.url)
        else:
            return None
        
class UserSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_premium', 'is_staff', 'image_url', 'date_joined']
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_url and hasattr(obj.image_url, 'url'):
            return request.build_absolute_uri(obj.image_url.url)
        return None


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Thêm thông tin vào token payload nếu muốn giải mã bên frontend
        token['username'] = user.username
        token['role'] = 'admin' if user.is_staff else 'user'
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Thêm thông tin vào response trả về
        data['username'] = self.user.username
        data['role'] = 'admin' if self.user.is_staff else 'user'
        return data