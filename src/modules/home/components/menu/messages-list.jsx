import React, { useMemo } from "react";
import { connect } from "react-redux";

import Message from "./message.jsx";

function MessagesList(props) {
  const channelList = useMemo(() => {
    return props.channels.map((channel, inx) => {
      return (
        <Message
          key={inx}
          channel={channel}
          onClick={() => props.setChannel(channel._id)}
        />
      );
    });
  }, [props.channels]);
  return (
    <div id="message-list" className="menu-content mt-3 border-top">
      <div>{channelList}</div>
    </div>
  );
}

const MessagesListSTP = (state) => {
  return { channels: state.channels.list };
};
const MessagesListDTP = (dispatch) => {
  return {
    setChannel: function (channelId) {
      return dispatch({ type: "CHANGE_CHANNEL", data: channelId });
    },
  };
};

const MessagesListReduxed = connect(
  MessagesListSTP,
  MessagesListDTP
)(MessagesList);

export default MessagesListReduxed;
