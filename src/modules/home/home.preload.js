const { contextBridge, ipcRenderer, app } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  quitApp: () => {
    ipcRenderer.send("quit-app");
  },
});
