import React, { Component } from 'react';
import styles from './DomeCloseButton.module.css';

export default class DomeCloseButton extends Component {
  render() {
    return (
      <div className={styles.buttonWrapper}>
        <button className={styles.button}>
          <svg className={styles.domeSVG} viewBox="0 0 175.25 145.25">
            <path
              xmlns="http://www.w3.org/2000/svg"
              className={styles.domePath}
              d="M274.8,235.1h-5.4v-19.4c0-0.9-0.7-1.6-1.6-1.6H266v-15.9c0-9.7-3.1-19.1-8.8-26.9l5.1-5.1  c0.6-0.6,0.6-1.7,0-2.3l-7.4-7.4c-0.6-0.6-1.7-0.6-2.3,0l-5,5.1c-2.6-1.9-5.5-3.6-8.5-4.9l1.3-3.4c0.3-0.9,0.3-1.8-0.1-2.7  c-0.4-0.8-1.1-1.5-1.9-1.8c-27.3-9.8-57.4,4.4-67.2,31.7c-1.8,5.1-2.9,10.5-3.1,15.9c0,0.9,0.3,1.8,0.9,2.4c0.6,0.7,1.5,1,2.5,1.1  h3.6V214h-2c-0.9,0-1.6,0.7-1.6,1.6v19.5H166c-0.9-0.1-1.7,0.6-1.8,1.5s0.6,1.7,1.5,1.8c0.1,0,0.2,0,0.3,0h108.8  c0.9,0.1,1.7-0.6,1.8-1.5c0.1-0.9-0.6-1.7-1.5-1.8C275,235.1,274.9,235.1,274.8,235.1z M248.4,214v-9h14.3v9H248.4z M195.7,214v-9  h49.4v9H195.7z M192.4,201.7h-14.3v-3.6c0-18.1,11.6-34.3,28.8-40c-2.6,2.4-4.9,5.1-6.6,8.2c-5.1,8.5-7.9,19.9-7.9,31.9L192.4,201.7  z M195.7,198.1c0-11.4,2.6-22.1,7.5-30.2c4.7-7.8,10.8-12.1,17.2-12.1s12.5,4.3,17.2,12.1c4.8,8,7.5,18.8,7.5,30.2v3.6h-49.4  L195.7,198.1z M262.7,201.7h-14.3v-3.6c0-12-2.8-23.3-7.9-31.9c-1.8-3.1-4-5.8-6.6-8.2c17.2,5.8,28.8,21.9,28.9,40.1L262.7,201.7z   M253.6,159.8l5.1,5.1l-3.6,3.6c-1.6-1.8-3.3-3.6-5.1-5.1L253.6,159.8z M171.2,196.4L171.2,196.4c1-27.2,23.8-48.5,51-47.5  c5.1,0.2,10.1,1.1,14.9,2.9l0,0c0,0,0,0.1,0,0.1l-1.3,3.4c-23.7-8.5-49.7,3.8-58.2,27.5c-1.6,4.4-2.5,9-2.6,13.7L171.2,196.4  C171.3,196.4,171.3,196.4,171.2,196.4L171.2,196.4z M178.2,205h14.3v9h-14.3L178.2,205z M174.7,217.3h91.5v17.8h-37.1v-3.6  c0-1.9-1.5-3.4-3.4-3.4h-10.5c-1.9,0-3.4,1.5-3.4,3.4v3.6h-37.1L174.7,217.3z M225.8,235.1H215v-3.6c0-0.1,0-0.1,0.1-0.1l0,0h10.5  c0.1,0,0.1,0,0.1,0.1c0,0,0,0,0,0L225.8,235.1z"
            />
            <path
              xmlns="http://www.w3.org/2000/svg"
              className={styles.domeXPath}
              d="M244.3,221.7c-1.2,1.2-4.6-0.2-5.9-1.4s-2.6-4.6-1.4-5.8l23.7-23.7L237,167.1c-1.2-1.2,0.1-4.7,1.4-5.9  s4.6-2.6,5.9-1.3l23.8,23.7l23.7-23.7c1.2-1.2,4.6,0.1,5.9,1.4s2.6,4.7,1.4,5.9l-23.7,23.7l23.7,23.7c1.2,1.2-0.1,4.6-1.3,5.9  s-4.7,2.6-5.9,1.4L268,198.1L244.3,221.7z"
            />
          </svg>
          <span className={styles.buttonLabel}>EMERGENCY CLOSE</span>
        </button>
      </div>
    );
  }
}
