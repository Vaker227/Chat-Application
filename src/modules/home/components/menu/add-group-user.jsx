import React, { useState } from "react";
import { Button } from "react-bootstrap";

import Avatar from "../common/avatar.jsx";

function AddGroupUser(props) {
  const handleSelect = (setSelect) => {
    props.onSelect(props.user._id, setSelect);
  };
  return (
    <div className="d-flex search-user">
      <Avatar
        className="align-self-center"
        width="45"
        height="45"
        src="../../../mushroom.png"
      />
      <div className="flex-fill">
        <p className={`fw-bold ${props.isSelected ? "text-primary" : ""}`}>
          {props.user.name}
        </p>
      </div>
      <div className="align-self-center">
        {props.isSelected ? (
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => handleSelect(false)}
          >
            Hủy
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline-success"
            onClick={() => handleSelect(true)}
          >
            Thêm
          </Button>
        )}
      </div>
    </div>
  );
}

export default AddGroupUser;
