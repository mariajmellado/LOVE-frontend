import React from 'react';
import { connect } from 'react-redux';
import { addGroup, requestGroupRemoval } from '../../../redux/actions/ws';
import { getStreamsData } from '../../../redux/selectors/selectors.js';
import VegaTimeSeriesPlot from './VegaTimeSeriesPlot';
import VegaLegend from './VegaLegend';
import { parseTimestamp } from '../../../Utils';
import moment from 'moment';

export const schema = {
  description: 'vega plot',
  defaultSize: [8, 8],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Time series plot',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
    inputs: {
      type: 'array',
      description: 'lits of inputs',
      isPrivate: false,
      default: {
        Elevation: {
          category: 'telemetry',
          csc: 'ATMCS',
          salindex: '0',
          topic: 'mount_AzEl_Encoders',
          item: 'elevationCalculatedAngle',
          type: 'line',
          accessor: (x) => x[0],
        },
        'ATDome azimuth': {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: '0',
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
    },
    // _functionProps: {
    //   type: 'array',
    //   description: 'Array containing the props that are functions',
    //   isPrivate: true,
    //   default: ['subscriptions'],
  },
};

const defaultStyles = [
  {
    color: '#ff7bb5',
    shape: 'circle',
    filled: false,
    dash: [4, 0],
  },
  {
    color: '#00b7ff',
    shape: 'square',
    filled: true,
    dash: [4, 0],
  },

  {
    color: '#97e54f',
    shape: 'diamond',
    filled: true,
    dash: [4, 0],
  },
];

const VegaTimeSeriesPlotContainer = function ({
  subscriptions = schema.props.subscriptions.default,
  inputs = schema.props.inputs.default,
  streams,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) {
  const startDate = moment().subtract(2, 'year').startOf('day');
  const [data, setData] = React.useState({});

  let index = -1;
  const marksStyles = React.useMemo(() => {
    return Object.keys(inputs).map((input) => {
      index++;
      return {
        name: input,
        ...defaultStyles[index % defaultStyles.length],
      };
    });
  }, [inputs]);

  React.useEffect(() => {
    subscribeToStreams();
  }, []);

  React.useEffect(() => {
    const data = {};
    for (const key of Object.keys(inputs)) {
      data[key] = [];
    }
    setData(data);
  }, [inputs]);

  React.useEffect(() => {
    let changed = false;
    if (data === {}) {
      return;
    }
    for (const [input, inputConfig] of Object.entries(inputs)) {
      const { category, csc, salindex, topic, item, type, accessor } = inputConfig;
      const inputData = data[input] || [];
      const lastValue = inputData[inputData.length - 1];
      const streamName = `${category}-${csc}-${salindex}-${topic}`;
      if (!streams[streamName] || !streams[streamName]?.[item]) {
        continue;
      }
      const streamValue = Array.isArray(streams[streamName]) ? streams[streamName][0] : streams[streamName];
      const newValue = {
        name: input,
        x: parseTimestamp(streamValue.private_rcvStamp?.value),
        y: accessor(streamValue[item]?.value),
      };
      if ((!lastValue || lastValue.x?.ts !== newValue.x?.ts) && newValue.x) {
        changed = true;
        inputData.push(newValue);
      }
      if (inputData.length > 100) {
        changed = true;
        inputData.slice(-100);
      }
      data[input] = inputData;
    }
    if (changed) {
      setData(data);
    }
  }, [inputs, streams]);

  const layers = { lines: [], bars: [], pointLines: [] };
  for (const [input, inputData] of Object.entries(data)) {
    const { type } = inputs[input];
    const typeStr = type + 's';
    if (!typeStr in layers) {
      continue;
    }
    layers[typeStr] = layers[typeStr].concat(inputData);
  }

  // console.log('-----------------');
  // console.log('inputs: ', inputs);
  // console.log('marksStyles: ', marksStyles);
  // console.log('streams: ', streams);
  // console.log('data: ', data);
  // console.log('layers: ', layers);

  return (
    <div>
      <div style={{ width: '500px', height: '200px' }}>
        <VegaTimeSeriesPlot
          layers={layers}
          marksStyles={marksStyles}
          units={{ y: 'deg' }}
          yAxisTitle={'Telementry'}
          xAxisTitle={'Time ago'}
          temporalXAxis={true}
          skipPointsEvery={1}
        />
      </div>
      <div style={{ width: '500px', height: '100px' }}>
        <VegaLegend marksStyles={marksStyles} />
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
  const groupNames = Object.keys(subscriptions);

  const streams = getStreamsData(state, groupNames);
  return {
    streams,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
      const groupNames = Object.keys(subscriptions);
      console.log('groupNames', groupNames);
      groupNames.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: () => {
      const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
      const groupNames = Object.keys(subscriptions);
      groupNames.forEach((groupName) => {
        dispatch(requestGroupRemoval(groupName));
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VegaTimeSeriesPlotContainer);
