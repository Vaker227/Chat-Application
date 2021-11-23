import React, { useMemo } from "react";
import { connect } from "react-redux";

import ChatBox from "./chat-box.jsx";
import ContentView from "./content-view.jsx";
import GroupList from "./group-list.jsx";
import NotiList from "./noti-list.jsx";

function Content({ className, ...props }) {
  const currentChannel = useMemo(() => {
    return props.channels.list.find(
      (channel) => channel._id == props.view.content
    );
  }, [props.view.content]);
  const listGroup = useMemo(() => {
    return props.channels.list.filter((channel) => {
      return channel.type == "group";
    });
  }, [props.channels.list]);
  return (
    <div id="content" className={className}>
      {currentChannel ? (
        <ChatBox channel={currentChannel} />
      ) : props.view.content == "group-list" ? (
        <ContentView title="Danh sách nhóm">
          <GroupList list={listGroup} />
        </ContentView>
      ) : props.view.content == "noti-list" ? (
        <ContentView title="Thông báo">
          <NotiList notifications={props.notifications} />
        </ContentView>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
}

const ContentSTP = (state) => {
  return {
    channels: state.channels,
    view: state.view,
    notifications: state.notifications.list,
  };
};
const ContentReduxed = connect(ContentSTP)(Content);

export default ContentReduxed;
