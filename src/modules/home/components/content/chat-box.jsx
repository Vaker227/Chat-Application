import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import _ from "lodash";

import Avatar from "../common/avatar.jsx";
import ChatHistory from "./ChatHistory.jsx";
import ChatInfo from "./chat-info.jsx";
import ModalProfile from "../common/modal-profile.jsx";
import Profile from "../common/profile.jsx";
import ChannelServices from "../../services/channel.service";

function ChatBox(props) {
  const [text, setText] = useState("");
  const [isFocusTyping, setIsFocusTyping] = useState(false);
  const [canvas, setCanvas] = useState(false);

  const [myProfileModal, setMyProfileModal] = useState(false);
  const showMyProfileModal = () => {
    setMyProfileModal(true);
  };
  const closeMyProfileModal = () => {
    setMyProfileModal(false);
  };
  useEffect(() => {
    if (props.channel) {
      if (
        !props.channel.detailParticipants &&
        props.channel.type != "private"
      ) {
        ChannelServices.getMembers(props.channel._id);
      }
      props.loadCurrentHisory(props.channel._id);
      if (_.get(props, "channel.messages.length") < 2) {
        ChannelServices.loadOlderHistory(props.channel._id);
      }
    }
  }, [props.channel]);
  const friendInfo = useMemo(() => {
    if (props.channel.type == "private") {
      const friend = props.user.friends.find((friendMap) => {
        return friendMap.channel == props.channel._id;
      });
      if (!friend) {
        return null;
      }
      return friend.user;
    }
    return {};
  }, [props.view.content]);

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
    document.getElementById('chat-input').style.height = "auto";
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
          <div
            className="d-flex"
            style={props.channel.type == "private" ? { cursor: "pointer" } : {}}
            onClick={
              props.channel.type == "private" ? showMyProfileModal : null
            }
          >
            <Avatar src="../../../mushroom.png" width="50" height="50" />
            <div>
              <p className="fs-5 fw-bold">
                {props.channel.type == "private"
                  ? friendInfo.name
                  : props.channel.title}
              </p>
              <p style={{ fontSize: "0.95rem", color: "gray" }}>
                Truy cap last time
              </p>
            </div>
          </div>
          <div className="d-flex">
            {props.channel.type == "private" ? (
              <>
                <i
                  title="Gọi điện"
                  className="text-btn text-primary fas fa-phone-alt"
                ></i>
                <i
                  title="Call video"
                  className="text-btn text-primary fas fa-video"
                ></i>
              </>
            ) : (
              <>
                <i
                  title="Thêm thành viên"
                  className="text-btn fas fa-user-plus"
                ></i>
              </>
            )}
            <i
              className="text-btn far fa-window-maximize"
              style={{ transform: "rotate(-90deg)" }}
              onClick={turnOnCanvas}
            ></i>
          </div>
          <ChatInfo
            channel={props.channel}
            userInfo={friendInfo}
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
      {props.channel.type == "private" && (
        <ModalProfile
          show={myProfileModal}
          handleClose={closeMyProfileModal}
          title="Thông tin"
        >
          <Profile
            friend
            target={friendInfo}
            channelId={props.channel._id}
            handleClose={closeMyProfileModal}
          />
        </ModalProfile>
      )}
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
