import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import { CSCSummaryHierarchy, LOG_TYPE_OPTIONS } from 'Config';
import ManagerInterface from 'Utils';
import { getLinkJira, getFileURL, getFilename } from 'Utils';
import { getOLEDataFromTags } from 'Utils';
import styles from './NonExposure.module.css';

export default class NonExposureEdit extends Component {
  static propTypes = {
    back: PropTypes.func,
    logEdit: PropTypes.object,
    isLogCreate: PropTypes.bool,
    isMenu: PropTypes.bool,
  };

  static defaultProps = {
    back: () => {},
    logEdit: {
      id: undefined,
      type: undefined,
      timeIncident: undefined,
      subsystem: undefined,
      csc: undefined,
      topic: undefined,
      param: undefined,
      salindex: 0,
      user: undefined,
      obsTimeLoss: 0,
      jira: false,
      file: undefined,
      fileurl: undefined,
      filename: undefined,
      urls: [],
      tags: [],
      message_text: undefined,
    },
    isLogCreate: false,
    isMenu: false,
    view: () => {},
  };

  constructor(props) {
    super(props);
    const logEdit = props.logEdit ? props.logEdit : NonExposureEdit.defaultProps.logEdit;
    logEdit.jiraurl = getLinkJira(logEdit.urls);
    logEdit.fileurl = getFileURL(logEdit.urls);
    logEdit.filename = getFilename(getFileURL(logEdit.urls));
    logEdit.jira = false;
    const params = getOLEDataFromTags(logEdit.tags);
    logEdit.type = params.type;
    logEdit.subsystem = params.subsystem;
    logEdit.csc = params.csc;
    logEdit.topic = params.topic;
    logEdit.param = params.param;
    this.state = {
      logEdit,
      optionsTree: {},
    };
    console.log('constructor', this.state.logEdit);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const newFakeMessage = { ...this.state.logEdit };
    newFakeMessage['level'] = 10;
    newFakeMessage['user_id'] = 'saranda@localhost';
    newFakeMessage['user_agent'] = 'LOVE';
    newFakeMessage['is_human'] = true;
    newFakeMessage['subsystem'] = this.state.logEdit.subsystem;
    console.log('Submitted: ', newFakeMessage);
    if (this.state.logEdit.id) {
      newFakeMessage['tags'] = [];
      newFakeMessage['urls'] = [];
      // ManagerInterface.updateMessageNarrativeLogs(this.state.logEdit.id, this.state.logEdit).then((response) => {
      ManagerInterface.updateMessageNarrativeLogs(this.state.logEdit.id, newFakeMessage).then((response) => {
        console.log('result', response);
        this.props.back();
      });
    } else {
      newFakeMessage['tags'] = [
        this.state.logEdit.type,
        this.state.logEdit.csc,
        this.state.logEdit.topic,
        this.state.logEdit.param,
      ];
      console.log('fakemessage', newFakeMessage);
      ManagerInterface.createMessageNarrativeLogs(newFakeMessage).then((response) => {
        this.setState({ logEdit: { obsTimeLoss: 0, salindex: 0 } });
        this.props.back();
      });
    }
  }

  handleTimeOfIncident(date, type) {
    if (type === 'start') {
      this.setState((state) => ({
        logEdit: { ...state.logEdit, endDate: date },
      }));
    } else if (type === 'end') {
      this.setState((state) => ({
        logEdit: { ...state.logEdit, startDate: date },
      }));
    }
  }

  componentDidMount() {
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      this.setState({ optionsTree: data });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (prevState.logEdit?.subsystem || this.state.logEdit?.subsystem) &&
      prevState.logEdit.subsystem !== this.state.logEdit.subsystem
    ) {
      this.setState((state) => ({
        logEdit: { ...state.logEdit, csc: null, salindex: 0, topic: null, param: null },
        topicOptions: [],
        paramsOptions: [],
      }));
    }

