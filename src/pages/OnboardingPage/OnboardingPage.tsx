import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import styles from './OnboardingPage.module.css';

const OnboardingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useUser();
  const navigate = useNavigate();

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    
    // Call the register function from the UserContext
    const registrationSuccessful = register(username, name, password);

    if (registrationSuccessful) {
      // The register function logs the user in, so we just need to navigate.
      navigate('/');
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <form onSubmit={handleRegister} className={styles.onboardingForm}>
        <h2>Create an Account</h2>
        <p>Fill out the form to get started!</p>
        <div className={styles.formGroup}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="username">Choose a Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Create a Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.onboardingButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;