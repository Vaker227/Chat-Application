import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import Profile from "../common/profile.jsx";
import SearchUser from "./search-user.jsx";
import UserServices from "../../services/user.service";

function SearchModal(props) {
  const [searchList, setSearchList] = useState([]);
  const [searchPattern, setSearchPattern] = useState("");
  const [isViewDetail, setIsViewDetail] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState("");
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
  const handleViewDetail = (target) => {
    setCurrentUserDetail(target);
    setIsViewDetail(true);
  };
  const handleReturn = (e) => {
    setIsViewDetail(false);
  };
  const listUser = useMemo(() => {
    return searchList.map((user, inx) => (
      <SearchUser target={user} key={inx} viewDetail={handleViewDetail} />
    ));
  }, [searchList]);
  return (
    <Modal
      size={isViewDetail ? "" : "sm"}
      show={props.isShow}
      onHide={props.turnOff}
      dialogClassName={`${isViewDetail ? "profile" : ""}`}
    >
      <Modal.Header closeButton>
        <p
          className="fs-5 fw-bold btn"
          onClick={isViewDetail ? handleReturn : null}
        >
          {isViewDetail ? (
            <i className="fas fa-chevron-left me-2 fs-6"></i>
          ) : (
            " "
          )}
          Thêm bạn
        </p>
      </Modal.Header>
      <Modal.Body
        className={isViewDetail ? "p-0 d-flex flex-column" : ""}
        style={isViewDetail ? { maxHeight: "88%" } : {}}
      >
        {isViewDetail ? (
          <Profile target={currentUserDetail} />
        ) : (
          <>
            <div>
              <Button variant="outline-success" disabled>
                Nhập tên
              </Button>
              <input
                type="text"
                className="custom-input"
                placeholder="Nguyễn Văn A"
                value={searchPattern}
                onChange={handleChangePattern}
              />
            </div>
            <div className="pt-3" id="search-name-result">
              {listUser}
            </div>
          </>
        )}
      </Modal.Body>
      {isViewDetail ? (
        ""
      ) : (
        <Modal.Footer>
          <Button variant="secondary" onClick={props.turnOff}>
            Hủy
          </Button>
          <Button variant="primary" onClick={searchUsers}>
            Tìm kiếm
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default SearchModal;
