import { RECEIVE_GROUP_SUBSCRIPTION_DATA, ADD_GROUP_SUBSCRIPTION, CHANGE_WS_STATE } from '../actions/actionTypes';
import ManagerInterface, { sockette } from '../../Utils';

export const connectionStates = {
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  ERROR: 'ERROR',
};

let socket, wsPromise;

const changeWebsocketConnectionState = (connectionState) => ({
  type: CHANGE_WS_STATE,
  connectionState,
});

const receiveGroupSubscriptionData = (data) => {
  return {
    type: RECEIVE_GROUP_SUBSCRIPTION_DATA,
    data: data.data,
    category: data.category,
    csc: Object.keys(data.data)[0],
  };
};

/**
 * Opens a new websocket connection assuming:
 * - authentication with backend went ok
 * - it does not matter if it was or was not connected before
 */
export const openWebsocketConnection = () => {
  const token = ManagerInterface.getToken();

  const connectionPath = ManagerInterface.getWebsocketsUrl() + token;

  return (dispatch, getState) => {
    changeWebsocketConnectionState(connectionStates.OPENING);

    wsPromise = new Promise((resolve) => {
      socket = sockette(connectionPath, {
        onopen: () => {
          dispatch(changeWebsocketConnectionState(connectionStates.OPEN));
          resolve();
        },
        onmessage: (msg) => {
          if (!msg.data) return;

          const data = JSON.parse(msg.data);
          if (data.category) {
            dispatch(receiveGroupSubscriptionData(data));
          }
        },
        onclose: () => {
          dispatch(changeWebsocketConnectionState(connectionStates.CLOSED));
        },
        onerror: () => {
          dispatch(changeWebsocketConnectionState(connectionStates.ERROR));
          resolve();
        },
      });
    });
  };
};

export const addGroupSubscription = (groupName) => ({
  type: ADD_GROUP_SUBSCRIPTION,
  groupName,
});

export const requestGroupSubscription = (groupName) => {
  return (dispatch, getState) => {
    if (!wsPromise) {
      dispatch(openWebsocketConnection());
      return;
    }

    const [category, csc, stream] = groupName.split('-');
    wsPromise.then(() => {
      const state = getState();
      if (state.ws.connectionState !== connectionStates.OPEN) {
        console.warn(`Can not subscribe to ${groupName}, websocket connection status is: ${state.ws.connectionState}`);
      }

      socket.json({
        option: 'subscribe',
        category,
        csc,
        stream,
      });
      dispatch(addGroupSubscription(groupName));
    });
  };
};
