import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interests, setInterests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const interestOptions = [
    'Web development', 'Mobile development', 'AI & Machine Learning',
    'Game development', 'Cyber Security', 'Internet of Things (IoT)',
    'UI/UX Design', 'Blockchain and Cryptocurrency', 'Robotics', 'AR/VR', 'Data Science'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, interests }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setErrorMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-800 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />

          <h2 className="text-lg mb-2">Select your interests:</h2>
          <div className="flex flex-wrap gap-4">
            {interestOptions.map((interest, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={interest}
                  onChange={(e) => setInterests((prev) =>
                    prev.includes(e.target.value)
                      ? prev.filter((i) => i !== e.target.value)
                      : [...prev, e.target.value]
                  )}
                  className="mr-2"
                />
                {interest}
              </label>
            ))}
          </div>

          <motion.button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            whileHover={{ scale: 1.05 }}
          >
            Sign Up
          </motion.button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
