const { io } = require("socket.io-client");
const store = require("../../redux/store");

const { getPublicIP } = require("../services/client.service");
const helper = require("../../helper");
const webRTC = require("../services/webrtc.service");
const ChannelServices = require("./channel.service");
const UserServices = require("./user.service");

let socket;

module.exports.connect = function (id) {
  // socket = io("https://file-transfers.herokuapp.com/");
  socket = io(helper.getURL());
  socket.on("connect", () => {
    socket.emit("init-connection", store.getState().user._id);
  });
  socket.on("update-clients-list", (clients) => {
    if (clients) {
      store.dispatch({ type: "UPDATE_CLIENTS_LIST", data: clients });
    }
  });
  socket.on("have-new-messages", (options) => {
    ChannelServices.updateMessage(options.channelId);
  });
  socket.on("have-new-friends", () => {
    UserServices.getFriends();
  });
  socket.on("have-new-channels", () => {
    ChannelServices.getChannels();
  });
  socket.on("have-new-members", (options) => {
    ChannelServices.getLastestMembers(options.channelId);
  });
  socket.on("have-new-notification", (options) => {
    UserServices.getNotifications(options.channelId);
  });
  socket.on("refresh-chat-history", (channelId) => {
    ChannelServices.refreshChatHistory(channelId);
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
    store.dispatch({
      type: "DISCONNECT_FROM_SERVER",
      data: helper.notiMessage("Disconnected from server"),
    });
    store.dispatch({ type: "DISCONNECT_PRIVATE_CONNECTION" });
    webRTC.closeChannel();
  });
  // receiver
  socket.on("request-private-connection", (sendBy, type) => {
    store.dispatch({ type: "RECEIVING_REQUEST", data: { sendBy, type } });
    receiveTimeoutHandle = setTimeout(() => {
      store.dispatch({ type: "END_RECEIVING_REQUEST", data: "reject" });
    }, 6000);
  });
  // target end call
  socket.on("close-private-connection", (targetData) => {
    store.dispatch({ type: "DISCONNECT_PRIVATE_CONNECTION" });
    webRTC.closeChannel();
  });

  // RTC data
  socket.on("signal-data", webRTC.handleChannel);
};

let receiveTimeoutHandle;
module.exports.responsePrivateConnection = (isAccept) => {
  clearTimeout(receiveTimeoutHandle);
  socket.emit("response-private-connection", isAccept);
  store.dispatch({
    type: "END_RECEIVING_REQUEST",
    data: isAccept ? "accept" : "reject",
  });
};

module.exports.disconnect = function () {
  socket.disconnect();
};
module.exports.reconnect = function () {
  socket.connect();
};

// requester
module.exports.connectPrivate = (type, target) => {
  store.dispatch({
    type: "REQUESTING_PRIVATE_CONNECTION",
    data: { type, sendTo: target },
  });
  const user = store.getState().user;
  const userObj = {
    _id: user._id,
    name: user.name,
    channelId: target.channelId,
    startUser: target.startUser,
  };
  socket.emit(
    "request-private-connection",
    target.socket,
    userObj,
    type,
    (response) => {
      // 2 type response :  'reject', 'accept'
      store.dispatch({
        type: "END_REQUESTING_PRIVATE_CONNECTION",
        data: response == "accept" ? "success" : "reject",
      });
      if (response != "accept") {
        return;
      }
      webRTC.startChannel();
    }
  );
};
module.exports.disconnectPrivate = (content) => {
  const { exchangingTarget, type } = store.getState().privateConnection;
  socket.emit("disconnect-private-connection", exchangingTarget, content, type);
  store.dispatch({
    type: "DISCONNECT_PRIVATE_CONNECTION",
  });
  webRTC.closeChannel();
};

const sendRTCData = (data) => {
  socket.emit(
    "signal-data",
    data,
    store.getState().privateConnection.exchangingTarget.socket
  );
};
module.exports.sendRTCData = sendRTCData;
