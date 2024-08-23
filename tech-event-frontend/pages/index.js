// pages/index.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';

const backendUrl = 'http://localhost:8000/api';

export default function Home() {
  const [session] = useSession();
  const [events, setEvents] = useState([]);

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

  if (!session) {
    return <div>Please login to view events.</div>;
  }

  return (
    <div>
      <h1>Recommended Events</h1>
      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleString()}</p>
          <p>Location: {event.location}</p>
          <p>Price: ${event.price}</p>
          <button>Add to Favorites</button>
          <button>Buy Ticket</button>
        </div>
      ))}
    </div>
  );
}
