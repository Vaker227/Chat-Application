const axios = require("axios");
const store = require("../../redux/store");
const helper = require("../../helper");

const ChannelServices = require("./channel.service");

module.exports.getDetailReminder = (reminderId) => {
  return axios
    .get(helper.getURL() + `/api/reminder/${reminderId}`)
    .then((response) => {
      store.dispatch({
        type: "TOGGLE_DETAIL_REMINDER_MODAL",
        data: response.data,
      });
    });
};

module.exports.getListReminderChannel = (channelId) => {
  return axios.post(helper.getURL() + `/api/reminder/get-list-channel`, {
    channelId,
  });
};

module.exports.updateReminder = (reminder) => {
  return axios
    .post(helper.getURL() + `/api/reminder/update`, reminder)
    .then(() => {
      ChannelServices.refreshChatHistory(reminder.channel);
    });
};
