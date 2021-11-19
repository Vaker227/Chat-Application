const axios = require("axios");
const helper = require("../../helper");
const store = require("../../redux/store");

const getLastestChannelList = () => {
  return axios
    .get(helper.getURL() + "/api/channel/get-lastest-list")
    .then((res) => {
      store.dispatch({ type: "UPDATE_LASTEST_CHANNEL_LIST", data: res.data });
    });
};
module.exports.getLastestChannelList = getLastestChannelList;
const getChannels = () => {
  const channels = store.getState().user.channels;
  return axios
    .post(helper.getURL() + "/api/channel/get", channels)
    .then((res) => {
      const channels = res.data;
      store.dispatch({ type: "STORE_CHANNELS", data: channels });
    });
};
module.exports.getChannels = getChannels;

module.exports.createGroup = (info) => {
  return axios
    .post(helper.getURL() + "/api/channel/create", info)
    .then(async () => {
      await getLastestChannelList();
      await getChannels();
    });
};

module.exports.sendMessage = (channelId, message) => {
  axios.post(helper.getURL() + `/api/channel/send-message`, {
    channelId,
    message,
  });
};

module.exports.updateMessage = (channelId) => {
  axios
    .post(helper.getURL() + `/api/channel/update-message`, { channelId })
    .then((res) => {
      store.dispatch({
        type: "UPDATE_MESSAGE",
        data: { channelId, messages: res.data },
      });
    });
};

module.exports.loadOlderHistory = (channelId, time) => {
  return axios
    .post(helper.getURL() + `/api/channel/load-history`, { channelId, time })
    .then((res) => {
      if (!res.data.length) {
        store.dispatch({
          type: "UPDATE_MESSAGE",
          data: { channelId, messages: [{ content: "top" }] },
        });
      } else {
        store.dispatch({
          type: "UPDATE_MESSAGE",
          data: { channelId, messages: res.data },
        });
        store.dispatch({
          type: "SET_LOAD_HISTORY",
          data: false,
        });
      }
    });
};
