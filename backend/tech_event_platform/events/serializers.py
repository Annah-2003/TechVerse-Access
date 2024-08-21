# events/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Interest, Event, Community, Favorite

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name']

class UserProfileSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'interests']

class EventSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True)
    community = serializers.StringRelatedField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'location', 'price', 'interests', 'community']

class CommunitySerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True)

    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'interests']

class FavoriteSerializer(serializers.ModelSerializer):
    event = EventSerializer()

    class Meta:
        model = Favorite
        fields = ['id', 'event', 'added_at']
