import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup, requestSALCommand } from 'redux/actions/ws';
import {
  getScriptQueueState,
  getScriptHeartbeats,
  getSummaryStateValue,
  getPermCmdExec,
  getLastSALCommand,
  getUsername,
  getAuthlistState,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ScriptQueue from './ScriptQueue';

export const schema = {
  description: `Component containing information about the scripts currently running, scripts to be run (in queue) and past scripts.
                Allows commands to be sent for interacting with the scripts, such as stopping, enqueueing and requeueing scripts`,
  defaultSize: [66, 38],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Script queue',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the ScriptQueue',
      isPrivate: false,
      default: 1,
    },
  },
};

const ScriptQueueContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  requestSALCommand,
  summaryStateValue,
  queueState,
  scriptHeartbeats,
  commandExecutePermission,
  lastSALCommand,
  username,
  salindex,
  fit,
  embedded,
  authlist,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <ScriptQueue
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      requestSALCommand={requestSALCommand}
      summaryStateValue={summaryStateValue}
      current={queueState.current}
      finishedScriptList={queueState.finishedScriptList}
      availableScriptList={queueState.availableScriptList}
      waitingScriptList={queueState.waitingScriptList}
      state={queueState.state}
      heartbeats={scriptHeartbeats}
      commandExecutePermission={commandExecutePermission}
      lastSALCommand={lastSALCommand}
      username={username}
      salindex={salindex}
      fit={fit}
      embedded={embedded}
      running={queueState.running}
      authlist={authlist}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const queueState = getScriptQueueState(state, ownProps.salindex);
  const scriptHeartbeats = getScriptHeartbeats(state, ownProps.salindex);
  const summaryStateValue = getSummaryStateValue(state, `event-ScriptQueue-${ownProps.salindex}-summaryState`);
  const commandExecutePermission = getPermCmdExec(state);
  const lastSALCommand = getLastSALCommand(state);
  const username = getUsername(state);
  const authlist = getAuthlistState(state, [`event-ScriptQueue-${ownProps.salindex}-authList`]);
  return {
    queueState,
    scriptHeartbeats,
    summaryStateValue,
    commandExecutePermission,
    lastSALCommand,
    username,
    authlist,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `event-ScriptQueueState-${ownProps.salindex}-stream`,
    `event-ScriptQueue-${ownProps.salindex}-summaryState`,
    `event-ScriptHeartbeats-${ownProps.salindex}-stream`,
    `event-ScriptQueue-${ownProps.salindex}-authList`,
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
    requestSALCommand: (cmd) => {
      if (cmd.csc === 'Script') {
        return dispatch(requestSALCommand({ ...cmd, component: 'Script', salindex: 0 }));
      }
      return dispatch(requestSALCommand({ ...cmd, component: 'ScriptQueue', salindex: ownProps.salindex }));
    },
  };
};
const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(ScriptQueueContainer);

connectedContainer.defaultProps = {
  salindex: 1,
};

export default connectedContainer;
