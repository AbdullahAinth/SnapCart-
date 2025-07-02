// src/components/Loader/Loader.js
import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ fullScreen = false, size = 50 }) => {
  return (
    <div
      className={`${styles.loaderContainer} ${fullScreen ? styles.fullScreen : ''}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={styles.spinner}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default Loader;
