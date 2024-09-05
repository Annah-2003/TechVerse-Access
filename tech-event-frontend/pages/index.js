import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession from next-auth
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import Dropdown from '../components/Dropdown';

const backendUrl = 'http://localhost:8000/api'; // Backend API URL

// The default export must be a single function that returns a React component.
export default function Home() {
  const { data: session, status } = useSession(); // Authentication data from next-auth
  const [events, setEvents] = useState([]); // State to store fetched events
  const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event
  const router = useRouter(); // Router instance for navigation

  // Fetch events when user is authenticated (session is present)
  useEffect(() => {
    if (session) {
      axios
        .get(`${backendUrl}/events/`, {
          headers: {
            Authorization: `Token ${session.accessToken}`, // Include token in header for authentication
          },
        })
        .then((response) => {
          setEvents(response.data); // Set events from API response
        })
        .catch((error) => {
          console.error("Error fetching events:", error); // Log any errors
        });
    }
  }, [session]);

  // Handle event selection from dropdown
  const handleSelect = (event) => {
    setSelectedEvent(event.target.value);
  };

  // Show loading spinner while session is being fetched
  if (status === 'loading') return <div>Loading...</div>;

  // If the user is not authenticated, prompt them to login or sign up
  if (!session) {
    return (
      <div>
        <h1>Welcome to Event Manager</h1>
        <button onClick={() => router.push('/login')}>Login</button>
        <button onClick={() => router.push('/signup')}>Sign Up</button>
      </div>
    );
  }

  // Render events once user is authenticated
  return (
    <div>
      <Header />
      <h1>Welcome back, {session.user.name}!</h1> {/* Greeting the user */}
      <h2>Recommended Events</h2>
      
      {/* Dropdown for selecting an event */}
      <Dropdown 
        options={events.map(event => ({ label: event.title, value: event.id }))} 
        onSelect={handleSelect}
      />
      
      {/* Display selected event details if any */}
      {selectedEvent && <p>You selected event ID: {selectedEvent}</p>}

      {/* Map through events and display each using EventCard */}
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      <Footer />
    </div>
  );
}
