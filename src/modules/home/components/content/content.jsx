import React from "react";

import ChatBox from "./chat-box.jsx";

function Content({ className, ...props }) {
  return (
    <div id="content" className={className}>
      <ChatBox />
    </div>
  );
}

export default Content;
