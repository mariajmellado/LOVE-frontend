import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import ManagerInterface from 'Utils';
import { formatSecondsToDigital, openInNewTab, getOLEDataFromTags } from 'Utils';
import { getLinkJira, getFileURL, getFilename } from 'Utils';
import { LOG_TYPE_OPTIONS } from 'Config';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import styles from './NonExposure.module.css';

export default class NonExposureDetail extends Component {
  static propTypes = {
    back: PropTypes.func,
    logDetail: PropTypes.object,
    remove: PropTypes.func,
  };

  static defaultProps = {
    back: () => {},
    edit: () => {},
    remove: () => {},
    logDetail: {
      id: undefined,
      level: undefined,
      timeIncident: undefined,
      subsystem: undefined,
      csc: undefined,
      topic: undefined,
      parameter: undefined,
      user: undefined,
      time_lost: undefined,
      jira: undefined,
      file: undefined,
      message_text: undefined,
      tags: [],
      urls: [],
    },
  };

  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('nonexposure-detail-');
    this.state = {
      confirmationModalShown: false,
      confirmationModalText: '',
    };
  }

  deleteMessage(message) {
    console.log('deleteMessage', message);
    ManagerInterface.deleteMessageNarrativeLogs(message.id).then((response) => {
      console.log('result', response);
      this.setState({ confirmationModalShown: false });
      this.props.remove(message);
    });
  }

  confirmDelete() {
    const modalText = (
      <span>
        You are about to <b>Delete</b> this message of Narrative Logs
        <br/>
        Are you sure?
      </span>
    );
    
    this.setState({
      confirmationModalShown: true,
      confirmationModalText: modalText,
    });
  }

  renderModalFooter() {
    const logDetail = this.props.logDetail ?? NonExposureDetail.defaultProps.logDetail;
    return (
      <div className={styles.modalFooter}>
        <Button
          className={styles.borderedButton}
          onClick={() => this.setState({ confirmationModalShown: false })}
          status="transparent"
        >
          Go back
        </Button>
        <Button onClick={() => this.deleteMessage(logDetail) } status="default">
          Yes
        </Button>
      </div>
    );
  };


  render() {
    const back = this.props.back;
    const logDetail = this.props.logDetail ?? NonExposureDetail.defaultProps.logDetail;
    const edit = this.props.edit ?? NonExposureDetail.defaultProps.edit;

    const { confirmationModalShown, confirmationModalText } = this.state;

    const linkJira = getLinkJira(logDetail.urls);
    const fileurl = getFileURL(logDetail.urls);

    const logTagsParams = getOLEDataFromTags(logDetail.tags);
    logDetail.csc = logTagsParams.csc;
    logDetail.topic = logTagsParams.topic;
    logDetail.parameter = logTagsParams.parameter;

    const logLevel = logDetail.level ? LOG_TYPE_OPTIONS.find((type) => type.value === logDetail.level).label : 'None';

    return (
      <>
        <div className={styles.returnToLogs}>
          <Button
            status="link"
            onClick={() => {
              back();
            }}
          >
            <span className={styles.title}>{`< Return to Logs`}</span>
          </Button>
        </div>
        <div id={this.id} className={styles.detailContainer}>
          <div className={styles.header}>
            <span className={styles.bold}>
              #{logDetail.id} - {logLevel}
            </span>
            {linkJira ? (
              <span>
                <Button status="link" title={linkJira} onClick={() => openInNewTab(linkJira)}>
                  view Jira ticket
                </Button>
              </span>
            ) : (
              <></>
            )}
            <span className={styles.floatRight}>
              <Button
                className={styles.iconBtn}
                title="Delete"
                onClick={() => this.confirmDelete() }
                status="transparent"
              >
                <DeleteIcon className={styles.icon} />
              </Button>
            </span>
            <span className={styles.floatRight}>
              <Button
                className={styles.iconBtn}
                title="Edit"
                onClick={() => {
                  edit(true);
                }}
                status="transparent"
              >
                <EditIcon className={styles.icon} />
              </Button>
            </span>
          </div>
          <div className={styles.content}>
            <div className={styles.detail}>
              <span className={styles.label}>Time of Incident</span>
              <span className={styles.value}>{logDetail.date_user_specified}</span>
              <span className={styles.label}>Subsystem Affected</span>
              <span className={styles.value}>
                {(logDetail.subsystem ?? 'None') +
                  ' > ' +
                  (logDetail.csc ?? 'None') +
                  ' > ' +
                  (logDetail.topic ?? 'None') +
                  ' > ' +
                  (logDetail.parameter ?? 'None')}
              </span>
              <span className={styles.label}>Obs. Time Loss</span>
              <span className={styles.value}>{formatSecondsToDigital(logDetail.time_lost)}</span>
            </div>
            <div className={styles.description}>
              <div className={styles.floatLeft}>
                <span>On </span>
                <span className={styles.bold}>{logDetail.date_added} </span>
                <span className={styles.bold}>{logDetail.user_id} </span>
                <span>wrote:</span>
              </div>
              <div className={styles.textDescription}>
                <br></br>
                {logDetail.message_text}
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            {fileurl && (
              <>
                <span className={styles.label}>File Attached: </span>
                <span className={styles.value}>
                  <div style={{ display: 'flex' }}>
                    <Button title={fileurl} onClick={() => openInNewTab(fileurl)} status="link">
                      {getFilename(fileurl)}
                    </Button>
                    <Button
                      className={styles.iconBtn}
                      title={fileurl}
                      onClick={() => openInNewTab(fileurl)}
                      status="transparent"
                    >
                      <DownloadIcon className={styles.icon} />
                    </Button>
                  </div>
                </span>
              </>
            )}
          </div>
        </div>
        <Modal
          displayTopBar={false}
          isOpen={!!confirmationModalShown}
          onRequestClose={() => this.setState({ confirmationModalShown: false })}
          parentSelector={() => document.querySelector(`#${this.id}`)}
          size={50}
        >
          {confirmationModalText}
          {this.renderModalFooter()}
        </Modal>
      </>
    );
  }
}
