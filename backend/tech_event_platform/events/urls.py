from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    session_view,
    error_view,
    InterestViewSet,
    EventViewSet,
    CommunityViewSet,
    FavoriteViewSet,
)

# Initialize the DRF DefaultRouter
router = DefaultRouter()
router.register(r'interests', InterestViewSet, basename='interest')
router.register(r'events', EventViewSet, basename='event')
router.register(r'communities', CommunityViewSet, basename='community')
router.register(r'favorites', FavoriteViewSet, basename='favorite')

# Define urlpatterns
urlpatterns = [
    # Include router URLs
    path('api/', include(router.urls)),

    # Authentication-related paths (using dj_rest_auth)
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/signup/', include('dj_rest_auth.registration.urls')),
    path('api/auth/login/', include('dj_rest_auth.urls')),

    # Custom views for session and error handling
    path('api/auth/session/', session_view, name='session'),
    path('api/auth/error/', error_view, name='error'),
]
