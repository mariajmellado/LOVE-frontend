import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './EventLog.module.css';
import { formatTimestamp, getStringRegExp } from '../../Utils';
import InfoIcon from '../icons/InfoIcon/InfoIcon';
import WarningIcon from '../icons/WarningIcon/WarningIcon';
import ErrorIcon from '../icons/ErrorIcon/ErrorIcon';
import { CardList, Card, Title, Separator } from '../GeneralPurpose/CardList/CardList';
import TextField from '../TextField/TextField';

export default class EventLog extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    subscribeToStream: PropTypes.func,
    unsubscribeToStream: PropTypes.func,
    errorCodeData: PropTypes.array,
    embedded: PropTypes.bool,
    cscList: PropTypes.array,
  };

  static defaultProps = {
    name: '',
    group: '',
    data: {},
    onCSCClick: () => 0,
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    errorCodeData: [],
    embedded: false,
  };

  constructor(props) {
    super(props);

    const messageFilters = {
      10: { value: true, name: 'Debug' },
      20: { value: true, name: 'Info' },
      30: { value: true, name: 'Warning' },
      40: { value: true, name: 'Error' },
    };
    const typeFilters = {
      error: { value: true, name: 'Error code' },
      log: { value: true, name: 'Log message' },
    };
    this.state = {
      cscFilter: '',
      cscRegExp: getStringRegExp(''),
      messageFilters,
      typeFilters,
      eventData: [],
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams(this.props.cscList);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams(this.props.cscList);
  };

  clearGroupErrorCodes = () => {
    //   this.props.cscList.forEach(({ name, salindex }) => {
    //     this.props.clearCSCErrorCodes(name, salindex);
    //   });
  };

  changeCSCFilter = (event) => {
    this.setState({
      cscFilter: event.target.value,
      cscRegExp: getStringRegExp(event.target.value),
    });
  };

  updateMessageFilters = (key, value) => {
    const filters = this.state.messageFilters;
    filters[key].value = value;
    this.setState({
      messageFilters: { ...filters },
    });
  };

  updateTypeFilters = (key, value) => {
    const filters = this.state.typeFilters;
    filters[key].value = value;
    this.setState({
      typeFilters: { ...filters },
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.eventData?.length === 0 ||
      JSON.stringify(this.props.logMessageData) !== JSON.stringify(prevProps.logMessageData) ||
      JSON.stringify(this.props.errorCodeData) !== JSON.stringify(prevProps.errorCodeData)
    ) {
      const eventData = [...this.props.logMessageData, ...this.props.errorCodeData];
      eventData.sort((a, b) => (a?.private_rcvStamp?.value > b?.private_rcvStamp?.value ? -1 : 1));
      if (eventData.length !== 0) {
        this.setState({
          eventData,
        });
      }
    }
  };

  renderErrorMessage = (msg, index) => {
    const cscKey = `${msg.csc}.${msg.salindex}`;
    const filterResult = this.state.cscFilter === '' || this.state.cscRegExp.test(cscKey);
    return (
      filterResult && (
        <Card key={`${msg.private_rcvStamp.value}-${index}`} className={styles.card}>
          <div className={styles.messageTextContainer}>
            <div className={styles.messageTopSection}>
              <div className={styles.cardTitleContainer}>
                <span className={styles.highlight}>{cscKey}</span>
                <span className={styles.cardTitleContainer}>
                  <span>{' - '} Error code </span>
                  <span className={styles.highlight}> {msg.errorCode.value}</span>
                </span>
              </div>

              <div className={styles.timestamp} title="private_rcvStamp">
                {formatTimestamp(msg.private_rcvStamp.value * 1000)}
              </div>
            </div>

            <Separator className={styles.innerSeparator} />
            <div className={styles.messageText}>{msg.errorReport.value}</div>
            <div className={styles.messageTraceback}>{msg.traceback.value}</div>
          </div>
        </Card>
      )
    );
  };

  renderLogMessage = (msg, index) => {
    const cscKey = `${msg.csc}.${msg.salindex}`;
    const filterResult = this.state.cscFilter === '' || this.state.cscRegExp.test(cscKey);
    let icon = <span title="Debug">d</span>;
    const { value } = msg?.level;
    if (value === 20) icon = <InfoIcon title="Info" />;
    if (value === 30) icon = <WarningIcon title="Warning" />;
    if (value === 40) icon = <ErrorIcon title="Error" />;

    return (
      filterResult &&
      this.state.messageFilters[value]?.value && (
        <Card key={`${msg.private_rcvStamp.value}-${msg.level.value}-${index}`} className={styles.card}>
          <div className={styles.messageTextContainer}>
            <div className={styles.messageTopSection}>
              <div className={styles.cardTitleContainer}>
                <span className={styles.highlight}>{cscKey}</span>
                <span className={styles.cardTitleContainer}>
                  <span>{' - '}</span>
                  <span className={styles.iconWrapper}>{icon}</span>
                  <span> {icon.props.title} log message</span>
                </span>
              </div>

              <div className={styles.timestamp} title="private_rcvStamp">
                {formatTimestamp(msg.private_rcvStamp.value * 1000)}
              </div>
            </div>
            <Separator className={styles.innerSeparator} />
            <div className={styles.messageText}>{msg.message.value}</div>
            <div className={styles.messageTraceback}>{msg.traceback.value}</div>
          </div>
        </Card>
      )
    );
  };

  render() {
    return (
      <div className={styles.CSCGroupLogContainer}>
        <CardList className={styles.cardList}>
          <Title className={styles.title}>Filters</Title>
          <div className={styles.filters}>
            <div className={styles.filter}>
              <span className={styles.filterLabel}>By CSC: </span>
              <TextField type="text" value={this.state.cscFilter} onChange={this.changeCSCFilter} />
            </div>

            <div className={styles.filter}>
              <span className={styles.filterLabel}>By type: </span>
              <div className={styles.filtersContainer}>
                {Object.keys(this.state.typeFilters).map((key) => {
                  return (
                    <div key={key}>
                      <label>
                        <input
                          onChange={(event) => this.updateTypeFilters(key, event.target.checked)}
                          type="checkbox"
                          alt={`select ${key}`}
                          checked={this.state.typeFilters[key].value}
                        />
                        <span>{this.state.typeFilters[key].name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.filter}>
              <span className={styles.filterLabel}>By log level: </span>
              <div className={styles.filtersContainer}>
                {Object.keys(this.state.messageFilters).map((key) => {
                  return (
                    <div key={key}>
                      <label>
                        <input
                          onChange={(event) => this.updateMessageFilters(key, event.target.checked)}
                          type="checkbox"
                          alt={`select ${key}`}
                          checked={this.state.messageFilters[key].value}
                        />
                        <span>{this.state.messageFilters[key].name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Separator className={styles.separator} />

          {this.state.eventData.map((msg, index) => {
            return msg.errorCode !== undefined
              ? this.state.typeFilters.error.value && this.renderErrorMessage(msg, index)
              : this.state.typeFilters.log.value && this.renderLogMessage(msg, index);
          })}
        </CardList>
      </div>
    );
  }
}
