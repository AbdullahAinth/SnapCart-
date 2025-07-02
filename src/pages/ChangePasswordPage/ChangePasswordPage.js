// src/pages/ChangePasswordPage/ChangePasswordPage.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './ChangePasswordPage.module.css';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    // Mock password change logic
    console.log("Mock password change submitted:", { currentPassword, newPassword });
    toast.success("Password change request submitted! (Mock)");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className={styles.changePasswordPage}>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit} className={styles.passwordForm}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="input" /* This class will pick up global input styles */
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="input" /* This class will pick up global input styles */
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="input" /* This class will pick up global input styles */
          />
        </div>
        {/* Using the global .button class */}
        <button type="submit" className="button">
          Change Password
        </button>
      </form>
      <p className={styles.note}>
        Note: This is a mock functionality. No actual password changes will occur.
      </p>
    </div>
  );
};

export default ChangePasswordPage;