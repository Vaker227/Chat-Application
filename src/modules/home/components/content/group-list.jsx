import React, { useMemo } from "react";
import { Card } from "react-bootstrap";

import ChannelCard from "./channel-card.jsx";

function GroupList(props) {
  console.log(props.list);
  const listGroup = useMemo(() => {
    return props.list.map((group, inx) => (
      <ChannelCard key={inx} channel={group} />
    ));
  }, [props.list]);
  return (
    <div className="pt-3 d-flex justify-content-around flex-wrap">
      {listGroup}
    </div>
  );
}

export default GroupList;
