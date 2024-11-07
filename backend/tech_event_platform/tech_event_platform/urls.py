from django.contrib import admin
from django.urls import path, include
from events.views import home  # Import the home view

# Define the URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),  # Admin interface
    path('api/', include('events.urls')),  # Include the events app URLs
    path('', home, name='home'),  # Home page
]