    if ((prevState.logEdit?.csc || this.state.logEdit?.csc) && prevState.logEdit.csc !== this.state.logEdit.csc) {
      if (!this.state.logEdit?.csc) return;
      const options = [
        ...Object.keys(this.state.optionsTree[this.state.logEdit.csc].telemetry_data),
        ...Object.keys(this.state.optionsTree[this.state.logEdit.csc].event_data),
      ].sort();
      this.setState((state) => ({
        topicOptions: options,
        logEdit: { ...state.logEdit, salindex: 0, topic: null, param: null },
      }));
    }

    if (
      (prevState.logEdit?.topic || this.state.logEdit?.topic) &&
      prevState.logEdit.topic !== this.state.logEdit.topic
    ) {
      if (!this.state.logEdit.csc || !this.state.logEdit?.topic) return;
      const topicData = [
        ...Object.entries(this.state.optionsTree[this.state.logEdit.csc].telemetry_data),
        ...Object.entries(this.state.optionsTree[this.state.logEdit.csc].event_data),
      ];
      const topicParams = topicData.find(([topic]) => {
        return topic === this.state.logEdit.topic;
      });
      const options = Object.keys(topicParams[1]).sort();
      this.setState((state) => ({
        paramsOptions: options,
        logEdit: { ...state.logEdit, param: null },
      }));
    }
  }

  render() {
    const link = this.props.back;
    const isLogCreate = this.props.isLogCreate;
    const isMenu = this.props.isMenu;
    const view = this.props.view ? this.props.view : NonExposureEdit.defaultProps.view;

    const subsystemOptions = Object.keys(CSCSummaryHierarchy);
    const cscsOptions = this.state.logEdit?.subsystem
      ? Array.from(
          new Set(
            Object.values(
              CSCSummaryHierarchy[this.state.logEdit.subsystem]
                ? CSCSummaryHierarchy[this.state.logEdit.subsystem]
                : '',
            )
              .flat()
              .map((e) => e.name),
          ),
        ).sort()
      : [];
    const topicsOptions = this.state.topicOptions;
    const paramsOptions = this.state.paramsOptions;

    return (
      <>
        {!isLogCreate && !isMenu ? (
          <div className={styles.returnToLogs}>
            <Button
              status="link"
              onClick={() => {
                link();
              }}
            >
              <span className={styles.title}>{`< Return to Logs`}</span>
            </Button>
          </div>
        ) : (
          <></>
        )}
        <form onSubmit={this.handleSubmit}>
          <div className={isMenu ? styles.detailContainerMenu : styles.detailContainer}>
            {isMenu ? (
              <></>
            ) : (
              <div className={styles.header}>
                {this.state.logEdit.id ? <span className={styles.bold}>#{this.state.logEdit.id}</span> : <></>}
                {this.state.logEdit.id ? (
                  <>
                    <span className={styles.floatRight}>
                      <Button
                        className={styles.iconBtn}
                        title="View"
                        onClick={() => {
                          view(true);
                        }}
                        status="transparent"
                      >
                        <CloseIcon className={styles.icon} />
                      </Button>
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}

            <div className={isMenu ? styles.contentMenu : styles.content}>
              <div className={styles.contentLeft}>
                <span className={styles.label}>Type of Comment</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.type}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, type: event.value },
                      }))
                    }
                    options={LOG_TYPE_OPTIONS}
                    className={styles.select}
                    small
                  />
                </span>
                <span className={styles.label}>Obs. Time Loss</span>
                <span className={styles.value}>
                  <Input
                    type="number"
                    min={0}
                    value={this.state.logEdit.obsTimeLoss}
                    className={styles.input}
                    onChange={(event) =>
                      this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, obsTimeLoss: event.value } }))
                    }
                  />
                </span>
                <span className={styles.label}>Subsystem</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.subsystem}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, subsystem: event.value },
                      }))
                    }
                    options={subsystemOptions}
                    className={styles.select}
                    small
                  />
                </span>
                <span className={styles.label}>CSC</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.csc}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, csc: event.value },
                      }))
                    }
                    options={cscsOptions}
                    className={styles.select}
                    small
                  />
                </span>
                <span className={styles.label}>Salindex</span>
                <span className={styles.value}>
                  <Input
                    type="number"
                    min={0}
                    value={this.state.logEdit.salindex}
                    className={styles.input}
                    onChange={(event) =>
                      this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, salindex: event.value } }))
                    }
                  />
                </span>
                <span className={styles.label}>CSC Topic</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.topic}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, topic: event.value },
                      }))
                    }
                    options={topicsOptions}
                    className={styles.select}
                  />
                </span>
                <span className={styles.label}>Param</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.param}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, param: event.value },
                      }))
                    }
                    options={paramsOptions}
                    className={styles.select}
                  />
                </span>
                {isMenu ? (
                  <>
                    <span className={styles.label}>Time of Incident</span>
                    <span className={styles.value}>
                      <DateTimeRange
                        className={styles.dateTimeRangeStyle}
                        onChange={(date, type) => this.handleTimeOfIncident(date, type)}
                        startDate={new Date() - 24 * 60 * 60 * 1000}
                        endDate={new Date(Date.now())}
                      />
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className={styles.contentRight}>
                <div className={[styles.mb1, styles.floatLeft, styles.inline].join(' ')}>
                  <span className={styles.title}>Message</span>
                  {isMenu ? (
                    <></>
                  ) : (
                    <>
                      <span className={styles.label}>Time of Incident</span>
                      <span className={styles.value}>
                        <DateTimeRange
                          className={styles.dateTimeRangeStyle}
                          onChange={(date, type) => this.handleTimeOfIncident(date, type)}
                          startDate={new Date() - 24 * 60 * 60 * 1000}
                          endDate={new Date(Date.now())}
                        />
                      </span>
                    </>
                  )}
                </div>
                <TextArea
                  value={this.state.logEdit.message_text}
                  callback={(event) =>
                    this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, message_text: event } }))
                  }
                />
              </div>
            </div>
            <div className={isMenu ? styles.footerMenu : styles.footer}>
              {!this.state.logEdit.id ? (
                <FileUploader
                  value={this.state.logEdit.file?.name}
                  handleFile={(file) =>
                    this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: file } }))
                  }
                  handleDelete={() =>
                    this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: undefined } }))
                  }
                />
              ) : (
                <></>
              )}
              {this.state.logEdit.fileurl ? (
                <>
                  <Button
                    status="link"
                    title={this.state.logEdit.fileurl}
                    onClick={() => openInNewTab(this.state.logEdit.fileurl)}
                  >
                    {this.state.logEdit.filename}
                  </Button>
                  <Button
                    className={styles.iconBtn}
                    title={this.state.logEdit.fileurl}
                    onClick={() => openInNewTab(this.state.logEdit.fileurl)}
                    status="transparent"
                  >
                    <DownloadIcon className={styles.icon} />
                  </Button>
                </>
              ) : (
                <></>
              )}
              <span className={isMenu ? styles.footerRightMenu : styles.footerRight}>
                {!this.state.logEdit.id ? (
                  <span className={styles.checkboxText}>
                    Create and link new Jira ticket
                    <Input
                      type="checkbox"
                      checked={this.state.logEdit.jira}
                      onChange={(event) => {
                        this.setState((prevState) => ({
                          logEdit: { ...prevState.logEdit, jira: event.target.checked },
                        }));
                      }}
                    />
                  </span>
                ) : this.state.logEdit.jiraurl ? (
                  <span className={styles.checkboxText}>
                    <Button
                      status="link"
                      title={this.state.logEdit.jiraurl}
                      onClick={() => openInNewTab(this.state.logEdit.jiraurl)}
                    >
                      view Jira ticket
                    </Button>
                  </span>
                ) : (
                  <></>
                )}
                <Button type="submit">
                  <span className={styles.title}>Upload Log</span>
                </Button>
              </span>
            </div>
          </div>
        </form>
      </>
    );
  }
}
