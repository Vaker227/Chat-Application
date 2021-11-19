import React, { useState } from "react";
import { Button } from "react-bootstrap";

import Avatar from "../common/avatar.jsx";
import UserServices from "../../services/user.service";

function SearchUser(props) {
  const [haveSentRequest, setHaveSentReqeust] = useState(false);
  const handleAddFriend = () => {
    UserServices.requestFriend(props.target._id).then((res) => {
      console.log(res);
      setHaveSentReqeust(true);
    });
  };
  return (
    <div className="d-flex search-user">
      <Avatar
        className="align-self-center"
        width="45"
        height="45"
        src="../../../mushroom.png"
      />
      <div
        className="flex-fill"
        onClick={() => {
          props.viewDetail(props.target);
        }}
      >
        <p className="fw-bold">{props.target.name}</p>
        <p className="fw-light">Có {props.target.friends.length} người bạn</p>
      </div>
      <div className="align-self-center">
        <Button
          size="sm"
          variant={!haveSentRequest ? "outline-primary" : "primary"}
          onClick={!haveSentRequest ? handleAddFriend : null}
        >
          {!haveSentRequest ? "Kết bạn" : "Đã gửi"}
        </Button>
      </div>
    </div>
  );
}

export default SearchUser;
