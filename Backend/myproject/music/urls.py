from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView  # Import custom view
urlpatterns = [
    
    path('register/',views.Register.as_view(),name='Register'),
    
    path('token/', CustomTokenObtainPairView.as_view(), name='Token_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='Token_refresh'),

    path('profile/',views.ProfileAPIView.as_view(),name='Profile'),
    path('trackalbum/',views.ListTrackFromAlbum.as_view(),name='TrackAlbum'),
    # path('trackalbum/',views.AlbumList.as_view(),name='TrackAlbum'),
    path('playlist/',views.ListPlaylist.as_view(),name='Playlist'),
    path('search/',views.TrackListSearch.as_view(),name='Search'),
    path('addtracktoplaylist/',views.AddTrackToPlaylist.as_view(),name='addTrack'),
    path('searchFull/',views.Search.as_view(),name='SearchFull'),
    path('EditPlaylist/',views.playlistEdit.as_view(),name='playlistEdit'),
    
    # Admin
    #User
    path('users/', views.UserListView.as_view(), name='UserList'),
    path('user/<int:pk>/', views.UserDetailView.as_view(), name='GetOneUser'),
    path('users/<int:pk>/', views.UpdateUserAPIView.as_view(), name='UpdateUser'),
    #Track
    path('track/',views.TrackList.as_view(),name='Track'),
    path('addtrack/',views.AddTrack.as_view(),name='AddTrack'),
    path('deletetrack/<int:pk>/', views.DeleteTrack.as_view(), name='DeleteTrack'),
    path('updatetrack/<int:pk>/', views.UpdateTrack.as_view(),name='UpdateTrack'), 
    path('updatealbum/<int:pk>/', views.RemoveAlbumFromTrack.as_view(),name='UpdateTrack'), 
    #Artist
    path('artists/',views.AritistList.as_view(),name='ArtistList'),
    path('artists/<int:pk>/', views.ArtistDetail.as_view(),name='ArtistDetail'),
    #Album
    path('albums/',views.AlbumList.as_view(),name='Album'),
    path('albums/<int:pk>/',views.AlbumDetail.as_view(),name='AlbumDetail'),
    path('albums/<int:album_id>/tracks/', views.TrackByAlbumId.as_view()),
    #Tải nhạc
    path('download-track/<int:pk>/', views.download_track, name='download_track'),
]