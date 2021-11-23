import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import _ from "lodash";

import AddGroupUser from "./add-group-user.jsx";
import UserServices from "../../services/user.service";
import ChannelServices from "../../services/channel.service";

function CreateGroupModal(props) {
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    if (!props.isShow) {
      setGroupName("");
    }
  }, [props.isShow]);
  const handleChangeGroupName = (e) => {
    setGroupName(e.target.value);
  };
  const handleSelect = (userId, isSelected) => {
    if (isSelected) {
      participants.push(userId);
      setParticipants(_.uniq(participants));
    } else {
      setParticipants(
        _.remove((participant) => {
          return participant == userId;
        })
      );
    }
  };
  const createGroup = () => {
    ChannelServices.createGroup({
      title: groupName,
      participants,
    }).then(() => {
      props.turnOff();
    });
  };
  const listFriends = useMemo(() => {
    if (!props.friendMaps || !props.friendMaps.length) {
      return <p>No friend yet!</p>;
    }
    return props.friendMaps.map((friendMap) => (
      <AddGroupUser
        isSelected={participants.includes(friendMap.user._id)}
        onSelect={handleSelect}
        user={friendMap.user}
        key={friendMap.user._id || friendMap.user}
      />
    ));
  }, [props.friendMaps, participants]);
  return (
    <Modal show={props.isShow} onHide={props.turnOff}>
      <Modal.Header closeButton>
        <p className="fs-5 fw-bold"> Tạo nhóm mới</p>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Button variant="outline-success" disabled>
            Tên nhóm
          </Button>
          <input
            type="text"
            className="custom-input"
            placeholder="Nhóm A..."
            value={groupName}
            onChange={handleChangeGroupName}
          />
        </div>
        <div className="pt-3" id="search-name-result">
          {listFriends}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.turnOff}>
          Hủy
        </Button>
        <Button variant="primary" onClick={createGroup}>
          Tạo nhóm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const CreateGroupModalSTP = (state) => {
  return {
    friendMaps: state.user.friends,
  };
};
const CreateGroupModalReduxed = connect(CreateGroupModalSTP)(CreateGroupModal);

export default CreateGroupModalReduxed;
