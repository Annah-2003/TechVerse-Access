from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Interest, Event, Community, Favorite
from .serializers import InterestSerializer, EventSerializer, CommunitySerializer, FavoriteSerializer
from django.conf import settings
from django.http import JsonResponse

import logging



# Configure logging
logger = logging.getLogger(__name__)

def home(request):
    """Home view for the Tech Event Platform."""
    return HttpResponse("Welcome to the Tech Event Platform!")

def error_view(request):
    return JsonResponse({'message': 'An error occurred.'}, status=400)

@api_view(['GET'])
def session_view(request):
    """Endpoint to check the session and return user info."""
    if request.user.is_authenticated:
        return Response({'user': {'email': request.user.email}}, status=status.HTTP_200_OK)
    return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

class InterestViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for handling Interests."""
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [permissions.AllowAny]

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for handling Events."""
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        interests = user.userprofile.interests.all()
        return Event.objects.filter(interests__in=interests).distinct()

class CommunityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for handling Communities."""
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        interests = user.userprofile.interests.all()
        return Community.objects.filter(interests__in=interests).distinct()

class FavoriteViewSet(viewsets.ModelViewSet):
    """ViewSet for handling User Favorites."""
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Favorite.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        user = request.user
        event_id = request.data.get('event_id')
        try:
            event = Event.objects.get(id=event_id)
            favorite, created = Favorite.objects.get_or_create(user=user, event=event)
            if created:
                return Response({'status': 'Event added to favorites'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'status': 'Event already in favorites'}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({'error': 'Event does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        """Remove an event from favorites."""
        user = request.user
        try:
            favorite = Favorite.objects.get(user=user, event__id=pk)
            favorite.delete()
            return Response({'status': 'Event removed from favorites'}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ViewSet):
    """ViewSet for handling Payments."""
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        """Create a payment intent for an event."""
        event_id = request.data.get('event_id')
        try:
            event = Event.objects.get(id=event_id)
            amount = int(event.price * 100)  # Convert price to cents
            if amount <= 0:
                return Response({'error': 'Invalid event price'}, status=status.HTTP_400_BAD_REQUEST)

            intent = stripe.PaymentIntent.create(
                amount=amount,  # amount in cents
                currency='usd',
                metadata={'user_id': request.user.id, 'event_id': event.id},
            )
            return Response({'client_secret': intent.client_secret})
        
        except Event.DoesNotExist:
            return Response({'error': 'Event does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def session_view(request):
    if request.user.is_authenticated:
        return Response({"isAuthenticated": True, "user": request.user.username})
    return Response({"isAuthenticated": False})
def error_view(request):
    return Response({"error": "Authentication error occurred"}, status=400)
    