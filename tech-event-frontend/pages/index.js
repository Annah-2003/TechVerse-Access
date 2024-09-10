import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import Dropdown from '../components/Dropdown';
import { motion } from 'framer-motion';

const backendUrl = 'http://localhost:8000/api'; 

export default function Home() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      axios
        .get(`${backendUrl}/events/`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => {
          console.error('Error fetching events:', error);
        });
    }
  }, [session]);

  const handleSelect = (event) => {
    setSelectedEvent(event.target.value);
  };

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-700 text-white">
        <h1 className="text-4xl font-extrabold">Welcome to TechVerse-Access</h1>
        <motion.button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg mt-6 hover:bg-purple-700"
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push('/login')}
        >
          Login
        </motion.button>
        <motion.button
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-teal-600"
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </motion.button>
      </div>
    );
  }

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
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
