import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import ComponentIndex from './components/ComponentIndex/ComponentIndex';
import HealthStatusSummary from './components/HealthStatusSummary/HealthStatusSummary';
import DataManagementFlow from './components/DataManagementFlow/DataManagementFlow';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import TimeSeries from './components/TimeSeries/TimeSeries';

import ManagerInterface from './Utils';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';

class App extends Component {
  constructor() {
    super();
    this.state = {
      telemetries: {
        scheduler: {
          interestedProposal: {
            parameters: {},
            receptionTimeStamp: '2018/11/23 21:12:24.',
          },
          bulkCloud: {
            parameters: {
              bulkCloud: {
                value: 0.6713680575252166,
                dataType: 'Float',
              },
              timestamp: {
                value: 0.5309269973966433,
                dataType: 'Float',
              },
            },
            receptionTimeStamp: '2018/11/25 12:21:12',
          },
        },
        ScriptQueue: {
          stream1: {
            parameters: {
              exists: {
                value: 1,
                dataType: 'Boolean',
              },
            },
          },
        },
      },
    };
    this.managerInterface = new ManagerInterface();
    this.managerInterface.subscribeToTelemetry('all', 'all', this.receiveAllMsg);
  }

  receiveAllMsg = (msg) => {
    const data = JSON.parse(msg.data);

    if (typeof data.data === 'object') {
      let newTelemetries = Object.assign({}, this.state.telemetries);
      let timestamp = new Date();
      timestamp = timestamp
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, '/')
        .replace('T', ' ');
      Object.entries(data.data).forEach((entry) => {
        const [csc, cscDataString] = entry;
        const cscData = JSON.parse(cscDataString);
        const telemetry = {};
        const stream = {};
        Object.entries(cscData).forEach((cscStream) => {
          const [streamName, parameters] = cscStream;
          stream[streamName] = {};
          stream[streamName].parameters = parameters;
          stream[streamName].receptionTimestamp = timestamp;
        });
        telemetry[csc] = {
          ...stream,
        };
        Object.assign(newTelemetries, telemetry);
      }, this);

      newTelemetries = JSON.parse(JSON.stringify(newTelemetries));
      this.setState({ telemetries: newTelemetries });
      this.managerInterface.unsubscribeToTelemetry('all', 'all', () => 0);
    }
  };

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login} />
            <PrivateRoute
              path="/health-status-summary"
              render={() => (
                <div className="hs-container">
                  <HealthStatusSummary telemetries={this.state.telemetries}> </HealthStatusSummary>
                </div>
              )}
            />
            <PrivateRoute path="/dm-flow" component={DataManagementFlow} />
            <PrivateRoute
              path="/time-series"
              render={() => (
                <div className="hs-container">
                  <TimeSeries telemetries={this.state.telemetries}> </TimeSeries>
                </div>
              )}
            />
            <Route path="/test" render={() => (
                <div className="hs-container">
                  <TelemetryLog category="event" csc="ScriptQueue" stream="all"> </TelemetryLog>
                </div>
              )}
            />
            <PrivateRoute path="/" component={ComponentIndex} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
