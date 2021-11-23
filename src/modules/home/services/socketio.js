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
  socket.on("have-new-message", (options) => {
    ChannelServices.updateMessage(options.channelId);
  });
  socket.on("have-new-friends", () => {
    console.log("have-new-friends");
    UserServices.getFriends();
  });
  socket.on("have-new-channels", () => {
    console.log("have-new-channels");
    ChannelServices.getChannels();
  });
  socket.on("have-new-notification", (options) => {
    console.log("have-new-notification");
    UserServices.getNotifications(options.channelId);
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
  socket.on("request-private-connection", (requestedSocketID) => {
    store.dispatch({ type: "RECEIVING_REQUEST", data: requestedSocketID });
    receiveTimeoutHandle = setTimeout(() => {
      store.dispatch({ type: "END_RECEIVING_REQUEST" });
    }, 6000);
  });
  socket.on("target-leave-private-connection", () => {
    store.dispatch({
      type: "DISCONNECT_PRIVATE_CONNECTION",
      data: helper.notiMessage("Connected user leaved room "),
    });
    webRTC.closeChannel();
  });
  // update target data
  socket.on("update-target-user-data", (targetData) => {
    store.dispatch({ type: "UPDATE_TARGET_DATA", data: targetData });
  });

  // message private connection
  socket.on("private-send-message", (data) => {
    // data :{text:..., time: ..., user:...}
    if (data) {
      store.dispatch({
        type: "UPDATE_HISTORY_LOG",
        data,
      });
    }
  });
  // exchange file
  socket.on("private-exchange-file", (data) => {
    if (data.type == "offer") {
      store.dispatch({ type: "ADD_FILE_LIST", data: data.data });
      return;
    }
    if (data.type == "reject") {
      window.arrayFile = window.arrayFile.filter((file) => {
        return file.id != data.data;
      });
      store.dispatch({
        type: "UPDATE_STATE_FILE",
        data: { state: "reject", id: data.data },
      });
      return;
    }
    if (data.type == "accept") {
      const fileWillSend = window.arrayFile.find((file) => {
        return file.id == data.data;
      });
      console.log(fileWillSend);
      webRTC.startSendingFile(fileWillSend);
      store.dispatch({
        type: "UPDATE_STATE_FILE",
        data: { state: "downloading", id: data.data },
      });
      return;
    }
  });
  // RTC data
  socket.on("signal-data", webRTC.handleChannel);
};

let receiveTimeoutHandle;
module.exports.acceptPrivateConnection = (requestedSocketID) => {
  // accept
  clearTimeout(receiveTimeoutHandle);
  socket.emit(
    "response-private-connection",
    requestedSocketID,
    socket.id,
    (response) => {
      // response type: 'accept: ${}'
      const roomID = response.split(" ")[1];
      store.dispatch({
        type: "CONNECT_PRIVATE_CONNECTION",
        data: {
          roomID,
          targetID: requestedSocketID,
          message: helper.notiMessage("Connected to private room"),
        },
      });
    }
  );
};
module.exports.rejectPrivateConnection = () => {
  // reject
  clearTimeout(receiveTimeoutHandle);
  socket.emit("response-private-connection");
};

module.exports.disconnect = function () {
  socket.disconnect();
};
module.exports.reconnect = function () {
  socket.connect();
};

// requester
module.exports.connectPrivate = (targetSocketID) => {
  if (socket.disconnected || targetSocketID == null) {
    return;
  }
  store.dispatch({
    type: "REQUESTING_PRIVATE_CONNECTION",
    data: targetSocketID,
  });
  socket.emit("request-private-connection", targetSocketID, (response) => {
    // 4 type response : 'timeout' 'reject' 'accept: ${roomID}' 'already in connection: ${roomID}'
    if (response == "timeout" || response == "reject" || response == "busy") {
      store.dispatch({
        type: "END_REQUESTING_PRIVATE_CONNECTION",
        data: response,
      });
      return;
    }
    const roomID = response.split(": ")[1];
    store.dispatch({
      type: "END_REQUESTING_PRIVATE_CONNECTION",
      data: "success",
    });
    store.dispatch({
      type: "CONNECT_PRIVATE_CONNECTION",
      data: {
        roomID,
        targetID: targetSocketID,
        message: helper.notiMessage("Connected to private room"),
      },
    });
    webRTC.startChannel();
  });
};
module.exports.disconnectPrivate = (roomID) => {
  socket.emit("disconnect-room", roomID, (result) => {
    if (result == "success") {
      store.dispatch({
        type: "DISCONNECT_PRIVATE_CONNECTION",
        data: helper.notiMessage("Leaved private room"),
      });
      webRTC.closeChannel();
    }
  });
};

module.exports.sendMessage = (message, roomID) => {
  if (!store.getState().status.toPeer) {
    store.dispatch({
      type: "UPDATE_HISTORY_LOG",
      data: {
        text: "Need connect to a client first!",
        time: helper.getTime(),
        user: "System",
      },
    });
    return;
  }
  socket.emit(
    "private-send-message",
    { text: message, time: helper.getTime(), socketID: socket.id },
    roomID
  );
};

module.exports.exchangeFile = (data, roomID) => {
  //data type fileInfo
  socket.emit("private-exchange-file", { type: "offer", data }, roomID);
};

module.exports.acceptFile = (fileId) => {
  socket.emit(
    "private-exchange-file",
    { type: "accept", data: fileId },
    store.getState().privateConnection.roomID
  );
};
module.exports.rejectFile = (fileId) => {
  socket.emit(
    "private-exchange-file",
    { type: "reject", data: fileId },
    store.getState().privateConnection.roomID
  );
};

const sendRTCData = (data) => {
  socket.emit("signal-data", data, store.getState().privateConnection.roomID);
};
module.exports.sendRTCData = sendRTCData;
