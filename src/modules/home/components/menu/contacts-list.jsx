import React, { useMemo } from "react";
import { connect } from "react-redux";
import { Accordion } from "react-bootstrap";

import Contact from "./contact.jsx";

function ContactsList(props) {
  const friendList = useMemo(() => {
    return props.friendMaps.map((friendMap, inx) => (
      <Contact
        key={inx}
        target={friendMap}
        onClick={() => props.setChannel(friendMap.channel)}
      />
    ));
  }, [props.friends]);
  return (
    <div className="menu-content mt-3 border-top">
      <div
        className="py-2 border-bottom text-center"
        onClick={() => props.toggleSearchModal(true)}
      >
        <h5 className="text-btn text-primary ">
          <i className="fas fa-user-plus me-2"></i>Tìm kiếm bạn bằng tên
        </h5>
      </div>
      <div className="py-2 border-bottom text-center">
        <Contact
          target={{ title: "Thông báo", _id: "noti-list" }}
          onClick={() => props.setChannel("noti-list")}
        />
        <Contact
          target={{ title: "Danh sách nhóm", _id: "group-list" }}
          onClick={() => props.setChannel("group-list")}
        />
      </div>
      <div>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Bạn bè</Accordion.Header>
            <Accordion.Body className="p-0">{friendList}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

const ContactsListSTP = (state) => {
  return { channel: state.channels, friendMaps: state.user.friends };
};
const ContactsListDTP = (dispatch) => {
  return {
    setChannel: function (content) {
      return dispatch({ type: "CHANGE_CHANNEL", data: content });
    },
    toggleSearchModal: function (value) {
      return dispatch({ type: "TOGGLE_SEARCH_MODAL", data: value });
    },
  };
};

const ContactsListReduxed = connect(
  ContactsListSTP,
  ContactsListDTP
)(ContactsList);

export default ContactsListReduxed;
