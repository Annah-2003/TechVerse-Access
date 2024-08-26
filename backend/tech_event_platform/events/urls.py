from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import InterestViewSet, EventViewSet, CommunityViewSet, FavoriteViewSet,PaymentViewSet

router = DefaultRouter()
router.register(r'interests', InterestViewSet, basename='interest')
router.register(r'communities', CommunityViewSet, basename='community')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
]