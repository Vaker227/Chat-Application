import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import SideBar from "../sidebar/sidebar.jsx";
import Menu from "../menu/menu.jsx";
import Content from "../content/content.jsx";

function OverView() {
  return (
    <div>
      <SideBar />
      <Container id="main-layout">
        <Row className="h-100">
          <Col md={5} as={Menu} className="bg-light h-100" />
          <Col md={7} as={Content} />
        </Row>
      </Container>
    </div>
  );
}

export default OverView;
