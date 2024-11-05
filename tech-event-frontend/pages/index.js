import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import Dropdown from '../components/Dropdown';

const backendUrl = 'http://localhost:8000/api';

export default function Home() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  // Fetch events from the backend
  useEffect(() => {
    axios
      .get(`${backendUrl}/events/`, {
        headers: session ? { Authorization: `Bearer ${session.accessToken}` } : {},
      })
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, [session]);

  const handleSelect = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleCreateEvent = () => {
    if (session) {
      router.push('/create-event');
    } else {
      alert('Please log in to create an event.');
    }
  };

  const handleRegisterEvent = (eventId) => {
    if (session) {
      // Logic to register for event
      console.log('Registering for event:', eventId);
    } else {
      alert('Please log in to register for this event.');
    }
  };

  // If session status is loading, show a loading screen
  if (status === 'loading') return <div>Loading...</div>;

  // If user is not logged in, show login and signup buttons
  if (!session) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-800 via-purple-600 to-pink-500 opacity-30 animate-pulse z-0"></div>

        <div className="absolute top-5 right-5 z-10 flex space-x-4">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-poppins text-sm neon-effect shadow-lg hover:shadow-neon-blue hover:scale-110 transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              router.push('/login');
            }}
          >
            Login
          </button>
          <button
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-lg font-poppins text-sm neon-effect shadow-lg hover:shadow-neon-green hover:scale-110 transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              router.push('/signup');
            }}
          >
            Sign Up
          </button>
        </div>

        <h1 className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-5xl font-extrabold text-neon-blue z-10">
          Welcome to TechVerse-Access
        </h1>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Poppins:wght@400;600&display=swap');
          .text-neon-blue { color: #00f6ff; text-shadow: 0 0 5px rgba(0, 246, 255, 0.7), 0 0 15px rgba(0, 246, 255, 0.5); font-family: 'Orbitron', sans-serif; }
          .neon-effect { transition: box-shadow 0.3s ease; }
          .neon-effect:hover { box-shadow: 0 0 20px rgba(0, 246, 255, 0.7), 0 0 30px rgba(0, 246, 255, 0.5); }
          .hover\\:shadow-neon-blue:hover { box-shadow: 0 0 15px #00f6ff, 0 0 30px #00f6ff; }
          .hover\\:shadow-neon-green:hover { box-shadow: 0 0 15px #00ff99, 0 0 30px #00ff99; }
          .animate-pulse { animation: pulseAnimation 10s infinite; }
          @keyframes pulseAnimation { 0% { opacity: 0.4; } 50% { opacity: 0.6; } 100% { opacity: 0.4; } }
          .font-poppins { font-family: 'Poppins', sans-serif; }
        `}</style>
      </div>
    );
  }

  // If user is logged in, display events and personalized greeting
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {session.user.name}!</h1>
        <h2 className="text-xl mt-4 text-gray-700">Recommended Events</h2>

        <Dropdown
          options={events.map((event) => ({ label: event.title, value: event.id }))}
          onSelect={handleSelect}
        />

        {selectedEvent && <p>You selected event ID: {selectedEvent}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={() => handleRegisterEvent(event.id)}
            />
          ))}
        </div>

        <button
          onClick={handleCreateEvent}
          className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-lg hover:scale-105 transition-all"
        >
          Create Event
        </button>
      </main>
      <Footer />
    </div>
  );
}
