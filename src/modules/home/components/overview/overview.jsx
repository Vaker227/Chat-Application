import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import SideBar from "../sidebar/sidebar.jsx";
import Menu from "../menu/menu.jsx";
import Content from "../content/content.jsx";

function OverView(props) {
  const minimizeApp = () => {
    if (window.electron) {
      window.electron.minimizeApp();
    }
  };
  const maximizeApp = () => {
    if (window.electron) {
      window.electron.maximizeApp();
    }
  };
  const quitApp = () => {
    if (window.electron) {
      window.electron.quitApp();
    }
  };
  return (
    <div>
      <SideBar />
      <div id="main-title" className="d-flex justify-content-between">
        <div className="fw-bolder align-self-center" onClick={props.initInfo}>
          Zulu
        </div>
        <div className="d-flex ">
          <div className="title-button" onClick={minimizeApp}>
            <i
              className="far fa-window-minimize"
              style={{ position: "relative", top: "-5px", fontSize: 16 }}
            ></i>
          </div>
          <div className="title-button" onClick={maximizeApp}>
            <i className="far fa-square"></i>
          </div>
          <div className="title-button quit-btn" onClick={quitApp}>
            <i
              className="fas fa-times"
              style={{ position: "relative", top: "2px", fontSize: 20 }}
            ></i>
          </div>
        </div>
      </div>
      <Container fluid id="main-layout">
        <Row className="h-100">
          <Col md={5} as={Menu} className="bg-light h-100 pt-2 border-end" />
          <Col md={7} as={Content} className="h-100" />
        </Row>
      </Container>
    </div>
  );
}

export default OverView;
