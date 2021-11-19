import React from "react";
import { Button } from "react-bootstrap";

import Avatar from "../common/avatar.jsx";

import UserServices from "../../services/user.service";

function FriendRequest(props) {
  const handleAccept = () => {
    UserServices.responseFriendRequest(true, props.request);
  };
  const handleReject = () => {
    UserServices.responseFriendRequest(false, props.request);
  };
  return (
    <div className={`d-flex p-2 bg-light message`}>
      <div className="w-10">
        <Avatar
          src="../../../mushroom.png"
          width="70"
          height="70"
          className="mx-auto"
        />
      </div>
      <div>
        <p className={`title fs-5 `}>{props.request.detail.sendBy.name}</p>
      </div>
      <div className="ms-auto d-flex align-items-center ">
        <Button
          variant="outline-success"
          className="mx-1"
          onClick={handleAccept}
        >
          <i className="fas fa-check"></i>
        </Button>
        <Button
          variant="outline-danger"
          className="mx-1"
          onClick={handleReject}
        >
          <i className="fas fa-times"></i>
        </Button>
      </div>
    </div>
  );
}

export default FriendRequest;
