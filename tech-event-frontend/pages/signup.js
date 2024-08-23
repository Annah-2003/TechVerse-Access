
import { useState, useEffect } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

const backendUrl = 'http://localhost:8000/api';

export default function SignUp() {
  const router = useRouter();
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
  });

  useEffect(() => {
    axios.get(`${backendUrl}/interests/`).then((response) => {
      setInterests(response.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register user
      await axios.post(`${backendUrl}/auth/registration/`, {
        ...formData,
      });

      // Set user interests
      const profileResponse = await axios.get(`${backendUrl}/auth/user/`, {
        headers: {
          Authorization: `Token ${res.data.key}`,
        },
      });

      await axios.put(
        `${backendUrl}/userprofiles/${profileResponse.data.pk}/`,
        {
          interests: selectedInterests,
        },
        {
          headers: {
            Authorization: `Token ${res.data.key}`,
          },
        }
      );

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('Error during sign up');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <button onClick={() => signIn('google')}>Sign up with Google</button>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password1}
          onChange={(e) =>
            setFormData({ ...formData, password1: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={(e) =>
            setFormData({ ...formData, password2: e.target.value })
          }
          required
        />
        <label>Select Your Interests:</label>
        <select
          multiple
          value={selectedInterests}
          onChange={(e) =>
            setSelectedInterests(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {interests.map((interest) => (
            <option key={interest.id} value={interest.id}>
              {interest.name}
            </option>
          ))}
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
