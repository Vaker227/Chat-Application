const { contextBridge, ipcRenderer, app } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  quitApp: () => {
    ipcRenderer.send("quit-app");
  },
  getCookies: (arg) => {
    ipcRenderer.invoke("get-cookies", arg).then((cookies) => {
      console.log(cookies);
    });
  },
});
