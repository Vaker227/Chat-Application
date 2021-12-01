import React, { useEffect, useMemo, useState } from "react";
import { Stack, OverlayTrigger, Popover } from "react-bootstrap";
import { connect } from "react-redux";

import Avatar from "../common/avatar.jsx";
import UserService from "../../services/user.service";
import ModalProfile from "../common/modal-profile.jsx";
import Profile from "../common/profile.jsx";
import helper from "../../../helper";

const settingOverlay = (props) => {
  const handleLogout = () => {
    if (window.electron) {
      window.electron.logOut();
    }
  };
  return (
    <Popover {...props}>
      <Popover.Body className="p-0">
        <div>
          <p className="setting-option" onClick={handleLogout}>
            Đăng xuất
          </p>
        </div>
      </Popover.Body>
    </Popover>
  );
};
function SideBar(props) {
  const [myProfileModal, setMyProfileModal] = useState(false);
  useEffect(() => {
    window.getInfo = () => {
      UserService.getInfo().then((result) => console.log(result));
    };
  }, []);
  const showMyProfileModal = () => {
    setMyProfileModal(true);
  };
  const closeMyProfileModal = () => {
    setMyProfileModal(false);
  };
  const handleSetMenu = (e) => {
    let att;
    if (e.target.tagName == "I") {
      att = e.target.parentNode.getAttribute("data-menu");
    } else {
      att = e.target.getAttribute("data-menu");
    }
    props.setMenu(att);
  };
  return (
    <div id="sidebar" className="float-start h-100">
      <Stack gap={1} className="py-3 bg-primary h-100">
        <div
          className="mx-auto mb-3"
          style={{ cursor: "pointer" }}
          onClick={showMyProfileModal}
        >
          <Avatar
            src={helper.getImg("image/mushroom.png")}
            width="50"
            height="50"
          />
        </div>
        <div
          className="sidebar-btn "
          data-menu="converstation"
          onClick={handleSetMenu}
        >
          <i className="far fa-comment-alt" title="Tin nhắn"></i>
        </div>
        <div
          className="sidebar-btn mb-auto"
          data-menu="contacts"
          onClick={handleSetMenu}
        >
          <i className="far fa-address-book" title="Danh bạ"></i>
        </div>
        <OverlayTrigger
          trigger="click"
          placement="top-end"
          overlay={settingOverlay}
        >
          <div className="sidebar-btn">
            <i className="fas fa-cog"></i>
          </div>
        </OverlayTrigger>
      </Stack>
      <ModalProfile
        show={myProfileModal}
        handleClose={closeMyProfileModal}
        title="Thông tin cá nhân"
      >
        <Profile me target={props.user} handleClose={closeMyProfileModal} />
      </ModalProfile>
    </div>
  );
}

const SideBarSTP = (state) => {
  return { user: state.user };
};
const SideBarDTP = (dispatch) => {
  return {
    setMenu: function (menu) {
      return dispatch({ type: "CHANGE_MENU", data: menu });
    },
  };
};
const SideBarReduxed = connect(SideBarSTP, SideBarDTP)(SideBar);

export default SideBarReduxed;
