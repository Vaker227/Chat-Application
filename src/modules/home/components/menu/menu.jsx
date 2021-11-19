import React, { useEffect } from "react";
import { connect } from "react-redux";

import MessagesList from "./messages-list.jsx";
import ContactsList from "./contacts-list.jsx";
import Search from "./search.jsx";

function Menu({ className, ...props }) {
  return (
    <div id="menu" className={className}>
      <Search />
      {props.view.menu == "converstation" ? <MessagesList /> : <ContactsList />}
    </div>
  );
}

const MenuSTP = (state) => {
  return {
    view: state.view,
  };
};

const MenuReduxed = connect(MenuSTP)(Menu);

export default MenuReduxed;
