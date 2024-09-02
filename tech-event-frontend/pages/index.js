import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react'; // Ensure the import is correct
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import Dropdown from '../components/Dropdown';

const backendUrl = 'http://localhost:8000/api';

export default function Home() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (session) {
      axios
        .get(`${backendUrl}/events/`, {
          headers: {
            Authorization: `Token ${session.accessToken}`,
          },
        })
        .then((response) => {
          setEvents(response.data);
        });
    }
  }, [session]);

  const handleSelect = (event) => {
    setSelectedEvent(event.target.value);
  };

  if (!session) {
    return <div>Please login to view events.</div>;
  }

  return (
    <div>
      <Header />
      <h1>Recommended Events</h1>
      <Dropdown 
        options={events.map(event => ({ label: event.title, value: event.id }))} 
        onSelect={handleSelect}
      />
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      <Footer />
    </div>
  );
}
