import React, { useState } from "react";
import {
  Offcanvas,
  Accordion,
  useAccordionButton,
  Card,
} from "react-bootstrap";

import Avatar from "../common/avatar.jsx";

function CustomHeaderAccordion({ children, eventKey }) {
  const [expand, setExpand] = useState(false);
  const handleClick = useAccordionButton(eventKey, () => {
    setExpand(!expand);
  });
  return (
    <div className="d-flex justify-content-between btn" onClick={handleClick}>
      <div className="fw-bold ">{children}</div>
      <div>
        <i
          className="accordion-icon fas fa-chevron-down"
          style={{ transform: `rotate(${expand ? "90" : "0"}deg)` }}
        ></i>
      </div>
    </div>
  );
}

function ChatInfo(props) {
  return (
    <Offcanvas
      show={props.canvas}
      onHide={props.turnOff}
      placement={"end"}
      style={{ width: 300 }}
    >
      <div className="p-3 text-center fs-5 fw-bold border-bottom">
        Thông tin hội thoại
      </div>
      <div className="p-3 d-flex flex-column align-items-center border-bottom border-4">
        <Avatar src="../../../mushroom.png" width="50" height="50" />
        <div>
          <span className="fw-bold fs-4">{props.channel.title}</span>
          <i
            className="text-btn far fa-edit ms-2"
            style={{ backgroundColor: "#0000000d" }}
          ></i>
        </div>
      </div>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <CustomHeaderAccordion eventKey="0">Header 1</CustomHeaderAccordion>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Offcanvas>
  );
}

export default ChatInfo;
