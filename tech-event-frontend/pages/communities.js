import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const backendUrl = 'http://localhost:8000/api';

export default function Communities() {
  const router = useRouter();
  const { data: session } = useSession();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunities, setSelectedCommunities] = useState([]);

  useEffect(() => {
    if (session) {
      // Fetch communities from the backend
      axios
        .get(`${backendUrl}/communities/`, {
          headers: {
            Authorization: `Token ${session.accessToken}`,
          },
        })
        .then((response) => {
          setCommunities(response.data);
        })
        .catch((error) => {
          console.error('Error fetching communities:', error);
        });
    }
  }, [session]);

  const handleCommunitySelection = (communityId) => {
    // Toggle selection of communities
    if (selectedCommunities.includes(communityId)) {
      setSelectedCommunities(selectedCommunities.filter(id => id !== communityId));
    } else {
      setSelectedCommunities([...selectedCommunities, communityId]);
    }
  };

  const handleNext = () => {
    // Assuming you send selectedCommunities to the backend
    if (selectedCommunities.length > 0) {
      axios.post(`${backendUrl}/communities/select`, {
        communities: selectedCommunities,
      }, {
        headers: {
          Authorization: `Token ${session.accessToken}`,
        },
      })
      .then(() => {
        // After successful submission, redirect to the events page
        router.push('/events');
      })
      .catch((error) => {
        console.error('Error submitting selected communities:', error);
      });
    } else {
      alert('Please select at least one community to proceed.');
    }
  };

  if (!session) {
    return <div>Please login to view communities.</div>;
  }

  return (
    <div>
      <h1>Recommended Communities</h1>
      <ul>
        {communities.map((community) => (
          <li key={community.id}>
            <div>
              <h2>{community.name}</h2>
              <p>{community.description}</p>
              <button
                onClick={() => handleCommunitySelection(community.id)}
                style={{
                  backgroundColor: selectedCommunities.includes(community.id)
                    ? 'lightgreen'
                    : 'lightgray',
                }}
              >
                {selectedCommunities.includes(community.id)
                  ? 'Deselect'
                  : 'Select'}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}
