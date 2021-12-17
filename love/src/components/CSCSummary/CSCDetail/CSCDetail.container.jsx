import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getStreamData, getCSCHeartbeat, getCSCWithWarning } from 'redux/selectors';
import CSCDetail from './CSCDetail';

export const schema = {
  description: 'Displays the error code and message logs for a single CSC',
  defaultSize: [8, 2],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CSC details',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: false,
    },
    name: {
      type: 'string',
      description: 'Name of the CSC to monitor',
      isPrivate: false,
      default: 'Test',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the CSC',
      isPrivate: false,
      default: 1,
    },
    hasHeartbeat: {
      type: 'boolean',
      description: 'Whether the CSC produces heartbeat',
      isPrivate: false,
      default: true,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
    _functionProps: {
      type: 'array',
      description: 'Array containing the props that are functions',
      isPrivate: true,
      default: [],
    },
  },
};

const CSCDetailContainer = ({
  group,
  name,
  salindex,
  hasHeartbeat,
  summaryStateData,
  onCSCClick,
  subscribeToStreams,
  unsubscribeToStreams,
  heartbeatData,
  embedded,
  withWarning,
}) => {
  return (
    <CSCDetail
      group={group}
      name={name}
      salindex={salindex}
      hasHeartbeat={hasHeartbeat}
      summaryStateData={summaryStateData}
      onCSCClick={onCSCClick}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      heartbeatData={heartbeatData}
      embedded={embedded}
      withWarning={withWarning}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (cscName, index) => {
      dispatch(addGroup('event-Heartbeat-0-stream'));
      dispatch(addGroup(`event-${cscName}-${index}-summaryState`));
      dispatch(addGroup(`event-${cscName}-${index}-logMessage`));
      dispatch(addGroup(`event-${cscName}-${index}-errorCode`));
    },
    unsubscribeToStreams: (cscName, index) => {
      dispatch(removeGroup('event-Heartbeat-0-stream'));
      dispatch(removeGroup(`event-${cscName}-${index}-summaryState`));
      dispatch(removeGroup(`event-${cscName}-${index}-logMessage`));
      dispatch(removeGroup(`event-${cscName}-${index}-errorCode`));
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const withWarning = getCSCWithWarning(state, ownProps.name, ownProps.salindex);
  let summaryStateData = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-summaryState`);
  let heartbeatData = getCSCHeartbeat(state, ownProps.name, ownProps.salindex);
  if (!summaryStateData) {
    summaryStateData = {};
  }

  return {
    summaryStateData: summaryStateData[0],
    heartbeatData,
    withWarning,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CSCDetailContainer);
