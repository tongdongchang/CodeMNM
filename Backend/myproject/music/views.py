from .models import *
from django.db.models import Q
from django.shortcuts import render,get_object_or_404
from django.http import HttpResponse,FileResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .serializer import *
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile = request.user 
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

class TrackList(APIView):
    def get(self,request):
        category=request.query_params.get('category','').strip()
        id= request.query_params.get('id','').strip()
        if category=='video' and not id:
            track=Track.objects.filter(category='video').exclude(id=1).order_by('-point')[:8]
        elif category=='audio':
            track=Track.objects.filter(category='audio').order_by('-point')[:8]
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
    def get(self, request):
        title = request.query_params.get('title', '').strip()

        if not title:
            return Response({'error': 'Chưa nhập từ khoá tìm kiếm'}, status=400)

        track_query = Q(title__icontains=title) | Q(artists__name__icontains=title) | Q(lyrics__icontains=title)
        tracks = Track.objects.filter(track_query).distinct()
        serialized_tracks = TrackASerializer(tracks, many=True, context={'request': request}).data
        # DEBUG
        print("Kết quả tìm track:", serialized_tracks)

        audio_tracks = [t for t in serialized_tracks if t.get('category') == 'audio']
        video_tracks = [t for t in serialized_tracks if t.get('category') == 'video']

        album_query = Q(title__icontains=title) | Q(decription__icontains=title) | Q(artists__name__icontains=title)
        albums = Album.objects.filter(album_query).distinct()
        serialized_albums = AlbumSerializer(albums, many=True, context={'request': request}).data

        return Response({
            'audio': audio_tracks,
            'video': video_tracks,
            'album': serialized_albums
        })

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


#Admin
# Get list-user
class UserListView(APIView):
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)
#Get 1 User
class UserDetailView(APIView):
    def get(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)
    
