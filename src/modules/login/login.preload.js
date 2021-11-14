const { contextBridge, ipcRenderer, app, session } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  quitApp: () => {
    ipcRenderer.send("quit-app");
  },
  getCookies: (arg) => {
    ipcRenderer.invoke("get-cookies", arg).then((cookies) => {
      console.log(cookies);
    });
  },
  setCookies: (arg) => {
    ipcRenderer.invoke("set-cookies", arg).then((cookies) => {
      console.log(cookies);
    });
  },
  removeCookies: (args) => {
    ipcRenderer.invoke("remove-cookies", args).then((cookies) => {
      console.log(cookies);
    });
  },
  login:()=>{
    ipcRenderer.invoke("login").then(() => {
      ipcRenderer.send("close-login");
    });
  }
});
