// pages/favorites.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';

const backendUrl = 'http://localhost:8000/api';

export default function Favorites() {
  const [session] = useSession();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (session) {
      axios
        .get(`${backendUrl}/favorites/`, {
          headers: {
            Authorization: `Token ${session.accessToken}`,
          },
        })
        .then((response) => {
          setFavorites(response.data);
        });
    }
  }, [session]);

  if (!session) {
    return <div>Please login to view favorites.</div>;
  }

  return (
    <div>
      <h1>Your Favorite Events</h1>
      {favorites.map((favorite) => (
        <div key={favorite.id}>
          <h2>{favorite.event.title}</h2>
          <p>{favorite.event.description}</p>
          <button
            onClick={() => {
              axios
                .delete(`${backendUrl}/favorites/${favorite.event.id}/remove/`, {
                  headers: {
                    Authorization: `Token ${session.accessToken}`,
                  },
                })
                .then(() => {
                  setFavorites(
                    favorites.filter((f) => f.id !== favorite.id)
                  );
                  alert('Removed from favorites');
                })
                .catch(() => {
                  alert('Error removing from favorites');
                });
            }}
          >
            Remove from Favorites
          </button>
        </div>
      ))}
    </div>
  );
}
