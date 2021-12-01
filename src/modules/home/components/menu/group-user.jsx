import React, { useState } from "react";
import { Button } from "react-bootstrap";

import Avatar from "../common/avatar.jsx";

function GroupUser(props) {
  const handleSelect = (setSelect) => {
    props.onSelect(props.user, setSelect);
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
        <p
          className={`fw-bold ${
            props.isSelected && props.add
              ? "text-primary"
              : props.isSelected && props.remove
              ? "text-danger"
              : ""
          }`}
        >
          {props.user.name}
        </p>
      </div>
      <div className="align-self-center">
        {props.add ? (
          <>
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
          </>
        ) : (
          <>
            {props.isSelected ? (
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => handleSelect(false)}
              >
                Hủy
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleSelect(true)}
              >
                Xóa
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GroupUser;
