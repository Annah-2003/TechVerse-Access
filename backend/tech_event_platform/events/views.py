# events/views.py

from rest_framework import viewsets, permissions
from .models import Interest, Event, Community, Favorite
from .serializers import InterestSerializer, EventSerializer, CommunitySerializer, FavoriteSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import stripe
from django.conf import settings
from django.http import HttpResponse

stripe.api_key = settings.STRIPE_SECRET_KEY

def home(request):
    return HttpResponse("Welcome to the Tech Event Platform!")

class InterestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [permissions.AllowAny]

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        interests = user.userprofile.interests.all()
        return Event.objects.filter(interests__in=interests).distinct()

class CommunityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        interests = user.userprofile.interests.all()
        return Community.objects.filter(interests__in=interests).distinct()

class FavoriteViewSet(viewsets.ModelViewSet):
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
        user = request.user
        try:
            favorite = Favorite.objects.get(user=user, event__id=pk)
            favorite.delete()
            return Response({'status': 'Event removed from favorites'}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        event_id = request.data.get('event_id')
        try:
            event = Event.objects.get(id=event_id)
            intent = stripe.PaymentIntent.create(
                amount=int(event.price * 100),  # amount in cents
                currency='usd',
                metadata={'user_id': request.user.id, 'event_id': event.id},
            )
            return Response({'client_secret': intent.client_secret})
        except Event.DoesNotExist:
            return Response({'error': 'Event does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
