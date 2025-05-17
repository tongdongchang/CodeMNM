from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import *
from rest_framework.parsers import MultiPartParser, FormParser
from .serializer import *
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import IntegrityError
class AritistList(APIView):
    def get(self,request):
     artist=Artists.objects.all()
     serializer=ArtistSerializer(artist,many=True)
     return Response(serializer.data)
class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile = request.user 
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    def post(self,request):
        profile= request.user
        profile.is_premium = True
        profile.save()
        return Response({'message':'You are now prenium'},status=201)
class TrackList(APIView):
    def get(self,request):
        category=request.query_params.get('category','').strip()
        id= request.query_params.get('id','').strip()
        if category=='video' and not id:
            track=Track.objects.filter(category='video').exclude(id=1).order_by('-point')[:8]
        elif category=='audio':
            track=Track.objects.filter(category='audio')
            serializer=TrackSerializer(track,many=True,context={'request': request})
            return Response(serializer.data)
        else:
            track=Track.objects.all().order_by('-point')
        if id and category=='video':
            track=Track.objects.get(id=id)
            serializer=TrackSerializer(track,many=False,context={'request': request})
            return Response(serializer.data)
        serializer=TrackSerializer(track,many=True,context={'request': request})
        return Response(serializer.data)
class TrackListSearch(APIView):
    def get(self, request):
        category = request.query_params.get('category', '').strip()
        title = request.query_params.get('title', '').strip()  # ← PHẢI CÓ DẤU NGOẶC
        print(123)
        if category == 'audio' and title:
            track = Track.objects.filter(title__icontains=title, category=category)
            serializer = TrackASerializer(track, many=True, context={'request': request})
            return Response(serializer.data)
        return Response([])
class AlbumList(APIView):
    def get(self,request):
        album=Album.objects.all().order_by('-point')
        fields=request.query_params.get('fields','').strip()
        fields_set=fields.split(',')
        fields_total=[x.strip() for x in fields_set if x!='']
        if fields_total:
            data=album.values(*fields_total)
            return Response(data)
        serializer=AlbumSerializer(album,many=True)
        return Response(serializer.data)
class Register(APIView):
    def post(self, request):
        try:
            username = request.data.get('username', '').strip()
            email = request.data.get('email', '').strip()
            password = request.data.get('password', '').strip()
            confirmPassword = request.data.get('confirmPassword', '').strip()
            if not username or not email or not password:
                return Response({'error': 'Không được để trống các trường!'}, status=400)
            if len(password) < 6:
                return Response({'error': 'Mật khẩu phải có ít nhất 6 ký tự!'}, status=400)
            if not email.endswith('@gmail.com'):
                return Response({'error': 'Email phải có đuôi @gmail.com'}, status=400)
            if password!=confirmPassword:
                return Response({'error': 'ConfirmPassword phải giống nhau!'}, status=400)
            if CustomUser.objects.filter(username=username).exists():
                return Response({'error': 'Username đã tồn tại!'}, status=400)
            user = CustomUser.objects.create_user(username=username, email=email, password=password)
            return Response({'message': 'Đăng ký thành công!'}, status=201)

        except Exception as e:
            return Response({'error': 'lỗi'}, status=500)
class ListTrackFromAlbum(APIView):
    def get(self, request):
        album_id = request.query_params.get('id', '')
        album = get_object_or_404(Album, id=album_id)
        serializer = ListTrackFromAlbumSerializer(album, context={'request': request})
        return Response(serializer.data)
class ListPlaylist(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        playlist_id = request.query_params.get('id','').strip()
        if playlist_id:
            playlist = get_object_or_404(Playlist,id=playlist_id)
            serializer=PlaylistSerializer(playlist,many=False,context={'request':request})
            return Response(serializer.data)
        playlist = Playlist.objects.filter(users=request.user)
        serializer = PlaylistSerializer(playlist, many=True, context={'request': request})
        return Response(serializer.data)
    def post(self, request):
        title = request.data.get('title', '').strip()
        if not title:
            return Response({'error': 'Title is required'}, status=400)
        new = Playlist.objects.create(title=title, users=request.user)
        return Response({'message': 'Playlist created'}, status=201)
class AddTrackToPlaylist(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        playlistid= request.data.get('playlistid','')
        id= request.data.get('id','')
        if playlistid and id:
            track= get_object_or_404(Track,id=id)
            playlist=get_object_or_404(Playlist,id=playlistid)
            playlist.song.add(track)
            return Response({'message':'Add success'})
        return Response({'error':'Fail'})
class Search(APIView):
    def get(self,request):
        title=request.query_params.get('title','').strip()
        category=request.query_params.get('category','').strip()
        if title:
            if category=='audio':
                audio=Track.objects.filter(title__icontains=title).exclude(category='video')
                serialier = TrackASerializer(audio,many=True,context={'request':request})
                return Response(serialier.data)
            if category=='video':
                video=Track.objects.filter(title__icontains=title).exclude(category='audio')
                serialier = TrackASerializer(video,many=True,context={'request':request})
                return Response(serialier.data)
            if category=='album':
                album= Album.objects.filter(title__icontains=title)
                serialier=AlbumSerializer(album,many=True,context={'request':request})
                return Response(serialier.data)
        return Response({'error':'Lỗi rồi'},status=400)
class playlistEdit(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            id = request.data.get('id', '').strip()
            title = request.data.get('title', '').strip()
            image_url = request.FILES.get('image_url', None)
            if (title or image_url) and id:
                playlist = get_object_or_404(Playlist, id=id)
                playlist.title = title if title else playlist.title
                playlist.image_url = image_url if image_url else playlist.image_url
                playlist.save()
                return Response({'message': 'success'}, status=201)

            return Response({'error': 'Nothing to update'}, status=400)

        except Exception as e:
            print(f"Error occurred: {e}")
            return Response({'error': str(e)}, status=450)
class TrackChanging(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request):
        title = request.data.get('title', '').strip()
        album = request.data.get('album', '').strip()
        category = request.data.get('category', '').strip()
        file = request.FILES.get('file', None)
        if title and category and file:
            track = Track.objects.create(title=title, category=category, file=file)
            return Response({'message': 'success add'})
        return Response({'error': 'Nothing add'}, status=400)
        