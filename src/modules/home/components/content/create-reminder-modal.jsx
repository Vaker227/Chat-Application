import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";

import ChannelServices from "../../services/channel.service";

function CreateReminderModal(props) {
  const [content, setContent] = useState("");
  const [time, setTime] = useState(moment().format("YYYY-MM-DDTHH:mm"));
  useEffect(() => {
    if (props.isShow) {
      setContent("");
      setTime(moment().format("YYYY-MM-DDTHH:mm"));
      console.log(props.channel._id);
    }
  }, [props.isShow]);
  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };
  const handleChangeTime = (e) => {
    setTime(e.target.value);
  };
  const handleCreateReminder = () => {
    if (content == "") {
      return;
    }
    ChannelServices.createReminder(props.channel._id, time, content);
    props.turnOff();
  };
  return (
    <Modal
      size="sm"
      dialogClassName="mt-5"
      show={props.isShow}
      onHide={props.turnOff}
    >
      <Modal.Header closeButton>
        <p className="fs-5 fw-bold">Tạo lời nhắc</p>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Button variant="outline-danger" className="fw-bold" disabled>
            Hạn
          </Button>
          <input
            type="datetime-local"
            className="my-2"
            style={{ borderStyle: "solid" }}
            value={time}
            onChange={handleChangeTime}
          />
          <Button variant="outline-secondary" className="fw-bold" disabled>
            Nội dung
          </Button>
          <textarea
            value={content}
            onChange={handleChangeContent}
            style={{ height: "35vh", resize: "none" }}
            className="w-100 my-2"
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.turnOff}>
          Hủy
        </Button>
        <Button variant="success" onClick={handleCreateReminder}>
          Tạo
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const CreateReminderModalSTP = (state) => {
  return { isShow: state.view.createReminderModal };
};
const CreateReminderModalDTP = (dispatch) => {
  return {
    turnOff: function () {
      return dispatch({ type: "TOGGLE_CREATE_REMINDER_MODAL", data: false });
    },
  };
};
const CreateReminderModalReduxed = connect(
  CreateReminderModalSTP,
  CreateReminderModalDTP
)(CreateReminderModal);

export default CreateReminderModalReduxed;
