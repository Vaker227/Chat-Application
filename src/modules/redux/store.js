const redux = require("redux");
const _ = require("lodash");

let defaultData = {
  name: "DefaultName",
};
// if (window.electron) {
//   const temp = window.electron.getDefaultData();
//   Object.assign(defaultData, temp);
// }

const defaultState = {
  user: {
    //...
    channels: [],
    notification: [],
  },
  view: {
    menu: "converstation", // converstation, list-friend
    content: "default", // id channel
    searchModal: false,
  },

  channels: {
    list: [],
    currentHistory: [],
  },
  notifications: {
    list: [],
  },
  privateConnection: {
    roomID: null,
    targetID: null,
    targetData: {},
    isReceivingRequest: false,
    isRequesting: false,
    requestingTarget: null,
    lastRequestResult: null,
    historyLog: [], // message data {text, time, user}
  },
  status: {
    loadHistory: false,
    toServer: false,
    toPeer: false,
    checkingNAT: false,
    natType: "checking", // normal, symmetric
  },
  fileManager: {
    list: [], // file type {name, size, modified(milisecond),id ,
    // origin ,state (waiting, downloading,stopped , reject, completed), percent(downloading) }
    haveNoti: false,
  },
  webRTC: {
    status: "idle", //idle, new , checking, connected, completed , fail
    configType: "stun", //stun, turn
  },
};
const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "STORE_INFO":
      return Object.assign({}, state, action.data);
    case "STORE_FRIENDS":
      return Object.assign({}, state, { friends: action.data });

    case "LOAD_NOTIFICATION":
      const result = action.data.map((noti) => {
        return { detail: noti.detail._id, isSeen: noti.isSeen };
      });
      return Object.assign({}, state, { notification: result });
    case "UPDATE_LASTEST_CHANNEL_LIST":
      return Object.assign({}, state, { channels: action.data });
    case "DISCONNECT_FROM_SERVER":
      return Object.assign({}, state, {
        ip: null,
        port: null,
        socketID: null,
      });
    case "UPDATE_SOCKETID":
      return Object.assign({}, state, {
        socketID: action.data,
      });
    default:
      return state;
  }
};
const viewReducer = (state = {}, action) => {
  switch (action.type) {
    case "STORE_CHANNELS":
      const content = action.data[0] ? action.data[0]._id : "default";
      return Object.assign({}, state, {
        content,
      });
    case "CHANGE_MENU":
      return Object.assign({}, state, {
        menu: action.data,
      });
    case "CHANGE_CHANNEL":
      return Object.assign({}, state, {
        content: action.data,
      });
    case "TOGGLE_SEARCH_MODAL":
      return Object.assign({}, state, {
        searchModal: action.data,
      });
    default:
      return state;
  }
};
const channelsReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_CURRENT_HISTORY":
      const messages = state.list.find(
        (ele) => ele._id == action.data
      ).messages;
      return Object.assign({}, state, {
        currentHistory: messages,
      });
    case "STORE_MEMBERS":
      const newListMembers = state.list.slice().map((channel) => {
        if (channel._id == action.data.channelId) {
          channel.detailParticipants = action.data.participants;
          return channel;
        }
        return channel;
      });
      return Object.assign({}, state, { list: newListMembers });
    case "STORE_CHANNELS":
      return Object.assign({}, state, {
        list: action.data,
      });
    case "UPDATE_MESSAGE":
      const newObj = {};
      const newList = state.list.map((channel) => {
        if (channel._id == action.data.channelId) {
          channel.messages.unshift(...action.data.messages);
          channel.messages = _.uniqBy(channel.messages, (message) => {
            return message.time;
          });
          channel.messages.sort((a, b) => {
            if (a.time > b.time) {
              return -1;
            }
            return 1;
          });
        }
        return channel;
      });
      newObj.list = newList;
      if (action.data.andCurrent) {
        const channelM = state.currentHistory.slice();
        channelM.unshift(...action.data.messages);
        newObj.currentHistory = _.uniqBy(channelM, (message) => {
          return message.time;
        });
        newObj.currentHistory.sort((a, b) => {
          if (a.time > b.time) {
            return -1;
          }
          return 1;
        });
      }
      return Object.assign({}, state, newObj);
    case "LOAD_OLD_MESSAGE":
      const channelM = state.currentHistory.slice();
      channelM.push(...action.data.messages);
      const result = _.uniqBy(channelM, (message) => {
        return message.time;
      });
      result.sort((a, b) => {
        if (a.time > b.time) {
          return -1;
        }
        return 1;
      });

      return Object.assign({}, state, {
        currentHistory: result,
      });
    default:
      return state;
  }
};
const notificationsReducer = (state = {}, action) => {
  switch (action.type) {
    case "REMOVE_NOTI":
      const removedList = state.list.filter((noti) => {
        return noti.detail._id != action.data;
      });
      return Object.assign({}, state, { list: removedList });
    case "LOAD_NOTIFICATION":
      const notis = state.list ? state.list.slice() : [];
      notis.push(...action.data);
      const result = _.uniqBy(notis, (noti) => {
        return noti.detail._id;
      });
      result.sort((a, b) => {
        if (a.detail.time > b.detail.time) {
          return -1;
        }
        return 1;
      });
      return Object.assign({}, state, { list: result });

    default:
      return state;
  }
};

