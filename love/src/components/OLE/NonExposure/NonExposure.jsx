import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import Select from 'components/GeneralPurpose/Select/Select';
import NonExposureDetail from './NonExposureDetail';
import NonExposureEdit from './NonExposureEdit';
import styles from './NonExposure.module.css';
import { CSCSummaryHierarchy, LOG_TYPE_OPTIONS } from 'Config';
import { formatSecondsToDigital } from 'Utils';

const moment = extendMoment(Moment);

export default class NonExposure extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeEdit: false,
      selected: {},
      selectedDateStart: null,
      selectedDateEnd: null,
      selectedCommentType: 'All',
      selectedSubsystem: 'All',
      selectedObsTimeLoss: false,
    };
  }

  handleDateTimeRange(date, type) {
    if (type === 'start') {
      this.setState({ selectedDateStart: date });
    } else if (type === 'end') {
      this.setState({ selectedDateEnd: date });
    }
  }

  view(index) {
    if (index) {
      this.setState({
        modeView: true,
        selected: index,
      });
    }
  }

  edit(index) {
    if (index) {
      this.setState({
        modeEdit: true,
        selected: index,
      });
    }
  }

  getHeaders = () => {
    return [
      {
        field: 'id',
        title: 'Log Id',
        type: 'number',
        className: styles.tableHead,
      },
      {
        field: 'userId',
        title: 'User Id',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'agent',
        title: 'Agent',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'timestamp',
        title: 'Timestamp',
        type: 'timestamp',
        className: styles.tableHead,
      },
      {
        field: 'timeIncident',
        title: 'Time of Incident',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'type',
        title: 'Type',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'time_lost',
        title: 'Obs. Time Loss',
        type: 'string',
        className: styles.tableHead,
        render: (value) => formatSecondsToDigital(value),
      },
      {
        field: 'subsystem',
        title: 'Subsystem',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'csc',
        title: 'CSC',
        type: 'string',
        className: styles.tableHead,
        render: (cell, row) => (
          <b>
            {cell}:{row.salindex}
          </b>
        ),
      },
      {
        field: 'cscTopic',
        title: 'CSC Topic',
        type: 'string',
        className: styles.tableHead,
      },
      {
        field: 'file',
        title: 'File',
        type: 'link',
        className: styles.tableHead,
        render: (value) => (
          <Button className={styles.iconBtn} title="File" onClick={() => {}}>
            <DownloadIcon className={styles.icon} />
          </Button>
        ),
      },
      {
        field: 'jira',
        title: 'Jira',
        type: 'link',
        className: styles.tableHead,
        render: (value) => <Link to={value}>{value}</Link>,
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
                  <AcknowledgeIcon className={styles.icon} nonAcknowledge={false} />
                </Button>
              </span>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="Edit"
                  onClick={() => {
                    this.edit(index);
                  }}
                  status="transparent"
                >
                  <EditIcon className={styles.icon} />
                </Button>
              </span>
            </>
          );
        },
      },
    ];
  };

  render() {
    const modeView = this.state.modeView;
    const modeEdit = this.state.modeEdit;
    const headers = Object.values(this.getHeaders());

    let filteredData = [
      {
        id: 1,
        userId: 'MiaElbo',
        agent: 'Lorem',
        timestamp: '2022-03-21 11:24:24',
        timeIncident: '2022-03-21 12:25:25',
        type: 'Observation',
        time_lost: 10,
        subsystem: 'Main Telescope',
        csc: 'MTHexapod',
        salindex: 0,
        cscTopic: 'Actuators',
        cscParam: 'Test_param',
        file: { name: 'file.csv', size: 6078 },
        jira: 'http://lsst.jira.org',
        description:
          'Operator Andrea Molla collapse during observation Relay team will have to finish her tasks when they take over. First we have the Logs component, which will display logs created by different love-operators. This component will have two tabs, one for non-exposure logs and another for exposure logs, viewing these two types of logs is very different.',
      },
    ];

    // Filter by date range
    const range = moment.range(this.state.selectedDateStart, this.state.selectedDateEnd);
    // console.log(this.state.selectedDateStart);
    filteredData = filteredData.filter((log) => range.contains(Moment(log.timestamp)));

    // Filter by type
    filteredData =
      this.state.selectedCommentType !== 'All'
        ? filteredData.filter((log) => log.type === this.state.selectedCommentType)
        : filteredData;

    // Filter by subsystem
    filteredData =
      this.state.selectedSubsystem !== 'All'
        ? filteredData.filter((log) => log.subsystem === this.state.selectedSubsystem)
        : filteredData;

    // Filter by obs time loss
    filteredData = this.state.selectedObsTimeLoss ? filteredData.filter((log) => log.time_lost > 0) : filteredData;

    // const tableData = Object.values(filteredData);
    const tableData = filteredData;

    const commentTypeOptions = ['All', ...LOG_TYPE_OPTIONS];
    const selectedCommentType = this.state.selectedCommentType;

    const subsystemOptions = ['All', ...Object.keys(CSCSummaryHierarchy)];
    const selectedSubsystem = this.state.selectedSubsystem;

    const selectedObsTimeLoss = this.state.selectedObsTimeLoss;

    return modeView && !modeEdit ? (
      <NonExposureDetail
        back={() => {
          this.setState({ modeView: false });
        }}
        logDetail={this.state.selected}
      />
    ) : modeEdit && !modeView ? (
      <NonExposureEdit
        back={() => {
          this.setState({ modeEdit: false });
        }}
        logEdit={this.state.selected}
      />
    ) : (
      <div className={styles.margin10}>
        <div className={styles.title}>Filter</div>
        <div className={styles.filters}>
          <DateTimeRange
            onChange={(date, type) => this.handleDateTimeRange(date, type)}
            label="From:"
            startDate={new Date() - 24 * 60 * 60 * 1000}
            endDate={new Date(Date.now())}
          />

          <Select
            options={commentTypeOptions}
            option={selectedCommentType}
            onChange={({ value }) => this.setState({ selectedCommentType: value })}
            className={styles.select}
          />

          <Select
            options={subsystemOptions}
            option={selectedSubsystem}
            onChange={({ value }) => this.setState({ selectedSubsystem: value })}
            className={styles.select}
          />

          <div className={styles.checkboxText}>
            Show only logs with Obs. time loss
            <Input
              type="checkbox"
              checked={selectedObsTimeLoss}
              onChange={(event) => this.setState({ selectedObsTimeLoss: event.target.checked })}
            />
          </div>
        </div>
        <SimpleTable headers={headers} data={tableData} />
      </div>
    );
  }
}
