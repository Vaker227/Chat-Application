import React from "react";

import Avatar from "../common/avatar.jsx";

function Message(props) {
  return (
    <div
      className={`d-flex p-2 bg-light message ${props.active ? "active" : ""}`}
      lasttime="5s"
    >
      <div className="w-10">
        <Avatar
          src="../../../mushroom.png"
          width="56"
          height="56"
          className="mx-auto"
        />
      </div>
      <div>
        <p
          className={`title fs-5 ${props.unread ? "fw-bold" : ""}`}
          lastime="5s"
        >
          Zulu
        </p>
        <p className={`${props.unread ? "fw-bold" : ""}`}>Hello</p>
      </div>
    </div>
  );
}

export default Message;
