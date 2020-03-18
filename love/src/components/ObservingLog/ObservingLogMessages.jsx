import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../GeneralPurpose/Panel/Panel';
import styles from './ObservingLogMessages.module.css';
import TextField from '../TextField/TextField';

export default class ObservingLogInput extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
    /** Username of logged user */
    logMessages: PropTypes.array,
  };

  static defaultProps = {
    alarms: [],
  };

  constructor() {
    super();
    this.state = {
      filter: '',
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  changeFilter = (event) => {
    this.setState({
      filter: event.target.value,
    });
  };

  render() {
    return (
      <Panel title="Observing Log" className={styles.panel}>
        <div className={styles.container}>
          <div className={styles.filterContainer}>
            <span className={styles.filterLabel}>Filter: </span>
            <TextField type="text" value={this.state.filter} onChange={this.changeFilter} />
          </div>
          {this.props.logMessages.map((msg) => {
            const filter =
              this.state.filter === '' ||
              new RegExp(this.state.filter, 'i').test(msg.message.value) ||
              new RegExp(this.state.filter, 'i').test(msg.user.value);
              
            return (
              filter && (
                <div key={Math.random()} className={styles.logMessageWrapper}>
                  <div className={styles.logMessage}>
                    <div className={styles.topSection}>
                      <span>{msg.user.value}</span>
                      <span>{new Date(msg.private_rcvStamp.value * 1000).toLocaleString()}</span>
                    </div>
                    <div className={styles.messageSection}>
                      <span>{msg.message.value}</span>
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </Panel>
    );
  }
}
