import React, { useEffect, useState } from "react";
import { Modal, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";

import helper from "../../../helper";
import ChannelServices from "../../services/channel.service";
import ReminderServices from "../../services/reminder.service";

function DetailReminderModal(props) {
  const [content, setContent] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [isModified, setIsModified] = useState(false);
  useEffect(() => {
    if (props.reminder) {
      console.log(props.reminder);
      setContent(props.reminder.content);
      setTime(moment(props.reminder.due).format("YYYY-MM-DDTHH:mm"));
      setStatus(props.reminder.status);
      setIsModified(false);
    }
  }, [props.reminder]);
  const handleChangeContent = (e) => {
    if (!isModified) {
      setIsModified(true);
    }
    setContent(e.target.value);
  };
  const handleChangeTime = (e) => {
    if (!isModified) {
      setIsModified(true);
    }
    setTime(e.target.value);
  };
  const handleChangeStatus = (e) => {
    if (!isModified) {
      setIsModified(true);
    }
    setStatus(e.currentTarget.value);
  };
  const handleUpdateReminder = () => {
    const reminder = {
      _id: props.reminder._id,
      channel: props.reminder.channel,
      content: content,
      due: time,
      status: status,
    };
    ReminderServices.updateReminder(reminder);
    props.turnOff();
  };
  //   console.log()
  return (
    <Modal
      size="sm"
      dialogClassName="mt-5"
      show={props.reminder}
      onHide={props.turnOff}
    >
      <Modal.Header closeButton>
        <p className="fs-5 fw-bold">Lời nhắc</p>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Button variant="outline-danger" className="fw-bold mb-2" disabled>
            Hạn
          </Button>
          <input
            type="datetime-local"
            className={`${status == "outdated" ? "border-danger" : ""}`}
            style={{ borderStyle: "solid" }}
            value={time}
            onChange={handleChangeTime}
          />
          <Button variant="outline-dark" className="fw-bold my-2" disabled>
            Trạng thái
          </Button>
          <ButtonGroup>
            <ToggleButton
              className="p-2"
              type="radio"
              id={`radio-created`}
              variant={"outline-primary"}
              value="created"
              checked={status != "finished" && !helper.checkOutdated(time)}
              onChange={handleChangeStatus}
            >
              Tiến hành
            </ToggleButton>
            <ToggleButton
              className="p-2"
              type="radio"
              id={`radio-finished`}
              variant={"outline-success"}
              value="finished"
              checked={status == "finished"}
              //   onChange={() => console.log("created")}
              onChange={handleChangeStatus}
            >
              Hoàn thành
            </ToggleButton>
            <ToggleButton
              disabled
              className="p-2"
              id={`radio-outdated`}
              type="radio"
              variant={"outline-danger"}
              value="outdated"
              checked={status != "finished" && helper.checkOutdated(time)}
              onChange={handleChangeStatus}
            >
              Quá hạn
            </ToggleButton>
          </ButtonGroup>
          <Button variant="outline-dark" className="fw-bold my-2" disabled>
            Nội dung
          </Button>
          <textarea
            value={content}
            onChange={handleChangeContent}
            className="w-100"
            style={{ height: "20vh", resize: "none" }}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!isModified} variant="secondary">
          Hủy
        </Button>
        <Button
          disabled={!isModified}
          variant="primary"
          onClick={handleUpdateReminder}
        >
          Sửa
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const DetailReminderModalSTP = (state) => {
  return { reminder: state.view.detailReminder };
};
const DetailReminderModalDTP = (dispatch) => {
  return {
    turnOff: function () {
      return dispatch({ type: "TOGGLE_DETAIL_REMINDER_MODAL", data: null });
    },
  };
};
const DetailReminderModalReduxed = connect(
  DetailReminderModalSTP,
  DetailReminderModalDTP
)(DetailReminderModal);

export default DetailReminderModalReduxed;
