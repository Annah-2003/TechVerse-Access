import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';

const backendUrl = 'http://localhost:8000/api';

export default function Communities() {
  const [session] = useSession();
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    if (session) {
      axios
        .get(`${backendUrl}/communities/`, {
          headers: {
            Authorization: `Token ${session.accessToken}`,
          },
        })
        .then((response) => {
          setCommunities(response.data);
        });
    }
  }, [session]);

  if (!session) {
    return <div>Please login to view communities.</div>;
  }

  return (
    <div>
      <h1>Recommended Communities</h1>
      {communities.map((community) => (
        <div key={community.id}>
          <h2>{community.name}</h2>
          <p>{community.description}</p>
        </div>
      ))}
    </div>
  );
}
