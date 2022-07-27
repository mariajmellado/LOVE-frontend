import React, { useRef } from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = (props) => {
  const ref = useRef(null);
  const { targetValue, completed, hideCompleted = false, height = 20 } = props;
  const padding = 4;

  const width = ref.current?.clientWidth ?? 0;
  const targetValuePixels = ((width - 2 * padding) * targetValue) / 100;
  const completedValue = completed.toString().padStart(3, '0');

  return (
    <div className={styles.parentDiv}>
      { !hideCompleted ? (
        <div>
          <span className={styles.labelStyles}>{`${completedValue}%`}</span>
        </div>
        ) : <></>
      }
      <div ref={ref}
        className={styles.containerStyles}
        style={{height: `${height}px`}}
      >
        <svg 
          width={width > 0 ? width - 2 * padding : 0} 
          height={height}
          className={styles.progressCommandedLine}
        >
          {
            targetValue ? (
              <line
                className={styles.targetValueLine}
                x1={targetValuePixels}
                y1={-padding}
                x2={targetValuePixels}
                y2={height + padding}
              />
            ) : <></>
          }
          
        </svg>
        { completed ? 
          (
            <div
              className={styles.fillerStyles}
              style={{width: `${completed}%`}}
            ></div>
          ) : <></>
        }
      </div>
    </div>
  );

};

export default ProgressBar;
