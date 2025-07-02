// src/components/HeroSection/HeroSection.js
import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroSection} aria-label="Welcome Section">
      <div className={styles.blob1} aria-hidden="true"></div>
      <div className={styles.blob2} aria-hidden="true"></div>
      <div className={styles.blob3} aria-hidden="true"></div>

      <div className={styles.content}>
        <h1>Welcome to <span className={styles.brand}>SnapCart</span>!</h1>
        <p>Your one-stop shop for the latest trends and tech.</p>
        <button className={styles.ctaButton}>Shop Now</button>
      </div>
    </section>
  );
};

export default HeroSection;
