const axios = require("axios");
const helper = require("../../helper");

module.exports.getInfo = () => {
  return axios.get(helper.getURL() + "/api/user/get-user-info");
};
module.exports.register = (user) => {
  return axios.post(helper.getURL() + "/user/register", user);
};
module.exports.login = ({ username, password }) => {
  return axios.post(helper.getURL() + "/login", {
    username,
    password,
  });
};
