const { BrowserWindow, ipcMain, dialog, shell, app } = require("electron");
const fspromise = require("fs/promises");
const fs = require("fs");
const path = require("path");
const config = require("../../../config");

// const userDataPath = path.join(app.getPath("userData"), "config.json");

module.exports = function (cookies) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    show: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "home.preload.js"),
    },
  });
  const session = win.webContents.session;
  const defaultCookie = Object.assign({}, { url: config.url }, cookies[0]);
  session.cookies.set(defaultCookie);
  win.loadFile("./src/modules/home/home.html");
  win.on("ready-to-show", () => {
    win.show();
  });
  win.on("will-resize", (e) => {
    e.preventDefault();
  });
  ipcMain.on("quit-app", () => {
    app.quit();
  });
  ipcMain.on("minimize-app", () => {
    win.minimize();
  });
  ipcMain.on("hide-app", () => {
    win.hide();
  });

  return win;
};
