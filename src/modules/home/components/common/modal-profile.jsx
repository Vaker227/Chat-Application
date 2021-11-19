import React from "react";

import { Modal, Button } from "react-bootstrap";

function ModalProfile(props) {
  return (
    <>
      <Modal
        dialogClassName="profile"
        show={props.show}
        onHide={props.handleClose}
      >
        <Modal.Header className="p-2" closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="p-0 d-flex flex-column"
          style={{ maxHeight: "88%" }}
        >
          {props.children}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalProfile;
