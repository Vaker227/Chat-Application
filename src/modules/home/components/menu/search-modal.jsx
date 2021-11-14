import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import SearchUser from "./search-user.jsx";
import UserServices from "../../services/user.service";

function SearchModal(props) {
  const [searchList, setSearchList] = useState([]);
  const [searchPattern, setSearchPattern] = useState("");
  useEffect(() => {
    if (!props.isShow) {
      setSearchList([]);
      setSearchPattern("");
    }
  }, [props.isShow]);
  const handleChangePattern = (e) => {
    setSearchPattern(e.target.value);
  };
  const searchUsers = () => {
    UserServices.findUsers(searchPattern).then((res) => {
      setSearchList(res.data);
    });
  };
  const listUser = useMemo(() => {
    return searchList.map((user, inx) => <SearchUser user={user} key={inx} />);
  }, [searchList]);
  return (
    <Modal size="sm" show={props.isShow} onHide={props.turnOff}>
      <Modal.Header closeButton>
        <p className="fs-5 fw-bold"> Thêm bạn</p>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Button variant="outline-success" disabled>
            Nhập tên
          </Button>
          <input
            type="text"
            id="search-modal-name"
            placeholder="Nguyễn Văn A"
            value={searchPattern}
            onChange={handleChangePattern}
          />
        </div>
        <div className="pt-3" id="search-name-result">
          {listUser}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.turnOff}>
          Hủy
        </Button>
        <Button variant="primary" onClick={searchUsers}>
          Tìm kiếm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SearchModal;
