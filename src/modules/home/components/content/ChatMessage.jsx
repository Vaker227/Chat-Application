import React, { useState, useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import helper from "../../../helper.js";
import Avatar from "../common/avatar.jsx";

function ChatMessage(props) {
  return (
    <>
      {props.messageInfo.type == "text" ? (
        <div
          className={`d-flex ${props.messageInfo.space ? "pb-4" : "pb-2"} ${
            props.messageInfo.me ? "flex-row-reverse" : ""
          }`}
        >
          <Avatar src="../../../mushroom.png" width="50" height="50" />
          <OverlayTrigger
            placement="left"
            delay={100}
            overlay={
              <Tooltip>{helper.getTime(props.messageInfo.time)}</Tooltip>
            }
          >
            <div className="message-content bg-light p-2 shadow mx-2">
              <p className="user-name fw-bold">{props.messageInfo.user}</p>
              <p className="text-break">{props.messageInfo.content}</p>
            </div>
          </OverlayTrigger>
        </div>
      ) : props.messageInfo.type == "noti" ? (
        <div className="mx-auto">
          <p className="text-center">
            {helper.getTimeFrom(props.messageInfo.time)}
          </p>
          <p className="text-center fs-6">{props.messageInfo.content}</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default ChatMessage;
