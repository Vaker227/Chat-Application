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
  return (
    <div id="content" className={className}>
      {currentChannel ? (
        <ChatBox channel={currentChannel} />
      ) : props.view.content == "group-list" ? (
        <ContentView title="Danh sách nhóm">
          <GroupList
            list={[
              { title: "title1", participants: [1, 2, 3] },
              { title: "title12", participants: [1, 3] },
              { title: "title132", participants: [1, 3, 5, 6, 4, 54, 7] },
              { title: "title132", participants: [1, 3, 5, 6, 4, 54, 7] },
              { title: "title132", participants: [1, 3, 5, 6, 4, 54, 7] },
            ]}
          />
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
