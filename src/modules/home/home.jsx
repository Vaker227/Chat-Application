import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/all.min.css";
import { Provider } from "react-redux";

import "./style/home.css";
import UserServices from "./services/user.service";
import ChannelServices from "./services/channel.service";
import store from "../redux/store";
import OverView from "./components/overview/overview.jsx";
import SocketIO from "./services/socketio";

function App() {
  useEffect(() => {
    UserServices.getInfo().then((result) => {
      store.dispatch({ type: "STORE_INFO", data: result.data });
      SocketIO.connect(result.data._id);
      ChannelServices.getChannels();
      UserServices.getFriends();
      UserServices.getNotifications();
    });
  }, []);
  return (
    <div>
      <OverView />
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
