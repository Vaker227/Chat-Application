import React from "react";

import Avatar from "../common/avatar.jsx";

function ContentView(props) {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100%", position: "relative" }}
    >
      <div className="content-header d-flex p-2 justify-content-between bg-light align-items-center border-bottom">
        <div className="d-flex">
          <Avatar src="../../../mushroom.png" width="50" height="50" />
          <div className="d-flex align-items-center">
            <p className="fs-5 fw-bold">{props.title}</p>
          </div>
        </div>
      </div>
      <div className="h-100 content-view" style={{ backgroundColor: "#f3f3f3" }}>
        {props.children}
      </div>
    </div>
  );
}

export default ContentView;
