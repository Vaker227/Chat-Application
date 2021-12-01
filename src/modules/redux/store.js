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
    createReminderModal: false,
    detailReminder: null, // reminder obj
  },

  channels: {
    list: [],
    currentHistory: [],
  },
  notifications: {
    list: [],
  },
  privateConnection: {
    isReceivingRequest: false,
    exchangingTarget: null,
    isRequesting: false,
    requestingTarget: null,
    type: "", // vcall, voice
    isConnected: false,
    video: false,
    mic: false,
  },
  status: {
    loadHistory: false,
    toServer: false,
    toPeer: false,
    checkingNAT: false,
    natType: "checking", // normal, symmetric
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
    case "TOGGLE_CREATE_REMINDER_MODAL":
      return Object.assign({}, state, {
        createReminderModal: action.data,
      });
    case "TOGGLE_DETAIL_REMINDER_MODAL":
      return Object.assign({}, state, {
        detailReminder: action.data,
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
    case "UPDATE_MEMBERS":
      const newListMembers = state.list.slice().map((channel) => {
        if (channel._id == action.data.channelId) {
          channel.participants = action.data.participants;
          channel.detailParticipants = [];
          return channel;
        }
        return channel;
      });
      return Object.assign({}, state, { list: newListMembers });
    case "STORE_MEMBERS":
      const newListDetailMembers = state.list.slice().map((channel) => {
        if (channel._id == action.data.channelId) {
          channel.detailParticipants = action.data.participants;
          return channel;
        }
        return channel;
      });
      return Object.assign({}, state, { list: newListDetailMembers });
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
    case "CLEAR_CURRENT_HISTORY":
      return Object.assign({}, state, {
        currentHistory: [],
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
        exchangingTarget: action.data.sendTo,
        type: action.data.type,
      });
    case "END_REQUESTING_PRIVATE_CONNECTION":
      return Object.assign(
        {},
        state,
        {
          isRequesting: false,
        },
        action.data == "success"
          ? { isConnected: true }
          : { exchangingTarget: null, type: null }
      );
    case "RECEIVING_REQUEST":
      return Object.assign({}, state, {
        isReceivingRequest: true,
        exchangingTarget: action.data.sendBy,
        type: action.data.type,
      });
    case "END_RECEIVING_REQUEST":
      return Object.assign(
        {},
        state,
        {
          isReceivingRequest: false,
        },
        action.data == "accept"
          ? { isConnected: true }
          : { exchangingTarget: null, type: null }
      );
    case "DISCONNECT_PRIVATE_CONNECTION":
      return Object.assign({}, state, {
        exchangingTarget: null,
        type: null,
        isConnected: false,
      });
    case "TOGGLE_CALL_VIDEO":
      return Object.assign({}, state, {
        video: action.data,
      });
    case "TOGGLE_CALL_MIC":
      return Object.assign({}, state, {
        mic: action.data,
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
  webRTC: webRTCReducer,
});
const store = redux.createStore(
  combinedReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

module.exports = store;
