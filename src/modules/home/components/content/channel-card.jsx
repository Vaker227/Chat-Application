import React from "react";
import { Card } from "react-bootstrap";
import { connect } from "react-redux";

import Avatar from "../common/avatar.jsx";

function ChannelCard(props) {
  return (
    <Card
      className="group-card my-2"
      style={{ width: "10rem" }}
      onClick={() => props.setChannel(props.channel._id)}
    >
      <div className="d-flex justify-content-center">
        <Avatar src="../../../mushroom.png" width="70" height="70" />
      </div>
      <Card.Body>
        <Card.Title className="text-center">{props.channel.title}</Card.Title>
        <Card.Text className="text-center">
          {props.channel.participants.length} thành viên
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

const ChannelCardDTP = (dispatch) => {
  return {
    setChannel: function (channelId) {
      return dispatch({ type: "CHANGE_CHANNEL", data: channelId });
    },
  };
};

const ChannelCardReduxed = connect(null, ChannelCardDTP)(ChannelCard);

export default ChannelCardReduxed;
