import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import _ from "lodash";

import Avatar from "../common/avatar.jsx";
import ChatHistory from "./ChatHistory.jsx";
import ChatInfo from "./chat-info.jsx";
import ChannelServices from "../../services/channel.service";
import helper from "../../../helper";

function ChatBox(props) {
  const [text, setText] = useState("");
  const [isFocusTyping, setIsFocusTyping] = useState(false);
  const [canvas, setCanvas] = useState(false);

  useEffect(() => {
    if (props.channel) {
      props.loadCurrentHisory(props.channel._id);
      if (_.get(props, "channel.messages.length") < 2) {
        ChannelServices.updateMessage(props.channel._id);
      }
    }
  }, [props.channel]);
  const title = useMemo(() => {
    return props.channel.type == "private"
      ? helper.getPrivateChannelName(props.channel.participants)
      : props.channel.title;
  }, [props.channel]);
  const turnOnCanvas = () => {
    setCanvas(true);
  };
  const turnOffCanvas = () => {
    setCanvas(false);
  };
  const handleFocus = () => {
    setIsFocusTyping(true);
  };
  const handleBlur = () => {
    setIsFocusTyping(false);
  };
  const handleChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    setText(e.target.value);
  };
  const handleSendMessage = (e) => {
    if (text == "") {
      return;
    }
    const message = {
      sendBy: props.user._id,
      content: text,
      time: Date.now(),
      type: "text",
    };
    ChannelServices.sendMessage(props.channel._id, message);
    setText("");
  };
  const handleSendByEnter = (e) => {
    if (!e.shiftKey && (e.key == "Enter" || e.key == "numpadKey")) {
      handleSendMessage(e);
      e.preventDefault();
    }
  };
  return (
    <>
      <div
        className="d-flex flex-column"
        style={{ height: "100%", position: "relative" }}
      >
        <div className="content-header d-flex p-2 justify-content-between bg-light align-items-center border-bottom">
          <div className="d-flex">
            <Avatar src="../../../mushroom.png" width="50" height="50" />
            <div>
              <p className="fs-5 fw-bold">{title}</p>
              <p style={{ fontSize: "0.95rem", color: "gray" }}>
                Truy cap last time
              </p>
            </div>
          </div>
          <div className="d-flex">
            <i className="text-btn fas fa-phone-alt"></i>
            <i className="text-btn fas fa-video"></i>
            <i
              className="text-btn far fa-window-maximize"
              style={{ transform: "rotate(-90deg)" }}
              onClick={turnOnCanvas}
            ></i>
          </div>
          <ChatInfo
            channel={props.channel}
            canvas={canvas}
            turnOn={turnOnCanvas}
            turnOff={turnOffCanvas}
          />
        </div>
        <ChatHistory channel={props.channel} />
        <div className="bg-light ">
          <div className="w-100 p-2 ps-3">Thao tác</div>
          <div
            className={`d-flex justify-content-between align-items-center p-2 w-100 ps-3  border-2 border-top ${
              isFocusTyping ? "border-primary" : ""
            }`}
          >
            <textarea
              id="chat-input"
              className="flex-end text-wrap"
              placeholder="Nhập tin nhắn"
              value={text}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleSendByEnter}
            ></textarea>
            <div className="align-self-end mb-3">
              <Button
                variant="outline-primary"
                onClick={text != "" ? handleSendMessage : null}
              >
                {text == "" ? (
                  <i className="fas fa-thumbs-up"></i>
                ) : (
                  <i className="fas fa-location-arrow"></i>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ChatBoxSTP = (state) => {
  return { user: state.user, view: state.view };
};
const ChatBoxDTP = (dispatch) => {
  return {
    loadCurrentHisory: function (channelId) {
      return dispatch({ type: "LOAD_CURRENT_HISTORY", data: channelId });
    },
  };
};
const ChatBoxReduxed = connect(ChatBoxSTP, ChatBoxDTP)(ChatBox);

export default ChatBoxReduxed;
