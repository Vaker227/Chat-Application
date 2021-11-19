import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";

import ChatMessage from "./ChatMessage.jsx";
import helper from "../../../helper";
import ChannelServices from "../../services/channel.service";
import ChannelCard from "./channel-card.jsx";

function ChatHistory(props) {
  const [isTop, setIsTop] = useState(false);
  const view = useMemo(() => {
    let last = {};
    return props.messages.map((v, i) => {
      if (v.content == "top") {
        setIsTop(true);
        return (
          <div
            key={i}
            className="mx-auto pb-5"
            style={{ pointerEvents: "none" }}
          >
            <ChannelCard channel={props.channel} />
          </div>
        );
      }
      v.space = true;
      if (v.sendBy == props.user._id) {
        v.me = true;
      }
      if (last.me == v.me) {
        v.space = false;
      }
      last = v;
      return <ChatMessage key={i} messageInfo={v} />;
    });
  }, [props.messages]);
  useEffect(() => {
    helper.scrollToBottomById("chat-history");
    props.setLoadHistory(false);
  }, [props.channel._id]);

  const handleScroll = (e) => {
    const top = e.target.scrollHeight - e.target.offsetHeight - 30;
    const scrollnow = -e.target.scrollTop;
    if (scrollnow >= top && !props.status.loadHistory) {
      ChannelServices.loadOlderHistory(
        props.channel._id,
        props.messages[props.messages.length - 1].time
      );
      props.setLoadHistory(true);
    }
  };
  return (
    <div
      id="chat-history"
      className="p-3 pb-4 d-flex flex-column-reverse justify-content-start h-100"
      onScroll={handleScroll}
    >
      {view}
      {props.status.loadHistory && !isTop ? (
        <div className="text-center mb-5 fw-light">Loading...</div>
      ) : null}
    </div>
  );
}

const ChatHistorySTP = (state) => {
  return {
    user: state.user,
    status: state.status,
    view: state.view,
    messages: state.channels.currentHistory,
  };
};

const ChatHistoryDTP = (dispatch) => {
  return {
    setLoadHistory: function (isLoad) {
      return dispatch({ type: "SET_LOAD_HISTORY", data: isLoad });
    },
  };
};

const ChatHistoryReduxed = connect(ChatHistorySTP, ChatHistoryDTP)(ChatHistory);

export default ChatHistoryReduxed;
