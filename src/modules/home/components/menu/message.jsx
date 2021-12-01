import React, { useMemo } from "react";

import Avatar from "../common/avatar.jsx";
import helper from "../../../helper";
import _ from "lodash";
import { connect } from "react-redux";

function Message(props) {
  const title = useMemo(() => {
    return props.channel.type == "private"
      ? helper.getPrivateChannelName(props.channel.participants)
      : props.channel.title;
  }, [props.channel, props.friends]);
  const isActive = useMemo(() => {
    return props.view.content == props.channel._id;
  }, [props.view.content]);
  return (
    <div
      className={`d-flex p-2 w-100 bg-light message ${
        isActive ? "active" : ""
      }`}
      lasttime={`${
        props.channel.messages[0]
          ? helper.getTime(props.channel.messages[0].time)
          : ""
      }`}
      onClick={props.onClick}
    >
      <div className="w-10">
        <Avatar
          src="../../../mushroom.png"
          width="56"
          height="56"
          className="mx-auto"
        />
      </div>
      <div style={{ width: "80%" }}>
        <p
          className={`title fs-5 text-truncate w-75 ${
            props.unread ? "fw-bold" : ""
          }`}
        >
          {title}
        </p>
        <p
          className={`fs-6 text-truncate w-75 ${
            props.unread ? "fw-bold" : "fw-light"
          }`}
        >
          {_.get(props, "channel.messages[0].type") == "vcall" ||
          _.get(props, "channel.messages[0].type") == "voice" ? (
            _.get(props, "channel.messages[0].content") == "missed" ? (
              "Bỏ lỡ cuộc gọi"
            ) : (
              "Cuộc gọi kết thúc "
            )
          ) : (
            <>{_.get(props, "channel.messages[0].content")}</>
          )}
        </p>
      </div>
    </div>
  );
}

const MessageSTP = (state) => {
  return { view: state.view, friends: state.user.friends };
};

const MessageReduxed = connect(MessageSTP)(Message);

export default MessageReduxed;
