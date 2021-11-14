import React from "react";

import ChatMessage from "./ChatMessage.jsx";

const arr = [
  { me: false,time: new Date(),user:'Linh', content:'noi dung tin nhaasd asd an' },
  { me: true,time: new Date(),user:'Linh', content:'noi dung tin nhan' },
  { me: false,time: new Date(),user:'Linh', content:'noi dung tin nh asdas ddddan' },
  { me: false,time: new Date(),user:'Linh', content:'noi dung tin nhan' },
  { me: true,time: new Date(),user:'Linh', content:'noi dungtinnhanddddddddddddd' },
  { me: false,time: new Date(),user:'Linh', content:'noi ' },
  { me: false,time: new Date(),user:'Linh', content:'noi dung tin nhan' },
];

function ChatHistory() {
  let last = {};
  const view = arr.map((v, i) => {
    v.space = true;
    if (last.me == v.me) {
      v.space = false;
    }
    last = v;
    return <ChatMessage key={i} messageInfo={v} />;
  });
  return (
    <div id="chat-history" className="p-3">
      {view}
    </div>
  );
}

export default ChatHistory;
