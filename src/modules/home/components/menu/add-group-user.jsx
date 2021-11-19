import React, { useState } from "react";
import { Button } from "react-bootstrap";

import Avatar from "../common/avatar.jsx";

function AddGroupUser(props) {
  return (
    <div className="d-flex search-user">
      <Avatar
        className="align-self-center"
        width="45"
        height="45"
        src="../../../mushroom.png"
      />
      <div className="flex-fill">
        <p className="fw-bold">{props.user.name}</p>
      </div>
      <div className="align-self-center">
        <Button size="sm" variant="outline-success">
          Thêm
        </Button>
      </div>
    </div>
  );
}

export default AddGroupUser;
