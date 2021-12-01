import React, { useEffect, useState, useMemo } from "react";
import {
  Offcanvas,
  Accordion,
  useAccordionButton,
  Button,
} from "react-bootstrap";
import moment from "moment";

import Avatar from "../common/avatar.jsx";
import EditMembersModal from "./edit-members-modal.jsx";
import ChannelServices from "../../services/channel.service";
import ReminderServices from "../../services/reminder.service";
import { connect } from "react-redux";

function CustomHeaderAccordion({ children, eventKey }) {
  const [expand, setExpand] = useState(false);
  const handleClick = useAccordionButton(eventKey, () => {
    setExpand(!expand);
  });
  return (
    <div className="d-flex justify-content-between btn" onClick={handleClick}>
      <div className="fw-bold ">{children}</div>
      <div>
        <i
          className="accordion-icon fas fa-chevron-down"
          style={{ transform: `rotate(${expand ? "90" : "0"}deg)` }}
        ></i>
      </div>
    </div>
  );
}

function ReminderPreview(props) {
  const handleClick = () => {
    props.openDetail(props.reminder);
  };
  return (
    <div className={`d-flex p-2 w-100 reminder-preview`} onClick={handleClick}>
      <div className="w-10">
        <Avatar
          src="../../../mushroom.png"
          width="40"
          height="40"
          className="mx-auto"
        />
      </div>
      <div style={{ width: "80%" }}>
        <div className="d-flex justify-content-between">
          <p className="fw-bold">{props.reminder.createdBy.name}</p>
          {props.reminder.status == "finished" ? (
            <p className="text-end fw-normal btn btn-outline-success py-0 px-1 fs-7">
              Hoàn thành
            </p>
          ) : props.reminder.status == "outdated" ? (
            <p className="text-end fw-normal btn btn-outline-danger py-0 px-1 fs-7">
              Quá hạn
            </p>
          ) : (
            <p className="text-end fw-normal btn btn-outline-primary py-0 px-1 fs-7">
              Tiến hành
            </p>
          )}
        </div>
        <div className="d-flex justify-content-between">
          <p className={`text-truncate w-50`}>{props.reminder.content}</p>
          <p
            className="fs-7"
            title={moment(props.reminder.due).format("DD-MM-YYYY HH:mm")}
          >
            {moment(props.reminder.due).format("HH:mm DD/MM")}
          </p>
        </div>
      </div>
    </div>
  );
}
const ReminderPreviewDTP = (dispatch) => {
  return {
    openDetail: function (reminder) {
      dispatch({
        type: "TOGGLE_DETAIL_REMINDER_MODAL",
        data: reminder,
      });
    },
  };
};
const ReminderPreviewDTPReduxed = connect(
  null,
  ReminderPreviewDTP
)(ReminderPreview);

function ChatInfo(props) {
  const [view, setView] = useState("default"); // default / members / memo
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [listReminder, setListReminder] = useState(null);

  const handleChangeReminderView = () => {
    setView("reminders");
    ReminderServices.getListReminderChannel(props.channel._id).then(
      (response) => {
        setListReminder(response.data);
      }
    );
  };

  const listReminderView = useMemo(() => {
    if (!listReminder) {
      return <h3>Đang tải</h3>;
    }
    if (!listReminder.length) {
      return <h3>Rỗng</h3>;
    }
    return listReminder.map((reminder) => {
      return (
        <ReminderPreviewDTPReduxed key={reminder._id} reminder={reminder} />
      );
    });
  }, [listReminder]);

  const listMembers = useMemo(() => {
    if (
      !props.channel.detailParticipants ||
      !props.channel.detailParticipants.length
    ) {
      ChannelServices.getDetailMembers(props.channel._id);
      return "Loading...";
    }
    return props.channel.detailParticipants.map((member) => {
      return (
        <div className={`d-flex p-2 w-100 member-preview`} key={member._id}>
          <div className="w-10">
            <Avatar
              src="../../../mushroom.png"
              width="40"
              height="40"
              className="mx-auto"
            />
          </div>
          <div style={{ width: "80%" }}>
            <p className={`title fs-5 text-truncate w-75`}>{member.name}</p>
          </div>
        </div>
      );
    });
  }, [props.channel.detailParticipants]);
  return (
    <Offcanvas
      show={props.canvas}
      onHide={props.turnOff}
      placement={"end"}
      style={{ width: 300, marginTop: 30 }}
    >
      {view == "default" ? (
        <>
          <div className="p-3 text-center fs-5 fw-bold border-bottom">
            Thông tin hội thoại
          </div>
          <div className="p-3 d-flex flex-column align-items-center border-bottom border-4">
            <Avatar src="../../../mushroom.png" width="50" height="50" />
            <div>
              <span className="fw-bold fs-4">
                {props.channel.title || props.userInfo.name}
              </span>
              <i
                className="text-btn far fa-edit ms-2"
                style={{ backgroundColor: "#0000000d" }}
              ></i>
            </div>
          </div>
          {props.channel.type == "group" && (
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey="0">
                <CustomHeaderAccordion eventKey="0">
                  Thành viên
                </CustomHeaderAccordion>
                <Accordion.Body className="pt-1">
                  <Button
                    variant="outline-dark"
                    className="w-100"
                    onClick={() => setView("members")}
                  >
                    <i className="fas fa-user-friends me-2"></i>
                    {props.channel.participants.length} thành viên
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
              <CustomHeaderAccordion eventKey="0">
                Ghi nhớ
              </CustomHeaderAccordion>
              <Accordion.Body>
                <Button
                  variant="outline-dark"
                  className="w-100"
                  onClick={handleChangeReminderView}
                >
                  <i className="fas fa-sticky-note me-2"></i>Danh sách ghi nhớ
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </>
      ) : view == "members" ? (
        <>
          <div
            className="p-3 fs-5 fw-bold border-bottom"
            style={{ cursor: "pointer" }}
            onClick={() => setView("default")}
          >
            <i className="fas fa-chevron-left ms-2 me-5 fs-6"></i>Thành viên
            nhóm
          </div>
          <div className="p-3 d-flex flex-column align-items-center border-bottom">
            <div
              className="text-btn text-primary fs-5 mb-1 border-bottom"
              onClick={props.showAddModal}
            >
              <i className="fs-5 fas fa-user-plus "></i> Thêm thành viên
            </div>
            <div
              className="text-btn text-danger fs-5"
              onClick={() => setShowRemoveModal(true)}
            >
              Xóa thành viên
            </div>
          </div>
          <p className="fw-bold py-3 text-center">
            Danh sách thành viên ({props.channel.participants.length})
          </p>
          {listMembers}
          <EditMembersModal
            remove
            channel={props.channel}
            isShow={showRemoveModal}
            turnOff={() => setShowRemoveModal(false)}
          />
        </>
      ) : view == "reminders" ? (
        <>
          <div
            className="p-3 fs-5 fw-bold border-bottom"
            style={{ cursor: "pointer" }}
            onClick={() => setView("default")}
          >
            <i className="fas fa-chevron-left ms-2 me-5 fs-6"></i>Danh sách ghi
            nhớ
          </div>
          {listReminderView}
        </>
      ) : (
        ""
      )}
    </Offcanvas>
  );
}

export default ChatInfo;
