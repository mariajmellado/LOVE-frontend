import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';
import { CardList, Card, Title, Separator } from 'components/GeneralPurpose/CardList/CardList';
import { signals, effects } from '../../Config';

export default class GIS extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      activeEffects: [],
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  signalOnEnter = (effects) => {
    console.log(effects);
    this.setState({ activeEffects: effects });
  };

  signalOnLeave = () => {
    this.setState({ activeEffects: [] });
  };

  render() {
    const { activeEffects } = this.state;
    // const flattenedSignals = Object.values(signals).map((signals) => Object.values(signals)).flat();
    const flattenedSignals = Object.entries(signals);
    const effectsArray = Object.entries(effects);
    console.log(flattenedSignals);
    return (
      <div className={styles.div}>
        <div className={styles.div2}>
          {flattenedSignals.map(([system, signals]) => (
            <div className={styles.system}>
              <h4>{system}</h4>
              {Object.keys(signals).map((signal) => (
                <div
                  onMouseEnter={() => this.signalOnEnter(signals[system][signal])}
                  onMouseLeave={() => this.signalOnLeave()}
                  className={styles.signal}
                >
                  {signal}
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* <Separator className={styles.separator}/> */}
        <div className={styles.div2}>
          {/* <div className={[styles.signal, activeEffects.includes("fireIndication") ? '' : styles.inactive].join(" ")}>fireIndication</div> */}
          {effectsArray.map(([system, effects]) => (
            <div className={styles.system}>
              <h4>{system}</h4>
              {effects.map((effect) => (
                <div
                  className={[
                    styles.signal,
                    activeEffects.includes(effect) ? '' : activeEffects.length > 0 ? styles.inactive : '',
                  ].join(' ')}
                >
                  {effect}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
