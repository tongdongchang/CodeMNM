from rest_framework import serializers
from .models import *
class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artists
        fields = '__all__'
class TrackSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    file = serializers.SerializerMethodField()
    artists = serializers.CharField(source='artists.name', allow_null=True, default=None)

    class Meta:
        model = Track
        fields = '__all__'  # Hoặc liệt kê cụ thể: ['id', 'title', 'artists', 'album', 'duration', ...]

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
    image_url=serializers.SerializerMethodField()
    class Meta:
        model = Album
        fields = '__all__'
    def get_image_url(self,obj):
        request=self.context.get('request')
        return request.build_absolute_uri(obj.image_url.url)
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
class TrackASerializer(serializers.ModelSerializer):
    artists= serializers.CharField(source='artists.name')
    album= serializers.SerializerMethodField()
    image_url=serializers.SerializerMethodField()
    class Meta:
        model = Track
        fields = ['id','title','duration','release_date','is_Prenium','file','image_url','artists','album']
    def get_image_url(self, obj):
     request = self.context.get('request')
     return request.build_absolute_uri(obj.image_url.url)
    def get_album(self,obj):
     return obj.album.title if obj.album else None
class ListTrackFromAlbumSerializer(serializers.ModelSerializer):
    track_set = serializers.SerializerMethodField()
    artists= serializers.CharField(source='artists.name')
    image_url=serializers.SerializerMethodField()
    def get_image_url(self, obj):
     request = self.context.get('request')
     return request.build_absolute_uri(obj.image_url.url)
    def get_track_set(self,obj):
        tracks= obj.track_set.filter(category='audio')
        return TrackASerializer(tracks,many=True, context=self.context).data
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