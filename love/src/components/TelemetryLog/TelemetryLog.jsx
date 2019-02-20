import React, { Component } from 'react';
import ManagerInterface from '../../Utils';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

export default class TelemetryLog extends Component {
  constructor(props) {
    super();
    this.state = {
      msg: '',
      msgList: [],
      msgNumber: 0,
      category: props.category,
      csc: props.csc,
      stream: props.stream,
    };
    this.managerInterface = new ManagerInterface();
  }

  receiveMessage = (msg) => {
    this.setState({
      msg: msg.data,
    });
    this.updateMessageList(msg.data);
  };

  updateMessageList = (msg) => {
    let newMsgList = this.state.msgList;
    if (this.state.msgList.length > 10) {
      newMsgList.shift();
      this.setState({
        msgList: [...newMsgList, msg],
        msgNumber: this.state.msgNumber + 1,
      });
    } else {
      this.setState({
        msgList: [...this.state.msgList, msg],
        msgNumber: this.state.msgNumber + 1,
      });
    }
  };

  categoryChange = (e) => {
    this.setState({
      category: e.target.value,
    });
  };

  cscChange = (e) => {
    this.setState({
      csc: e.target.value,
    });
  };

  streamChange = (e) => {
    this.setState({
      stream: e.target.value,
    });
  };

  subscribeToStream = () => {
    this.managerInterface.subscribeToStream(
      this.state.category,
      this.state.csc,
      this.state.stream,
      this.receiveMessage,
    );
  };

  unsubscribeToStream = () => {
    this.managerInterface.unsubscribeToStream(
      this.state.category,
      this.state.csc,
      this.state.stream,
      this.receiveMessage,
    );
  };

  render() {
    return (
      <div style={{ textAlign: 'left' }}>
        <h1>Telemetry log</h1>
        <div>
          <div>
            <span>Category </span>
            <input onChange={this.categoryChange} value={this.state.category} />
          </div>
          <div>
            <span>CSC </span>
            <input onChange={this.cscChange} value={this.state.csc} />
          </div>
          <div>
            <span>Stream </span>
            <input onChange={this.streamChange} value={this.state.stream} />
          </div>
          <button onClick={this.subscribeToStream}>Subscribe</button>
          <button onClick={this.unsubscribeToStream}>Unsubscribe</button>
        </div>

        {this.state.msgList
          .slice()
          .reverse()
          .map((msg, index) => {
            return <JSONPretty key={this.state.msgNumber - index} data={msg} />;
          })}
      </div>
    );
  }
}
