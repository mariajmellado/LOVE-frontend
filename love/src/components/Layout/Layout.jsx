import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { SALCommandStatus } from '../../redux/actions/ws';
import { getNotificationMessage } from '../../Utils';
import Button from '../GeneralPurpose/Button/Button';
import NotificationIcon from '../icons/NotificationIcon/NotificationIcon';
import GearIcon from '../icons/GearIcon/GearIcon';
import styles from './Layout.module.css';

export default class Layout extends Component {
  static propTypes = {
    /** Children components */
    children: PropTypes.node,
    /** Last SAL command that has been sent */
    lastSALCommand: PropTypes.object,
    /** Function to log oput of the app */
    logout: PropTypes.func,
    /** Authentication token */
    token: PropTypes.string,
    /** Mode of the LOVE (EDIT or VIEW) */
    mode: PropTypes.string,
  };

  static defaultProps = {
    lastSALCommand: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      settingsVisible: false,
    };
  }

  componentDidUpdate = (prevProps, _prevState) => {
    /* Check command ack for toast*/
    if (
      prevProps.lastSALCommand.status === SALCommandStatus.REQUESTED &&
      this.props.lastSALCommand.status === SALCommandStatus.ACK
    ) {
      const [message, result] = getNotificationMessage(this.props.lastSALCommand);
      if (result === 'Done') {
        toast.success(message);
      } else {
        toast.info(message);
      }
    }
  };

  componentWillMount = () => {
    document.addEventListener('mousedown', this.handleClick, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
  };

  handleClick = (event) => {
    if (this.node && !this.node.contains(event.target)) {
      this.closeMenu();
    }
  };

  closeMenu = () => {
    this.setState({ settingsVisible: false });
  };

  toggleSettings = () => {
    this.setState({ settingsVisible: !this.state.settingsVisible });
  };

  render() {
    return (
      <>
        <div className={[styles.topbar, this.props.token ? null : styles.hidden].join(' ')}>
          <div className={styles.leftTopbar} />

          <div className={styles.middleTopbar} id="customTopbar" />

          <div className={styles.rightTopbar}>
            <Button
              className={styles.iconBtn}
              title="View notifications"
              onClick={() => {}}
              disabled={false}
              status="transparent"
            >
              <NotificationIcon className={styles.icon} />
            </Button>

            <span className={styles.refNode} ref={(node) => (this.node = node)}>
              <Button className={styles.iconBtn} title="Settings" onClick={this.toggleSettings} status="transparent">
                <GearIcon className={styles.icon} />
                {this.state.settingsVisible && (
                  <div className={styles.settingsDropdown}>
                    <div className={styles.menuButton} title="Edit view" onClick={() => {}}>
                      Edit view
                    </div>
                    <div
                      className={styles.menuButton}
                      title="New view"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      Create new View
                    </div>
                    <span className={styles.divider} />
                    <div className={styles.menuButton} title="Logout" onClick={this.props.logout}>
                      Logout
                    </div>
                  </div>
                )}
              </Button>
            </span>
          </div>
        </div>
        <div className={styles.contentWrapper}>{this.props.children}</div>

        <ToastContainer position={toast.POSITION.BOTTOM_CENTER} transition={Slide} hideProgressBar />
      </>
    );
  }
}
