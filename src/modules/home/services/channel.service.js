const axios = require("axios");
const helper = require("../../helper");
const store = require("../../redux/store");
const { connectPrivate } = require("./socketio");

const getLastestChannelList = () => {
  return axios
    .get(helper.getURL() + "/api/channel/get-lastest-list")
    .then((res) => {
      store.dispatch({ type: "UPDATE_LASTEST_CHANNEL_LIST", data: res.data });
    });
};
module.exports.getLastestChannelList = getLastestChannelList;

const getChannels = () => {
  return axios.post(helper.getURL() + "/api/channel/get").then((res) => {
    const channels = res.data;
    console.log(channels);
    store.dispatch({ type: "STORE_CHANNELS", data: channels });
  });
};
module.exports.getChannels = getChannels;

module.exports.getDetailMembers = (channelId) => {
  return axios
    .get(helper.getURL() + "/api/channel/get-detail-members", {
      params: {
        channelId,
      },
    })
    .then((res) => {
      store.dispatch({
        type: "STORE_MEMBERS",
        data: { channelId: channelId, participants: res.data },
      });
    });
};

module.exports.getLastestMembers = (channelId) => {
  return axios
    .get(helper.getURL() + "/api/channel/get-lastest-members", {
      params: {
        channelId,
      },
    })
    .then((res) => {
      store.dispatch({
        type: "UPDATE_MEMBERS",
        data: { channelId: channelId, participants: res.data },
      });
    });
};

module.exports.createGroup = (info) => {
  return axios
    .post(helper.getURL() + "/api/channel/create", info)
    .then(async () => {
      await getLastestChannelList();
      await getChannels();
    });
};
module.exports.addMembers = (info) => {
  return axios.post(helper.getURL() + "/api/channel/add-members", info);
};
module.exports.removeMembers = (info) => {
  return axios.post(helper.getURL() + "/api/channel/remove-members", info);
};

module.exports.sendMessage = (channelId, message) => {
  axios.post(helper.getURL() + `/api/channel/send-message`, {
    channelId,
    message,
  });
};

module.exports.createReminder = (channelId, due, content) => {
  return axios.post(helper.getURL() + `/api/channel/create-reminder`, {
    due,
    content,
    channelId,
  });
};
module.exports.checkCallTarget = (targetId, channelId, type) => {
  return axios
    .post(helper.getURL() + `/api/channel/check-call-target`, {
      targetId,
      channelId,
      type,
    })
    .then((response) => {
      if (response.data.error) {
        console.log(response.error);
        return;
      }
      if (response.data.success) {
        const { target } = response.data;
        connectPrivate(type, target);
      }
    });
};

module.exports.updateMessage = (channelId) => {
  axios
    .post(helper.getURL() + `/api/channel/update-message`, { channelId })
    .then((res) => {
      const andCurrent =
        store.getState().view.content == channelId ? true : false;
      store.dispatch({
        type: "UPDATE_MESSAGE",
        data: { channelId, messages: res.data, andCurrent },
      });
    });
};

const loadOlderHistory = (channelId, time) => {
  const timeRoot = time || new Date();
  return axios
    .post(helper.getURL() + `/api/channel/load-history`, {
      channelId,
      time: timeRoot,
    })
    .then((res) => {
      if (!res.data.length || res.data.length < 10) {
        const newMessages = [...res.data] || [];
        store.dispatch({
          type: "LOAD_OLD_MESSAGE",
          data: { channelId, messages: [...newMessages, { content: "top" }] },
        });
      } else {
        store.dispatch({
          type: "LOAD_OLD_MESSAGE",
          data: { channelId, messages: res.data },
        });
        store.dispatch({
          type: "SET_LOAD_HISTORY",
          data: false,
        });
      }
    });
};
module.exports.loadOlderHistory = loadOlderHistory;

module.exports.refreshChatHistory = (channelId) => {
  const currentContent = store.getState().view.content;
  if (currentContent == channelId) {
    store.dispatch({ type: "CLEAR_CURRENT_HISTORY" });
    loadOlderHistory(channelId, new Date());
  }
};
