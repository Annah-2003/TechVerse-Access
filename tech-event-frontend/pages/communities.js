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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-800 to-blue-700 text-white">
      <h1 className="text-3xl font-bold my-6">Recommended Communities</h1>
      <ul className="w-full max-w-md space-y-4">
        {communities.map((community) => (
          <li key={community.id} className="p-4 bg-gray-900 rounded-lg shadow-md">
            <div>
              <h2 className="text-xl font-bold">{community.name}</h2>
              <p className="text-gray-400">{community.description}</p>
              <button
                onClick={() => handleCommunitySelection(community.id)}
                className={`mt-2 px-4 py-2 rounded-lg ${
                  selectedCommunities.includes(community.id)
                    ? 'bg-green-600'
                    : 'bg-gray-700'
                } hover:bg-green-700 transition-all`}
              >
                {selectedCommunities.includes(community.id)
                  ? 'Deselect'
                  : 'Select'}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleNext}
        className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-lg hover:scale-105 transition-all"
      >
        Next
      </button>
    </div>
  );
}
