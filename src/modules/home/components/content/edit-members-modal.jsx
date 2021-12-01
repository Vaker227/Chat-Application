import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";

import GroupUser from "../menu/group-user.jsx";
import ChannelServices from "../../services/channel.service";

function EditMembersModal(props) {
  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    if (!props.isShow) {
      setParticipants([]);
    }
  }, [props.isShow]);

  const handleSelect = (user, isSelected) => {
    if (isSelected) {
      setParticipants(_.uniq([...participants, user]));
    } else {
      setParticipants(
        _.remove((participant) => {
          return participant == user;
        })
      );
    }
  };
  const handleAddMember = () => {
    ChannelServices.addMembers({
      targets: participants,
      channelId: props.channel._id,
    });
    props.turnOff();
  };
  const handleRemoveMember = () => {
    ChannelServices.removeMembers({
      targets: participants,
      channelId: props.channel._id,
    });
    props.turnOff();
  };
  const listFriends = useMemo(() => {
    if (props.add) {
      if (!props.friendMaps || !props.friendMaps.length) {
        return <p>No friend yet!</p>;
      }
      const friendList = props.friendMaps.filter((friendMap) => {
        return !props.channel.participants.includes(friendMap.user._id);
      });
      if (!friendList.length) {
        return <p>No available friends yet!</p>;
      }

      return friendList.map((friendMap) => {
        return (
          <GroupUser
            add
            isSelected={participants.includes(friendMap.user)}
            onSelect={handleSelect}
            user={friendMap.user}
            key={friendMap.user._id || friendMap.user}
          />
        );
      });
    }
    if (props.remove) {
      if (!props.channel.detailParticipants) {
        return <p>No members yet!</p>;
      }
      const memberList = props.channel.detailParticipants.filter((member) => {
        return member._id != props.user._id;
      });
      if (!memberList.length) {
        return <p>No members to remove yet!</p>;
      }
      return memberList.map((member) => {
        return (
          <GroupUser
            remove
            isSelected={participants.includes(member)}
            onSelect={handleSelect}
            user={member}
            key={member._id}
          />
        );
      });
    }
  }, [
    props.friendMaps,
    participants,
    props.channel.detailParticipants,
    props.add,
  ]);
  return (
    <Modal size="sm" show={props.isShow} onHide={props.turnOff}>
      <Modal.Header closeButton>
        <p className="fs-5 fw-bold btn">
          {props.add ? "Thêm" : "Xóa"} thành viên
        </p>
      </Modal.Header>
      <Modal.Body>
        <div className="pt-3" id="search-name-result">
          {listFriends}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.turnOff}>
          Hủy
        </Button>
        {props.add && (
          <Button variant="primary" onClick={handleAddMember}>
            Thêm
          </Button>
        )}
        {props.remove && (
          <Button variant="danger" onClick={handleRemoveMember}>
            Xóa
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

const EditMembersModalSTP = (state) => {
  return { friendMaps: state.user.friends, user: state.user };
};

const EditMembersModalReduxed = connect(EditMembersModalSTP)(EditMembersModal);

export default EditMembersModalReduxed;