# Update User
class UpdateUserAPIView(APIView):
    def put(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
        user.username = request.data.get("username", user.username)
        user.email = request.data.get("email", user.email)
        user.is_premium = request.data.get("is_premium", user.is_premium)
        user.is_staff = request.data.get("is_staff", user.is_staff)
        user.save()
        return Response({"message": "User updated successfully"})
    def delete(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
#Get list-track
class TrackList(APIView):
    def get(self,request):
        category=request.query_params.get('category','').strip()
        id= request.query_params.get('id','').strip()
        if category=='video' and not id:
            track=Track.objects.filter(category='video').exclude(id=1).order_by('-point')[:8]
        elif category=='audio':
            track=Track.objects.filter(category='audio').order_by('-point')[:8]
        else:
            track=Track.objects.all().order_by('-point')
        if id and category=='video':
            track=Track.objects.get(id=id)
            serializer=TrackSerializer(track,many=False,context={'request': request})
            return Response(serializer.data)
        serializer=TrackSerializer(track,many=True,context={'request': request})
        return Response(serializer.data)

#Add track
class AddTrack(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request):
        try:
            title = request.data.get('title', '').strip()
            album_id = request.data.get('album', '').strip()
            artist_id = request.data.get('artists')  # đây là 1 artist id vì ForeignKey
            category = request.data.get('category', '').strip()
            is_Premium = request.data.get('is_Premium', 'false') == 'true'
            file = request.FILES.get('file', None)
            image = request.FILES.get('image_url')
            if not (title and category and file and artist_id):
                return Response({'error': 'Missing required fields'}, status=400)
            album = None
            if album_id:
                album = get_object_or_404(Album, id=album_id)
            artist = get_object_or_404(Artists, id=artist_id)
            track = Track.objects.create(
                title=title,
                category=category,
                file=file,
                album=album,
                artists=artist,  # tên trường đúng
                is_Premium=is_Premium,
                image_url=image
            )
            return Response({'message': 'Track created successfully'}, status=201)
        except Exception as e:
            print(f"Error in TrackChanging: {e}")
            return Response({'error': 'Internal server error'}, status=500)
#Delete track
class DeleteTrack(APIView):
    def delete(self, request, pk):
        track = get_object_or_404(Track, pk=pk)
        track.delete()
        return Response({'message': 'Track deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

#Update track
class UpdateTrack(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def patch(self, request, pk):
        try:
            track = get_object_or_404(Track, pk=pk)
            title = request.data.get('title', None)
            album_id = request.data.get('album', None)
            artist_id = request.data.get('artists', None)
            category = request.data.get('category', None)
            is_Premium = request.data.get('is_Premium', None)
            file = request.FILES.get('file', None)
            image_url = request.FILES.get('image_url', None)
            if title is not None:
                track.title = title.strip()
            if category is not None:
                track.category = category.strip()
            if is_Premium is not None:
                track.is_Premium = str(is_Premium).lower() == 'true'
            # Xử lý artist_id:
            if artist_id in [None, '', 'null', 'None']:
                track.artists = None  # hoặc track.artists = default value nếu muốn
            else:
                artist = get_object_or_404(Artists, id=artist_id)
                track.artists = artist
            # Xử lý album_id:
            if album_id in [None, '', 'null', 'None']:
                track.album = None  # hoặc track.album = default value nếu muốn
            else:
                album = get_object_or_404(Album, id=album_id)
                track.album = album
            if file:
                track.file = file
            if image_url:  # ← THÊM DÒNG NÀY
                track.image_url = image_url
            track.save()
            return Response({'message': 'Track patched successfully'}, status=200)
        except Exception as e:
            print(f"Error patching track: {e}")
            return Response({'error': 'Internal Server Error'}, status=500)
        
#Xóa 1 track khỏi album
class RemoveAlbumFromTrack(APIView):
    def patch(self, request, pk):
        try:
            track = get_object_or_404(Track, pk=pk)
            track.album = None
            track.save()
            return Response({'message': 'Album removed from track successfully.'}, status=200)
        except Exception as e:
            print("Error:", e)
            return Response({'error': 'Internal Server Error'}, status=500)
#Lấy danh sách(get) và thêm(post)
class AritistList(APIView):
    def get(self,request):
     artist=Artists.objects.all()
     serializer=ArtistSerializer(artist,many=True)
     return Response(serializer.data)
    def post(self, request):
        try:
            name = request.data.get('name', '').strip()
            image = request.FILES.get('image_url', None)
            if not name:
                return Response({'error': 'Name is required'}, status=400)
            artist = Artists.objects.create(
                name=name,
                image_url=image
            )
            return Response({'message': 'Artist created successfully'}, status=201)
        except Exception as e:
            print(f"Error adding artist: {e}")
            return Response({'error': 'Internal server error'}, status=500)

#Sửa/Xóa artist 
class ArtistDetail(APIView):
    def get_object(self, pk):
        try:
            return Artists.objects.get(pk=pk)
        except Artists.DoesNotExist:
            return None
    def put(self, request, pk):
        artist = self.get_object(pk)
        if not artist:
            return Response({'error': 'Artist not found'}, status=404)
        name = request.data.get('name', '').strip()
        image = request.FILES.get('image_url', None)
        if name:
            artist.name = name
        if image:
            artist.image_url = image
        artist.save()
        return Response({'message': 'Artist updated successfully'})
    def delete(self, request, pk):
        artist = self.get_object(pk)
        if not artist:
            return Response({'error': 'Artist not found'}, status=404)

        artist.delete()
        return Response({'message': 'Artist deleted successfully'}, status=204)

#Lấy danh sách album
class AlbumList(APIView):
    def get(self, request):
        albums = Album.objects.all().order_by('-point')
        serializer = AlbumSerializer(albums, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        title = request.data.get('title', '').strip()  # <-- Sửa lại từ 'name' thành 'title'
        artist_id = request.data.get('artist')
        category = request.data.get('category', '')
        point = request.data.get('point', 0)
        decription = request.data.get('decription', '')
        image = request.FILES.get('image_url', None)

        if not title or not artist_id:
            return Response({'error': 'Title and artist are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            artist = Artists.objects.get(id=artist_id)
        except Artists.DoesNotExist:
            return Response({'error': 'Artist not found'}, status=status.HTTP_400_BAD_REQUEST)

        album = Album.objects.create(
            title=title,
            artists=artist,
            point=point,
            decription=decription,
            image_url=image
        )
        if hasattr(album, 'category'):
            album.category = category
            album.save()

        serializer = AlbumSerializer(album, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
     
#Sửa/Xóa
class AlbumDetail(APIView):
    def get_object(self, pk):
        try:
            return Album.objects.get(pk=pk)
        except Album.DoesNotExist:
            return None

    def patch(self, request, pk):
        album = self.get_object(pk)
        if not album:
            return Response({'error': 'Album not found'}, status=404)

        # Các key cần sửa:
        title = request.data.get('title', '').strip()  # ĐÚNG
        artist_id = request.data.get('artist')         # ĐÚNG
        description = request.data.get('decription')   # ĐÚNG
        point = request.data.get('point')         # ĐÚNG
        image = request.FILES.get('image_url', None)

        if title:
            album.title = title
        if description is not None:
            album.decription = description
        if point is not None:
            try:
                album.point = int(point)
            except ValueError:
                return Response({'error': 'Invalid point'}, status=400)

        if artist_id:
            try:
                artist = Artists.objects.get(id=artist_id)
                album.artists = artist
            except Artists.DoesNotExist:
                return Response({'error': 'Artist not found'}, status=400)

        if image:
            album.image_url = image

        album.save()
        return Response({'message': 'Album updated successfully'})


    def delete(self, request, pk):
        album = self.get_object(pk)
        if not album:
            return Response({'error': 'Album not found'}, status=404)

        album.delete()
        return Response({'message': 'Album deleted successfully'}, status=204)
    
class TrackByAlbumId(APIView):
    def get(self, request, album_id):
        tracks = Track.objects.filter(album=album_id)
        serializer = TrackSerializer(tracks, many=True, context={'request': request})
        return Response(serializer.data)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

#Tải nhạc
def download_track(request, pk):
    try:
        track = Track.objects.get(pk=pk)
        if not track.file:
            raise Http404("File not found")
        return FileResponse(
            track.file.open('rb'),
            as_attachment=True,
            filename=track.file.name.split("/")[-1]
        )
    except Track.DoesNotExist:
        raise Http404("Track not found")