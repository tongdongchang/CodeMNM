from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('artist/',views.AritistList.as_view(),name='ArtistList'),
    path('register/',views.Register.as_view(),name='Register'),
    path('track/',views.TrackList.as_view(),name='Track'),
    path('album/',views.AlbumList.as_view(),name='Album'),
    path('token/',TokenObtainPairView.as_view(),name='Token_pair'),
    path('token/refresh/',TokenRefreshView.as_view(),name='Token_refresh'),
    path('profile/',views.ProfileAPIView.as_view(),name='Profile'),
    path('trackalbum/',views.ListTrackFromAlbum.as_view(),name='TrackAlbum'),
    path('playlist/',views.ListPlaylist.as_view(),name='Playlist'),
    path('search/',views.TrackListSearch.as_view(),name='Search'),
    path('addtracktoplaylist/',views.AddTrackToPlaylist.as_view(),name='addTrack'),
    path('searchFull/',views.Search.as_view(),name='SearchFull'),
    path('EditPlaylist/',views.playlistEdit.as_view(),name='playlistEdit'),
    path('TrackChanging/',views.TrackChanging.as_view(),name='playlistEdit'),
    path('profile/', views.ProfileAPIView.as_view(), name='Profile'),
    path('EditProfile/', views.EditProfileView.as_view(), name='edit_profile'),

    
]