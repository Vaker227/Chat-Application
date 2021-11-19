import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import AddGroupUser from "./add-group-user.jsx";
import UserServices from "../../services/user.service";
import ChannelServices from "../../services/channel.service";

function CreateGroupModal(props) {
  const [searchList, setSearchList] = useState([]);
  const [groupName, setGroupName] = useState("");
  useEffect(() => {
    if (!props.isShow) {
      setSearchList([]);
      setGroupName("");
    }
  }, [props.isShow]);
  const handleChangeGroupName = (e) => {
    setGroupName(e.target.value);
  };
  const createGroup = () => {
    ChannelServices.createGroup({ title: groupName }).then(() => {
      props.turnOff();
    });
  };
  const listFriends = useMemo(() => {
    if (!searchList.length) {
      return <p>No friend yet!</p>;
    }
    return searchList.map((user, inx) => (
      <AddGroupUser user={user} key={inx} />
    ));
  }, [searchList]);
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
            placeholder="Nguyễn Văn A"
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

export default CreateGroupModal;
