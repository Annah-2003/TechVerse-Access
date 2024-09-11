// pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const interestOptions = ['Web development', 'Mobile development', 'AI & Machine Learning', 'Game development', 'Cyber Security', 'Internet of Things(IoT)','UI/UX','Blockchain and Cryptocurrency','Robotics', 'AR/VR','Data Science'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, interests }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setErrorMessage(data.message);
    }
  };

  const handleInterestChange = (e) => {
    const selectedInterest = e.target.value;
    setInterests((prev) =>
      prev.includes(selectedInterest)
        ? prev.filter((i) => i !== selectedInterest)
        : [...prev, selectedInterest]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Sign Up</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded w-full mb-4"
        />

        <h2 className="text-lg mb-2">Select your interests:</h2>
        <div className="flex flex-wrap gap-4">
          {interestOptions.map((interest, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                value={interest}
                onChange={handleInterestChange}
                className="mr-2"
              />
              {interest}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-6 rounded-lg mt-4"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
