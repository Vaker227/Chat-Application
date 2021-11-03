const path = require("path");
const os = require("os");
const { app, BrowserWindow, session } = require("electron");

let win;

require("electron-reload")(
  ["./src/modules/home/*.html", "./src/dist/**"],
  {
    hardResetMethod: "exit",
  }
);

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

app.whenReady().then(() => {
  win = require("./src/modules/home/home")();
  session.defaultSession
    .loadExtension(reduxDevToolsPath, { allowFileAccess: true })
    .then((data) => console.log("loaded: " + data.name));
});

app.once("window-all-closed", () => {
  app.quit();
});
