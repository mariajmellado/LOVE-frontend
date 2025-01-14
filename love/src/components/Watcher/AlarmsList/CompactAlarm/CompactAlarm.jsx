import React, { useState } from 'react';
import Button from '../../../GeneralPurpose/Button/Button';
import styles from './CompactAlarm.module.css';
import StatusText from '../../../GeneralPurpose/AlarmLabelText/AlarmLabelText';
import { severityToStatus } from '../../../../Config';

export default function CompactAlarm({
  user,
  name,
  severity,
  maxSeverity,
  acknowledged,
  muted,
  reason,
  severityUpdateTimestamp,
  ackAlarm,
}) {
  const severityStatus = severityToStatus[severity];
  const maxSeverityStatus = severityToStatus[maxSeverity];
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles.alarmContainer}>
      <div
        className={styles.alarmWrapper}
        onClick={(event) => {
          setExpanded(!expanded);
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
        }}
      >
        <span className={styles.name}>{name}</span>
        <span className={styles.labelWrapper}>
          <span className={styles.label}>SEVERITY: </span>
        </span>
        <div className={styles.statusContainer}>
          <StatusText status={severityStatus}>{severityStatus}</StatusText>
        </div>
        <span className={styles.timestampContainer}>
          <span className={styles.label}>Updated: </span>
          <span className={styles.timestamp}>{severityUpdateTimestamp}</span>
        </span>
        <span className={styles.labelWrapper}>
          <span className={styles.label}>MAX SEVERITY: </span>
        </span>
        <div className={styles.statusContainer}>
          <StatusText status={maxSeverityStatus}>{maxSeverityStatus}</StatusText>
        </div>
        <div className={[styles.separator, expanded ? '' : styles.hidden].join(' ')}></div>
      </div>
      <div
        className={[styles.expandedAlarm, expanded ? '' : styles.hidden].join(' ')}
        onClick={(event) => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
        }}
      >
        <span className={styles.label}>Reason:</span>
        <div className={styles.reason}>{reason}</div>
        <div className={styles.ackButtonContainer}>
          <Button
            title="Acknowledge"
            status="info"
            shape="rounder"
            onClick={(event) => {
              event.stopPropagation();
              ackAlarm(name, maxSeverity, user);
              event.nativeEvent.stopImmediatePropagation();
            }}
          >
            ACK
          </Button>
        </div>
      </div>
    </div>
  );
}
