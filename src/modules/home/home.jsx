import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/all.min.css"
import { Provider } from "react-redux";

import './style/home.css'
import store from '../redux/store'
import OverView from "./components/overview/overview.jsx";

function App() {
  return (
    <div >
      <OverView/>
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
