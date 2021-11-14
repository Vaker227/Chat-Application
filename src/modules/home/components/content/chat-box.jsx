import React, { useState } from "react";
import { Button } from "react-bootstrap";

import Avatar from "../common/avatar.jsx";
import ChatHistory from "./ChatHistory.jsx";
import ChatInfo from "./chat-info.jsx";

function ChatBox() {
  const [text, setText] = useState("");
  const [isFocusTyping, setIsFocusTyping] = useState(false);
  const [canvas, setCanvas] = useState(false);
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

  return (
    <div className="d-flex flex-column" style={{ maxHeight: "100vh" }}>
      <div
        id="content-header"
        className="d-flex p-2 justify-content-between bg-light align-items-center border-bottom"
      >
        <div className="d-flex">
          <Avatar src="../../../mushroom.png" width="50" height="50" />
          <div>
            <p className="fs-5 fw-bold">Teen</p>
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
          canvas={canvas}
          turnOn={turnOnCanvas}
          turnOff={turnOffCanvas}
        />
      </div>
      <ChatHistory />
      <div className="bg-light flex-fill">
        <div className="w-100 p-2 ps-3">thao tac</div>
        <div
          className={`d-flex justify-content-between align-items-center p-2 w-100 ps-3  border-2 border-top ${
            isFocusTyping ? "border-primary" : ""
          }`}
        >
          <textarea
            id="chat-input"
            className="flex-end text-wrap"
            placeholder="tin nhan toi"
            value={text}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          ></textarea>
          <div className="align-self-end mb-3">
            <Button variant="outline-primary">
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
  );
}

export default ChatBox;
