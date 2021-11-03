import React from "react";
import { Container } from "react-bootstrap";

import Message from "./message.jsx";

function MessagesList() {
  return (
    <div id="message-list" className="mt-3">
      <div>
        <Message unread />
        <Message active/>
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
      </div>
    </div>
  );
}

export default MessagesList;