const privateConnectionReducer = (state = {}, action) => {
  switch (action.type) {
    case "REQUESTING_PRIVATE_CONNECTION":
      return Object.assign({}, state, {
        isRequesting: true,
        requestingTarget: action.data,
      });
    case "END_REQUESTING_PRIVATE_CONNECTION":
      return Object.assign({}, state, {
        isRequesting: false,
        requestingTarget: null,
        lastRequestResult: action.data,
      });
    case "RECEIVING_REQUEST":
      return Object.assign({}, state, {
        isReceivingRequest: true,
        targetID: action.data,
      });
    case "END_RECEIVING_REQUEST":
      return Object.assign({}, state, {
        isReceivingRequest: false,
        targetID: action.data ? state.targetID : null,
      });
    case "CONNECT_TO_SERVER":
      return Object.assign({}, state, {
        historyLog: [...state.historyLog, action.data],
      });
    case "DISCONNECT_FROM_SERVER":
      return Object.assign({}, state, {
        historyLog: [...state.historyLog, action.data],
      });
    case "CONNECT_PRIVATE_CONNECTION":
      return Object.assign({}, state, {
        roomID: action.data.roomID,
        targetID: action.data.targetID,
        historyLog: [...state.historyLog, action.data.message],
      });
    case "DISCONNECT_PRIVATE_CONNECTION":
      const newHistoryLog = action.data
        ? [...state.historyLog, action.data]
        : [...state.historyLog];
      return Object.assign({}, state, {
        roomID: null,
        targetID: null,
        targetData: null,
        historyLog: newHistoryLog,
        lastRequestResult: "online",
      });
    case "UPDATE_TARGET_DATA":
      return Object.assign({}, state, {
        targetData: action.data,
      });
    case "UPDATE_HISTORY_LOG":
      return Object.assign({}, state, {
        historyLog: [...state.historyLog, action.data],
      });
    default:
      return state;
  }
};
const statusReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_LOAD_HISTORY":
      return Object.assign({}, state, {
        loadHistory: action.data,
      });
    case "CHECKING_NAT":
      return Object.assign({}, state, {
        checkingNAT: action.data,
      });
    case "SET_NAT_TYPE":
      return Object.assign({}, state, {
        natType: action.data,
      });
    case "CONNECT_TO_SERVER":
      return Object.assign({}, state, {
        toServer: true,
      });
    case "DISCONNECT_FROM_SERVER":
      return Object.assign({}, state, {
        toServer: false,
        toPeer: false,
      });
    case "CONNECT_PRIVATE_CONNECTION":
      return Object.assign({}, state, {
        toPeer: true,
      });
    case "DISCONNECT_PRIVATE_CONNECTION":
      return Object.assign({}, state, {
        toPeer: false,
      });
    default:
      return state;
  }
};

const fileManagerReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_FILE_LIST":
      return Object.assign({}, state, {
        list: [...state.list, action.data],
        haveNoti: true,
      });
    case "REMOVE_FILE_LIST":
      const newListRemove = state.list.filter((file) => {
        return file.id != action.data;
      });
      return Object.assign({}, state, { list: newListRemove, haveNoti: true });
    case "UPDATE_STATE_FILE":
      // action.data: {state(downloading, reject, completed) ,id}
      const newListUpdate = state.list.map((fileInfo) => {
        if (fileInfo.id == action.data.id) {
          return Object.assign({}, fileInfo, {
            state: action.data.state,
            path: action.data.path,
          });
        }
        return fileInfo;
      });
      return Object.assign({}, state, { list: newListUpdate, haveNoti: true });
    case "UPDATE_DOWNLOAD_PROGRESS":
      // action.data: {percent ,id}
      const newListProgress = state.list.map((fileInfo) => {
        if (fileInfo.id == action.data.id) {
          return Object.assign({}, fileInfo, { percent: action.data.percent });
        }
        return fileInfo;
      });
      return Object.assign({}, state, { list: newListProgress });
    case "REMOVE_NOTI":
      return Object.assign({}, state, { haveNoti: false });
    default:
      return state;
  }
};
const webRTCReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_WEBRTC_STATUS":
      return Object.assign({}, state, { status: action.data });
    case "SET_WEBRTC_CONFIG":
      return Object.assign({}, state, { configType: action.data });

    default:
      return state;
  }
};

const combinedReducer = redux.combineReducers({
  user: userReducer,
  view: viewReducer,
  channels: channelsReducer,
  notifications: notificationsReducer,
  status: statusReducer,
  privateConnection: privateConnectionReducer,
  fileManager: fileManagerReducer,
  webRTC: webRTCReducer,
});
const store = redux.createStore(
  combinedReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

module.exports = store;
