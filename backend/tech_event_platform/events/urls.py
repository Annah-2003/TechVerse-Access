from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InterestViewSet, EventViewSet, CommunityViewSet, FavoriteViewSet, PaymentViewSet
from .views import session_view  # Import the session view

# Initialize the router
router = DefaultRouter()
router.register(r'interests', InterestViewSet, basename='interest')
router.register(r'events', EventViewSet, basename='event')
router.register(r'communities', CommunityViewSet, basename='community')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'payments', PaymentViewSet, basename='payment')

# Define the URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Include the router's URLs
    path('auth/', include('dj_rest_auth.urls')),  # Authentication URLs
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # Registration URLs
    path('auth/session/', session_view, name='session'),  # Session view
]
