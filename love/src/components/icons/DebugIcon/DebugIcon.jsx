import React from 'react';
import styles from './DebugIcon.module.css';

function DebugIcon(props) {
  return (
    <svg viewBox="0 0 28.9 26.8" {...props}>
      <path
        className={styles.path}
        d="M9,5.9c0,0.3,0.3,0.6,0.6,0.6s0.6-0.3,0.6-0.6c0-2.2,1.8-4,4-4s4,1.8,4,4c0,0.3,0.3,0.6,0.6,0.6
          s0.6-0.3,0.6-0.6c0-2.9-2.4-5.3-5.3-5.3S9,3,9,5.9z"
      />
      <path
        className={styles.path}
        d="M27.8,15.6h-5.1V13h2c1.6,0,2.8-1.3,2.8-2.8V7.1c0-0.3-0.3-0.6-0.6-0.6c-0.3,0-0.6,0.3-0.6,0.6v3.2
          c0,0.9-0.7,1.6-1.6,1.6h-2v-1.5c0-0.9-0.7-1.6-1.6-1.6H7.4c-0.9,0-1.6,0.7-1.6,1.6v1.5h-2c-0.9,0-1.6-0.7-1.6-1.6V7.1
          c0-0.3-0.3-0.6-0.6-0.6S0.9,6.7,0.9,7.1v3.2c0,1.6,1.3,2.8,2.8,2.8h2v2.6H0.6c-0.3,0-0.6,0.3-0.6,0.6c0,0.3,0.3,0.6,0.6,0.6h5.1
          v2.6h-2c-1.6,0-2.8,1.3-2.8,2.8v3.2c0,0.3,0.3,0.6,0.6,0.6s0.6-0.3,0.6-0.6v-3.2c0-0.9,0.7-1.6,1.6-1.6h2.1
          c0.5,3.2,3.3,5.7,6.7,5.7h3.3c3.4,0,6.2-2.5,6.7-5.7h2.1c0.9,0,1.6,0.7,1.6,1.6v3.2c0,0.3,0.3,0.6,0.6,0.6s0.6-0.3,0.6-0.6v-3.2
          c0-1.6-1.3-2.8-2.8-2.8h-2v-2.6h5.1c0.3,0,0.6-0.3,0.6-0.6C28.5,15.9,28.2,15.6,27.8,15.6z M7.1,19.7v-9.4c0-0.2,0.2-0.4,0.4-0.4
          h6.2v15.3h-1C9.5,25.2,7.1,22.7,7.1,19.7z M15.9,25.2h-1V9.9h6.2c0.2,0,0.4,0.2,0.4,0.4v9.4C21.4,22.7,19,25.2,15.9,25.2z"
      />
    </svg>
  );
}

export default DebugIcon;