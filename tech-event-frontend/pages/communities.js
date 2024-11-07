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
      axios
        .get(`${backendUrl}/communities/`, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
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
    setSelectedCommunities((prev) =>
      prev.includes(communityId) ? prev.filter((id) => id !== communityId) : [...prev, communityId]
    );
  };

  const handleNext = () => {
    if (selectedCommunities.length > 0) {
      axios
        .post(
          `${backendUrl}/communities/select`,
          { communities: selectedCommunities },
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        )
        .then(() => router.push('/events'))
        .catch((error) => console.error('Error submitting selected communities:', error));
    } else {
      alert('Please select at least one community to proceed.');
    }
  };

  if (!session) return <div>Please login to view communities.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-800 to-blue-700 text-white py-10">
      <h1 className="text-3xl font-bold mb-8">Recommended Communities</h1>
      <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => (
          <div
            key={community.id}
            onClick={() => handleCommunitySelection(community.id)}
            className={`p-4 rounded-lg transition-all cursor-pointer ${
              selectedCommunities.includes(community.id)
                ? 'bg-green-600 scale-105'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <h2 className="text-lg font-semibold">{community.name}</h2>
            <p className="text-sm">{community.description}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="mt-10 bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all"
      >
        Next
      </button>
    </div>
  );
}
