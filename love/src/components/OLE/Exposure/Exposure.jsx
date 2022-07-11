import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import { CSVLink } from 'react-csv';
import ManagerInterface from 'Utils';
import { exposureFlagStateToStyle } from 'Config';
import ExposureAdd from './ExposureAdd';
import ExposureDetail from './ExposureDetail';
import styles from './Exposure.module.css';

const moment = extendMoment(Moment);

export default class Exposure extends Component {
  static propTypes = {
    // Instrument Options
    instruments: PropTypes.arrayOf(PropTypes.string),
    selectedInstrument: PropTypes.string,
    changeInstrumentSelect: PropTypes.func,
    // Exposure Type Options
    selectedExposureType: PropTypes.string,
    // Filter date & time
    selectedDateStart: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    selectedDateEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    handleDateTimeRange: PropTypes.func,
  };

  static defaultProps = {
    instruments: [],
    selectedInstrument: null,
    changeInstrumentSelect: () => {console.log('defaultProps.changeInstrumentSelect')},
    selectedExposureType: null,
    changeExposureTypeSelect: () => {console.log('defaultProps.changeExposureType')},
    selectedExposureType: 'all',
    selectedDateStart: null,
    selectedDateEnd: null,
    handleDateTimeRange: () => {console.log('defaultProps.handleDateTimeRange')},
  };

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeAdd: false,
      selected: {},
      selectedMessages: [],
      exposurelogs: [],
      exposureTypes: [],
      observationIds: [],
      messages: [],
      range: [],
    };
  }

  view(index) {
    if (index) {
      ManagerInterface.getListMessagesExposureLogs(index['obs_id']).then((data) => {
        this.setState({
          modeView: true,
          modeAdd: false,
          selected: index,
          selectedMessages: data,
        });
      });
    }
  }

  add(index) {
    if (index) {
      this.setState({
        modeAdd: true,
        modeView: false,
        selected: index,
      });
    }
  }

  statusFlag(flag) {
    return exposureFlagStateToStyle[flag] ? exposureFlagStateToStyle[flag] : 'unknown';
  }

  getHeaders = () => {
    return [
      {
        field: 'obs_id',
        title: 'Observation Id',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'timespan_end',
        title: 'Date & Time (TAI)',
        type: 'timestamp',
        className: styles.tableHead,
      },
      {
        field: 'instrument',
        title: 'Instrument',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'observation_type',
        title: 'Observation Type',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'flags',
        title: 'Flags',
        type: 'string',
        className: styles.tableHead,
        render: (value, row) => {
          const values = String(value).split(',');
          return values.map((val) => {
            return (
              <span>
                <FlagIcon title={val} status={this.statusFlag(val)} className={styles.iconFlag} />
              </span>
            );
          });
        },
      },
      {
        field: 'action',
        title: 'Action',
        type: 'string',
        className: styles.tableHead,
        render: (_, index) => {
          return (
            <>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="View"
                  onClick={() => {
                    this.view(index);
                  }}
                  status="transparent"
                >
                  <AcknowledgeIcon className={styles.icon} />
                </Button>
              </span>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="Add"
                  onClick={() => {
                    this.add(index);
                  }}
                  status="transparent"
                >
                  <AddIcon className={styles.icon} />
                </Button>
              </span>
            </>
          );
        },
      },
    ];
  };

  componentDidMount() {
    console.log('Exposure.componentDidMount');
    ManagerInterface.getListAllMessagesExposureLogs().then((data) => {
      this.setState({ messages: data });
    });

    this.setState({range: moment.range(this.props.selectedDateStart, this.props.selectedDateEnd)});

    ManagerInterface.getListExposureLogs(this.props.selectedInstrument).then((data) => {
      const exposureTypes = new Set();
      const exposures = data.map((exposure) => {
        exposureTypes.add(exposure.observation_type);
        // TODO: request for all the obs_id, all messages and only use exposure_flag PENDING: backend with query of flags without query to exposurelogs/messages
        // ManagerInterface.getListMessagesExposureLogs(exposure['obs_id']).then((messages) => {
        //   const flags = messages
        //     .map((message) => message['exposure_flag'])
        //     .reduce((acc, curr) => acc.find((f) => f === curr) ? acc : [...acc, curr], []);
        //   exposure['flags'] = flags;
        //   return exposure;
        // });
        return { ...exposure };
      });
      this.setState({ exposurelogs: exposures, exposureTypes: Array.from(exposureTypes) });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('prevProps', prevProps);
    if (prevProps.selectedInstrument !== this.props.selectedInstrument) {
      console.log('componentDidUpdate', this.props.selectedInstrument);
      ManagerInterface.getListExposureLogs(this.props.selectedInstrument).then((data) => {
        const exposureTypes = new Set();
        const exposures = data.map((exposure) => {
          exposureTypes.add(exposure.observation_type);
          // TODO: request for all the obs_id, all messages and only use exposure_flag PENDING: backend with query of flags without query to exposurelogs/messages
          // ManagerInterface.getListMessagesExposureLogs(exposure['obs_id']).then((messages) => {
          //   const flags = messages
          //     .map((message) => message['exposure_flag'])
          //     .reduce((acc, curr) => acc.find((f) => f === curr) ? acc : [...acc, curr], []);
          //   exposure['flags'] = flags;
          //   return exposure;
          // });
          return { ...exposure };
        });
        this.setState({ exposurelogs: exposures, exposureTypes: Array.from(exposureTypes) });
      });
    }

    if (prevProps.selectedDateStart !== this.props.selectedDateStart ||
      prevProps.selectedDateEnd !== this.props.selectedDateEnd
    ) {
      this.setState({range: moment.range(this.props.selectedDateStart, this.props.selectedDateEnd)});
    }
  }

  render() {
    const modeView = this.state.modeView;
    const modeAdd = this.state.modeAdd;
    const headers = this.getHeaders();

    const tableData = this.state.exposurelogs;
    const instrumentsOptions = this.props.instruments;
    const selectedInstrument = this.props.selectedInstrument;
    const exposureTypeOptions = [
      { label: 'All observation types', value: 'all' },
      ...this.state.exposureTypes.map((type) => ({ label: type, value: type })),
    ];
    const selectedExposureType = this.props.selectedExposureType;

    const range = this.state.range;

      // Filter by date range
    let filteredData = tableData.filter((log) => range.contains(Moment(log.timespan_end)));

    // Filter by exposure type
    filteredData =
      selectedExposureType !== 'all'
        ? filteredData.filter((exp) => exp.observation_type === selectedExposureType)
        : filteredData;

    // Obtain headers to create csv report
    const logExample = this.state.messages?.[0];
    const logExampleKeys = Object.keys(logExample ?? {});
    const csvHeaders = logExampleKeys.map((key) => ({ label: key, key }));

    return modeView && !modeAdd ? (
      <ExposureDetail
        back={() => {
          this.setState({ modeView: false });
        }}
        logDetail={this.state.selected}
        logMessages={this.state.selectedMessages}
        edit={(isClicked) => {
          console.log('ExposeDetail.edit', this.state.selected);
          if (isClicked) this.add(this.state.selected);
        }}
      />
    ) : modeAdd && !modeView ? (
      <ExposureAdd
        back={() => {
          this.setState({ modeAdd: false });
        }}
        logEdit={this.state.selected}
        view={(isClicked) => {
          if (isClicked) console.log('ExposeAdd.view', this.state.selected);
          this.view(this.state.selected);
        }}
      />
    ) : (
      <div className={styles.margin10}>
        <div className={styles.title}>Filter</div>
        <div className={styles.filters}>
          <Select
            options={instrumentsOptions}
            option={selectedInstrument}
            onChange={({ value }) => this.props.changeInstrumentSelect(value)}
            className={styles.select}
          />

          <DateTimeRange
            onChange={(date, type) => {
              this.props.handleDateTimeRange(date, type);
            }}
            label="Date & Time"
            startDate={this.props.selectedDateStart}
            endDate={this.props.selectedDateEnd}
          />

          <Select
            options={exposureTypeOptions}
            option={selectedExposureType}
            onChange={({ value }) => this.props.changeExposureType(value)}
            className={styles.select}
          />
          <div className={styles.divExportBtn}>
            <CSVLink data={this.state.messages} headers={csvHeaders} filename="exposureLogMessages.csv">
              <Hoverable top={true} left={true} center={true} inside={true}>
                <span className={styles.infoIcon}>
                  <DownloadIcon className={styles.iconCSV} />
                </span>
                <div className={styles.hover}>Download messages associated with the shown exposures</div>
              </Hoverable>
            </CSVLink>
          </div>
        </div>
        <SimpleTable headers={headers} data={filteredData} />
      </div>
    );
  }
}
