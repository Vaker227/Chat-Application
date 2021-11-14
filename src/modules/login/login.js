const { BrowserWindow, ipcMain, app } = require("electron");
const path = require("path");

const config = require("../../../config");

module.exports = function () {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "login.preload.js"),
    },
  });
  const session = win.webContents.session;

  session.cookies.remove(config.url, "connect.sid");
  win.loadURL("app://src/modules/login/login.html");
  // win.loadFile("./src/modules/login/login.html");

  // built-in
  win.on("ready-to-show", () => {
    win.show();
  });
  win.on("will-resize", (e) => {
    e.preventDefault();
  });
  // message
  ipcMain.on("quit-app", () => {
    app.quit();
  });
  

  return win;
};
