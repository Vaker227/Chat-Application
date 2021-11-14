const getTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
};
module.exports.getTime = getTime;

const getTimeFrom = (dateObj) => {
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const date = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
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

module.exports.collectGarbage = () => {
  URL.revokeObjectURL(URL.createObjectURL(new Blob([1])));
};

module.exports.getURL = () => {
  return "http://localhost:3000";
};

