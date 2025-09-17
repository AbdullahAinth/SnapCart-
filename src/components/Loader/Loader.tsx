// src/components/Loader/Loader.tsx
import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  fullScreen?: boolean;
  size?: number;
  color?: string; // allow dynamic color
}

const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  size = 50,
  color
}) => {
  return (
    <div
      className={`${styles.loaderContainer} ${fullScreen ? styles.fullScreen : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={styles.spinner}
        style={{
          width: size,
          height: size,
          borderColor: color || 'var(--accent-color)',
          borderTopColor: 'transparent'
        }}
      />
    </div>
  );
};

export default Loader;
