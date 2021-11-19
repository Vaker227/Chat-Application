import React, { useMemo } from "react";
import { Accordion, Button } from "react-bootstrap";

import FriendRequest from "./friend-request.jsx";

function NotiList(props) {
  const listFriendRequest = useMemo(() => {
    const friendRequests = props.notifications.filter((noti) => {
      return noti.detail.type === "request-friend";
    });
    return friendRequests.map((request, inx) => (
      <FriendRequest request={request} key={inx} />
    ));
  }, [props.notifications]);
  return (
    <div>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Lời mời kết bạn</Accordion.Header>
          <Accordion.Body className="p-0">{listFriendRequest}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default NotiList;
