import React from "react";

import MessagesList from "./messages-list.jsx";
import Search from "./search.jsx";

function Menu({ className, ...props }) {
  return (
    <div id="menu" className={className}>
      <Search />
      <MessagesList />
    </div>
  );
}

export default Menu;
