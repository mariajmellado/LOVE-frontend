import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './PressureIcon.module.css';

function PressureIcon(props) {
  return (
      <svg className={styles.svg} viewBox="0 0 54.79 54.79" {...props}>
        <path className={styles.none} d="M14.67,8.4l3.35,5.11c0.55-0.37,1.1-0.67,1.64-0.97l-2.74-5.48C16.19,7.49,15.4,7.91,14.67,8.4z"/>
        <path className={styles.none} d="M31.41,24.54c-0.67-0.55-1.46-0.97-2.25-1.22c-0.61-1.03-1.16-7.79-1.77-7.79s-1.22,6.88-1.77,7.79
          c-1.16,0.37-2.19,1.03-2.98,2.01c-2.19,2.68-1.83,6.58,0.79,8.83c2.68,2.19,6.58,1.83,8.83-0.79
          C34.46,30.68,34.09,26.73,31.41,24.54z"/>
        <path className={styles.none} d="M35.07,12.66c0.55,0.3,1.1,0.61,1.64,0.97l3.35-5.11c-0.73-0.49-1.46-0.91-2.25-1.28L35.07,12.66z"/>
        <path className={styles.none} d="M28.37,10.84l0.37-6.15c-0.85-0.06-1.7-0.06-2.5,0h-0.06l0.37,6.15C27.09,10.78,27.76,10.78,28.37,10.84z"/>
        <path className={styles.none} d="M6.7,17.29l5.48,2.8c0.3-0.55,0.61-1.1,0.97-1.64l-5.11-3.41C7.49,15.77,7.06,16.5,6.7,17.29z"/>
        <path className={styles.none} d="M4.2,26.42c-0.06,0.85-0.06,1.7,0,2.56v0.06l6.15-0.37c0-0.61,0-1.28,0-1.89L4.2,26.42z"/>
        <path className={styles.none} d="M50.47,26.67v-0.06l-6.09,0.37c0.06,0.67,0,1.28,0,1.89l6.15,0.37C50.53,28.43,50.53,27.58,50.47,26.67z"/>
        <path className={styles.none} d="M46.76,15.22l-5.11,3.35c0.37,0.55,0.67,1.1,0.97,1.64l5.48-2.74C47.67,16.68,47.24,15.89,46.76,15.22z"/>
        <path className={styles.path} d="M27.4,54.79c9.11,0,17.21-4.48,22.15-11.29c0.27-0.37-0.01-0.89-0.46-0.89H5.66c-0.46,0-0.73,0.52-0.46,0.89
          C10.19,50.32,18.23,54.79,27.4,54.79z"/>
        <path className={styles.path} d="M51.56,38.72c0.49,0,0.94-0.29,1.12-0.74c1.34-3.27,2.11-6.85,2.11-10.58C54.79,12.24,42.56,0,27.4,0
          S0,12.24,0,27.4c0,3.73,0.77,7.32,2.14,10.59c0.19,0.45,0.64,0.73,1.12,0.73L51.56,38.72z M26.18,4.69
          c0.41-0.03,0.81-0.04,1.21-0.05c0.7,0,1.25,0.59,1.21,1.29l-0.24,3.98c-0.03,0.5-0.44,0.89-0.94,0.88c-0.04,0-0.07,0-0.11,0
          c-0.5,0-0.92-0.38-0.94-0.88l-0.31-5.22L26.18,4.69z M10.26,27.78c0,0.5-0.39,0.92-0.89,0.95l-5.23,0.31v-0.06
          c-0.03-0.42-0.05-0.85-0.05-1.27c0-0.7,0.59-1.25,1.29-1.21l3.99,0.24c0.5,0.03,0.89,0.44,0.89,0.93
          C10.26,27.71,10.26,27.74,10.26,27.78z M11.29,19.67l-3.55-1.81c-0.63-0.32-0.86-1.09-0.5-1.69c0.02-0.03,0.04-0.06,0.05-0.09
          c0.36-0.58,1.13-0.74,1.7-0.36l3.32,2.21c0.42,0.28,0.54,0.83,0.29,1.26c-0.02,0.04-0.04,0.08-0.07,0.11
          C12.29,19.74,11.74,19.9,11.29,19.67z M17.52,12.75l-2.17-3.31c-0.38-0.58-0.2-1.37,0.41-1.72c0.01,0,0.01-0.01,0.02-0.01
          c0.6-0.34,1.38-0.11,1.69,0.52l1.77,3.54c0.23,0.45,0.06,1-0.39,1.24c-0.03,0.02-0.06,0.03-0.09,0.05
          C18.34,13.3,17.79,13.17,17.52,12.75z M32.21,33.36c-2.19,2.68-6.15,3.04-8.83,0.79c-2.68-2.19-3.04-6.15-0.79-8.83
          c0.67-0.82,1.56-1.43,2.48-1.82c0.35-0.15,0.63-0.42,0.72-0.78c0.53-1.94,1.06-7.21,1.54-7.21c0.53,0,1.06,5.11,1.55,7.12
          c0.09,0.38,0.35,0.7,0.71,0.84c0.62,0.24,1.23,0.57,1.76,1.05C34.09,26.73,34.46,30.68,32.21,33.36z M35.95,13.1
          c-0.04-0.02-0.07-0.04-0.11-0.06c-0.43-0.25-0.59-0.8-0.36-1.24l1.83-3.57c0.31-0.62,1.08-0.85,1.68-0.5
          c0.02,0.01,0.03,0.02,0.05,0.03c0.59,0.35,0.77,1.13,0.39,1.71l-2.21,3.35C36.94,13.23,36.38,13.36,35.95,13.1z M42.41,18.07
          l3.3-2.16c0.58-0.38,1.37-0.2,1.72,0.41c0,0.01,0.01,0.01,0.01,0.02c0.34,0.6,0.11,1.38-0.52,1.69l-3.53,1.77
          c-0.45,0.23-1,0.05-1.25-0.39c-0.01-0.02-0.02-0.03-0.03-0.05C41.87,18.91,41.99,18.34,42.41,18.07z M44.37,28.04
          c0-0.04,0-0.08,0-0.12c0-0.5,0.38-0.91,0.88-0.94l5.16-0.31v0.06c0.03,0.43,0.05,0.88,0.05,1.32c0,0.7-0.6,1.26-1.3,1.21
          l-3.91-0.27C44.75,28.95,44.36,28.54,44.37,28.04z"/>
      </svg>
    );
  }

export default PressureIcon;