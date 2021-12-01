const store = require("./redux/store");

const getTime = (date) => {
  let now;
  if (date) {
    now = new Date(date);
  } else {
    now = new Date();
  }
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
};
module.exports.getTime = getTime;

const getTimeFrom = (dateObj) => {
  if (!dateObj) {
    return "";
  }
  const vDate = new Date(dateObj);
  const hours = vDate.getHours();
  const minutes = vDate.getMinutes();
  const date = vDate.getDate();
  const month = vDate.getMonth();
  const year = vDate.getFullYear();
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${date}/${
    month + 1
  }/${year}`;
};
module.exports.getTimeFrom = getTimeFrom;

module.exports.changeSizeValue = (value) => {
  if (value / 1073741824 >= 1) {
    return { type: "GB", value: (value / 1073741824).toFixed(2) };
  }
  if (value / 1048576 >= 1) {
    return { type: "MB", value: (value / 1048576).toFixed(2) };
  }
  if (value / 1024 >= 1) {
    return { type: "KB", value: (value / 1024).toFixed(2) };
  }
  return { type: "B", value: value };
};

module.exports.notiMessage = (message) => {
  return {
    text: message,
    time: getTime(),
    user: "System",
  };
};

module.exports.scrollToBottomById = (id) => {
  const ele = document.getElementById(id);
  ele.scrollTop = ele.scrollHeight;
};

module.exports.collectGarbage = () => {
  URL.revokeObjectURL(URL.createObjectURL(new Blob([1])));
};

const getURL = () => {
  return "http://localhost:3000";
};
module.exports.getURL = getURL;

module.exports.getImg = (src) => {
  return `${getURL()}/${src}`;
};

module.exports.getPrivateChannelName = (participants) => {
  const currentUser = store.getState().user;
  const targetId =
    participants[0] == currentUser._id ? participants[1] : participants[0];
  const target = currentUser.friends.find((ele) => ele.user._id == targetId);
  return target ? target.user.name : "Cuộc trò chuyện";
};

module.exports.checkOutdated = (time) => {
  const now = new Date();
  const target = new Date(time);
  if (now.getTime() >= target.getTime()) {
    return true;
  }
  return false;
};

module.exports.setLocalNoCamObj = (target) => {
  target.width = "180px";
  target.height = "100%";
  target.backgroundPosition = "center";
  target.backgroundImage = "url(../../../nocam.png)";
  target.backgroundSize = "contain";
};
