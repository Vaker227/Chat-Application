import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import _ from "lodash";

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
              <p className="fs-7 fw-light pe-1">
                {!props.messageInfo.me ? _.get(props, "memberInfo.name") : null}
              </p>
              <p className="text-break">{props.messageInfo.content}</p>
            </div>
          </OverlayTrigger>
        </div>
      ) : props.messageInfo.type == "noti" ? (
        <div className="mx-auto my-4">
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
