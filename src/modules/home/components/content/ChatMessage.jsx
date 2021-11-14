import React, { useState, useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import helper from "../../../helper.js";
import Avatar from "../common/avatar.jsx";

function ChatMessage(props) {
  return (
    <div
      className={`d-flex ${props.messageInfo.space ? "pt-4" : "pt-2"} ${
        props.messageInfo.me ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar src="../../../mushroom.png" width="50" height="50" />
      <OverlayTrigger
        placement="left"
        delay={100}
        overlay={<Tooltip>{helper.getTime(props.messageInfo.time)}</Tooltip>}
      >
        <div className="message-content bg-light p-2 shadow mx-2">
          <p className="user-name fw-bold">{props.messageInfo.user}</p>
          <p className="text-break">{props.messageInfo.content}</p>
        </div>
      </OverlayTrigger>
    </div>
  );
}

export default ChatMessage;
