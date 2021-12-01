require("dotenv").config();
const path = require("path");
const os = require("os");
const { app, session, protocol, ipcMain } = require("electron");
const config = require("./config");

let login, main;

require("electron-reload")(["./src/modules/home/*.html", "./src/dist/**"], {
  hardResetMethod: "exit",
});

const reduxDevToolsPath = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "Google",
  "Chrome",
  "User Data",
  "Default",
  "Extensions",
  "lmhkpmbekcpmknklioeibfkpmmfibljd",
  "2.17.2_0"
);

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
    },
  },
]);

app.whenReady().then(() => {
  protocol.registerFileProtocol("app", (request, callback) => {
    const url = request.url.substr(6);
    callback({
      path: path.normalize(`${__dirname}/${url}`),
    });
  });
  login = require("./src/modules/login/login")();

  // main = require("./src/modules/home/home")();
  session.defaultSession
    .loadExtension(reduxDevToolsPath, { allowFileAccess: true })
    .then((data) => console.log("loaded: " + data.name));
});

app.once("window-all-closed", () => {
  app.quit();
});

ipcMain.handle("login", async (event) => {
  const cookies = await event.sender.session.cookies.get({
    url: config.url,
    name: "connect.sid",
  });
  main = require("./src/modules/home/home")(cookies);
  return "done";
});
ipcMain.on("close-login", () => {
  login.close();
});

ipcMain.on("logout", () => {
  login = require("./src/modules/login/login")();
  main.close();
});

ipcMain.handle("get-cookies", async (event, arg) => {
  const cookies = await event.sender.session.cookies.get(arg);
  return cookies;
});
ipcMain.handle("set-cookies", async (event, arg) => {
  const result = await event.sender.session.cookies.set(arg);
  return result;
});
ipcMain.handle("remove-cookies", async (event, { url, name }) => {
  const result = await event.sender.session.cookies.remove(url, name);
  return result;
});
