import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './signup.module.css'; // Importing CSS module for styling

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
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get(`${backendUrl}/interests/`).then((response) => {
      setInterests(response.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/auth/registration/`, {
        email: formData.email,
        password: formData.password1,
      });

      await axios.put(
        `${backendUrl}/userprofiles/${res.data.user.id}/`,
        { interests: selectedInterests },
        { headers: { Authorization: `Token ${res.data.token}` } }
      );

      router.push('/login');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error during sign-up');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign Up</h1>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password1}
            onChange={(e) => setFormData({ ...formData, password1: e.target.value })}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
            required
          />
        </div>
        <label className={styles.label}>Please Select Your Interests:</label>
        <div className={styles.inputGroup}>
          <select
            className={styles.select}
            multiple
            value={selectedInterests}
            onChange={(e) =>
              setSelectedInterests(Array.from(e.target.selectedOptions, (option) => option.value))
            }
          >
            {interests.map((interest) => (
              <option key={interest.id} value={interest.id}>
                {interest.name}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.submitButton} type="submit">Sign Up</button>
      </form>
    </div>
  );
}
