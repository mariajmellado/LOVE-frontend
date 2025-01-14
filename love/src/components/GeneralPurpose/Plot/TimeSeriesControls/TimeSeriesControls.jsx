import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from 'components/GeneralPurpose/Select/Select';
import DateSelection from './DateSelection/DateSelection';
import TimeWindow from './TimeWindow/TimeWindow';
import styles from './TimeSeriesControls.module.css';

export default class TimeSeriesControls extends Component {
  static propTypes = {
    /** Display time window in live mode if true, otherwise display date selection */
    liveMode: PropTypes.bool,
    /** Function to be called when changing the time window */
    setTimeWindow: PropTypes.func.isRequired,
    isLive: PropTypes.bool,
    setLiveMode: PropTypes.func,
    timeWindow: PropTypes.number,
    setHistoricalData: PropTypes.func,
    efdClients: PropTypes.array,
    selectedEfdClient: PropTypes.string,
    setEfdClient: PropTypes.func,
    goBack: PropTypes.func,
  };

  static defaultProps = {
    liveMode: false,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      dateSelectorDates: null,
    };
  }

  handleChangeChk = () => {
    if (this.props.isLive) this.props.setLiveMode(false);
    else this.props.setLiveMode(true);
  };

  componentDidMount() {
    this.setState({ dateSelectorDates: [moment().subtract(1, 'h'), moment()] });
  }

  render() {
    return (
      <div ref={this.containerRef} className={styles.timeseriesControlsContainer}>
        <div className={styles.switchContainer}>
          <span
            className={[styles.modeSelection, this.props.isLive ? styles.highlightText : ''].join(' ')}
            onClick={() => this.props.setLiveMode(true)}
          >
            Live
          </span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              alt="Live/query mode toggle"
              checked={!this.props.isLive}
              onChange={this.handleChangeChk}
            />
            <span className={[styles.slider, styles.round].join(' ')} />
          </label>
          <span
            className={[styles.modeSelection, !this.props.isLive ? styles.highlightText : ''].join(' ')}
            onClick={() => this.props.setLiveMode(false)}
          >
            Query
          </span>
        </div>

        {this.props.isLive ? (
          <TimeWindow setTimeWindow={this.props.setTimeWindow} timeWindow={this.props.timeWindow} />
        ) : (
          <div className={styles.queryInputs}>
            <Select
              options={this.props.efdClients}
              option={this.props.selectedEfdClient}
              onChange={({ value }) => this.props.setEfdClient(value)}
              className={styles.efdClients}
              placeholder="Select EFD Client"
            />
            <DateSelection
              dateSelectorDates={this.state.dateSelectorDates}
              setHistoricalData={this.props.setHistoricalData}
              submitDisabled={!this.props.selectedEfdClient}
            />
          </div>
        )}
        {/* <div onClick={this.props.goBack} className={styles.gearIconContainer}>
          <GearIcon active />
        </div> */}
      </div>
    );
  }
}
