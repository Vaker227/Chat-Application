const axios = require("axios");
const helper = require("../../helper");

module.exports.getInfo = () => {
  return axios.get(helper.getURL() + "/api/user/get-user-info");
};
module.exports.findUsers = (name) => {
  return axios.post(helper.getURL() + "/api/user/find-users", {
    name,
  });
};
