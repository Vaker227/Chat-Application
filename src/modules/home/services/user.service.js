const axios = require("axios");
const helper = require("../../helper");
const store = require("../../redux/store");

const { getLastestChannelList, getChannels } = require("./channel.service");

module.exports.getInfo = () => {
  return axios.get(helper.getURL() + "/api/user/get-user-info");
};
module.exports.updateInfo = (data) => {
  return axios
    .post(helper.getURL() + "/api/user/update-user-info", data)
    .then((res) => {
      store.dispatch({ type: "STORE_INFO", data: res.data });
    });
};

module.exports.findUsers = (name) => {
  return axios.post(helper.getURL() + "/api/user/find-users", {
    name,
  });
};

module.exports.removeFriend = (friendId, channelId) => {
  return axios.post(helper.getURL() + "/api/user/remove-friend", {
    friendId,
    channelId,
  });
};
module.exports.requestFriend = (userId) => {
  return axios.post(helper.getURL() + "/api/user/request-friend", { userId });
};

module.exports.responseFriendRequest = (isAccept, request) => {
  const action = isAccept ? "accept" : "reject";
  return axios
    .post(helper.getURL() + "/api/user/response-friend", {
      action,
      request,
    })
    .then((res) => {
      getLastestChannelList().then(() => {
        getChannels();
      });
    });
};

module.exports.getNotifications = () => {
  return axios
    .get(helper.getURL() + "/api/user/notification")
    .then((res) =>
      store.dispatch({ type: "LOAD_NOTIFICATION", data: res.data })
    );
};

module.exports.getFriends = () => {
  axios.post(helper.getURL() + "/api/user/get-friends").then((res) => {
    store.dispatch({ type: "STORE_FRIENDS", data: res.data });
  });
};
