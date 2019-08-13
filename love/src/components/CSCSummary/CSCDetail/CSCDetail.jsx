import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCDetail.module.css';
import HeartbeatIcon from '../../icons/HeartbeatIcon/HeartbeatIcon';

export default class CSCDetail extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    realm: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    heartbeatData: PropTypes.object,
    summaryStateData: PropTypes.object,
    subscribeToStreams: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    group: '',
    realm: '',
    data: {},
    onCSCClick: () => 0,
    heartbeatData: null,
    summaryStateData: undefined,
    subscribeToStreams: () =>{},
  };

  static states = {
    0: {
      name: 'UNKNOWN',
      userReadable: 'Unknown',
      char: 'U',
      class: styles.disabled,
    },
    1: {
      name: 'DISABLED',
      userReadable: 'Disabled',
      char: 'D',
      class: styles.disabled,
    },
    2: {
      name: 'ENABLED',
      userReadable: 'Enabled',
      char: 'E',
      class: styles.ok,
    },
    3: {
      name: 'FAULT',
      userReadable: 'Fault',
      char: 'F',
      class: styles.alert,
    },
    4: {
      name: 'OFFLINE',
      userReadable: 'Offline',
      char: 'O',
      class: styles.disabled,
    },
    5: {
      name: 'STANDBY',
      userReadable: 'Standby',
      char: 'S',
      class: styles.warning,
    },
  };

  shouldComponentUpdate = (nextProps) => {
    return (
      this.props.name !== nextProps.name ||
      this.props.summaryStateData !== nextProps.summaryStateData ||
      nextProps.heartbeatData !== this.props.heartbeatData
    );
  };

  componentDidMount = () => {
    this.props.subscribeToStreams(this.props.name, this.props.salindex);
  }
  
  render() {
    const summaryStateValue = this.props.summaryStateData ? this.props.summaryStateData.summaryState.value: 0 ;
    const summaryState = CSCDetail.states[summaryStateValue];
    const { props } = this;
    let heartbeatStatus = 'unknown';
    let nLost = 0;
    let timeDiff = -1;
    if (this.props.heartbeatData) {
      heartbeatStatus = this.props.heartbeatData.lost > 0 ? 'alert' : 'ok';
      nLost = this.props.heartbeatData.lost;
      if (this.props.heartbeatData.last_heartbeat_timestamp < 0) timeDiff = -1;
      else timeDiff = Math.ceil(new Date().getTime() / 1000 - this.props.heartbeatData.last_heartbeat_timestamp);
    }
    const timeDiffText = timeDiff < 0 ? 'Never' : `${timeDiff} seconds ago`;

    return (
      <div
        onClick={() => this.props.onCSCClick(props.realm, props.group, props.name, props.salindex)}
        className={styles.CSCDetailContainer}
      >
        <div className={[styles.leftSection, summaryState.class].join(' ')}>
          <span className={styles.summaryState} title={summaryState.userReadable}>
            {summaryState.char}
          </span>
        </div>
        <div className={styles.middleSection} title={this.props.name+'-'+this.props.salindex}>
          {this.props.name+'-'+this.props.salindex}
        </div>
        <div className={styles.rightSection}>
          <div className={styles.heartbeatIconWrapper}>
            <HeartbeatIcon
              status={heartbeatStatus}
              title={`${this.props.name+'-'+this.props.salindex} heartbeat\nLost: ${nLost}\nLast seen: ${timeDiffText}`}
            />
          </div>
        </div>
      </div>
    );
  }
}
