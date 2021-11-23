const { contextBridge, ipcRenderer, app } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  quitApp: () => {
    ipcRenderer.send("quit-app");
  },
  minimizeApp:()=>{
    ipcRenderer.send("minimize-app");
  },
  hideApp:()=>{
    ipcRenderer.send("hide-app");
  },
  getCookies: (arg) => {
    ipcRenderer.invoke("get-cookies", arg).then((cookies) => {
      console.log(cookies);
    });
  },
});
