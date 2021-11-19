import React, { useMemo } from "react";

import Avatar from "../common/avatar.jsx";
import _ from "lodash";
import { connect } from "react-redux";

function Contact(props) {
  const title = useMemo(() => {
    return props.target.title ? props.target.title : props.target.user.name;
  }, [props.target]);
  const isActive = useMemo(() => {
    return props.view.content == props.target._id;
  }, [props.view.content]);
  return (
    <div
      className={`d-flex p-2 bg-light message ${isActive ? "active" : ""}`}
      onClick={props.onClick}
    >
      <div className="w-10">
        <Avatar
          src="../../../mushroom.png"
          width="56"
          height="56"
          className="mx-auto"
        />
      </div>
      <div className="d-flex ms-2 align-items-center">
        <p className={`title fw-bold`}>{title}</p>
      </div>
    </div>
  );
}

const ContactSTP = (state) => {
  return { view: state.view };
};

const ContactReduxed = connect(ContactSTP)(Contact);

export default ContactReduxed;
