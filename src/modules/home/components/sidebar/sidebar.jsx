import React, { useEffect } from "react";
import { Stack, Button, Image } from "react-bootstrap";

import Avatar from "../common/avatar.jsx";
import UserService from "../../services/user.service";

function SideBar() {
  useEffect(() => {
    window.getInfo = () => {
      UserService.getInfo().then((result) => console.log(result));
    };
  },[]);
  return (
    <div id="sidebar" className="float-start h-100">
      <Stack gap={3} className="py-3 bg-primary h-100">
        <Avatar
          src="../../../mushroom.png"
          width="50"
          height="50"
          className="mx-auto"
        />
        <div className="sidebar-btn mb-auto">
          <i className="far fa-comment-alt"></i>
        </div>
        <div className="sidebar-btn">
          <i className="fas fa-cog"></i>
        </div>
      </Stack>
    </div>
  );
}

export default SideBar;
