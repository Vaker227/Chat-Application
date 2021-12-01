import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import _ from "lodash";
import moment from "moment";

import helper from "../../../helper.js";
import Avatar from "../common/avatar.jsx";
import ReminderServices from "../../services/reminder.service.js";

function ChatMessage(props) {
  const openDetailReminderModal = () => {
    ReminderServices.getDetailReminder(props.messageInfo.reminder._id);
  };
  return (
    <>
      <div
        className={`d-flex ${props.messageInfo.space ? "pb-4" : "pb-2"} ${
          props.messageInfo.me ? "flex-row-reverse" : ""
        }`}
      >
        {props.messageInfo.type == "text" ? (
          <>
            <Avatar src="../../../mushroom.png" width="50" height="50" />
            <OverlayTrigger
              placement="left"
              delay={100}
              overlay={
                <Tooltip>{helper.getTime(props.messageInfo.time)}</Tooltip>
              }
            >
              <div className="message-content bg-light p-2 shadow mx-2">
                <p className="fs-7 fw-light pe-1">
                  {!props.messageInfo.me
                    ? _.get(props, "memberInfo.name")
                    : null}
                </p>
                <p className="text-break">{props.messageInfo.content}</p>
              </div>
            </OverlayTrigger>
          </>
        ) : props.messageInfo.type == "noti" ? (
          <div className="mx-auto my-4">
            <p className="text-center">
              {helper.getTimeFrom(props.messageInfo.time)}
            </p>
            <p className="text-center fs-6">{props.messageInfo.content}</p>
          </div>
        ) : props.messageInfo.type == "vcall" ||
          props.messageInfo.type == "voice" ? (
          <OverlayTrigger
            placement="left"
            delay={100}
            overlay={
              <Tooltip>{helper.getTime(props.messageInfo.time)}</Tooltip>
            }
          >
            <div
              className="message-content bg-light p-2 pe-3 shadow mx-2"
              style={{ borderRadius: "20px" }}
            >
              {props.messageInfo.content == "missed" ? (
                <p>
                  <span
                    className="d-inline bg-danger text-center p-1 me-2"
                    style={{ borderRadius: "50%" }}
                  >
                    <i
                      className="fas fa-phone-slash text-white"
                      style={{ width: 20 }}
                    ></i>
                  </span>
                  <span className="text-danger fw-bold">Cuộc gọi nhỡ</span>
                </p>
              ) : (
                <p>
                  <span
                    className="d-inline bg-success text-center p-1 me-2"
                    style={{ borderRadius: "50%" }}
                  >
                    <i
                      className="fas fa-phone text-white"
                      style={{ width: 20 }}
                    ></i>
                  </span>
                  <span className="text-danger fw-bold">
                    Đã kết thúc {props.messageInfo.content}
                  </span>
                </p>
              )}
            </div>
          </OverlayTrigger>
        ) : props.messageInfo.type == "reminder" ? (
          <>
            <Avatar src="../../../mushroom.png" width="50" height="50" />
            <OverlayTrigger
              placement="left"
              delay={100}
              overlay={
                <Tooltip>{helper.getTime(props.messageInfo.time)}</Tooltip>
              }
            >
              <div
                className={`message-content bg-light p-2 shadow mx-2 w-50 border border-${
                  props.messageInfo.reminder.status == "finished"
                    ? "success"
                    : helper.checkOutdated(props.messageInfo.reminder.due)
                    ? "danger"
                    : "primary"
                }`}
                style={{ cursor: "pointer" }}
                onClick={openDetailReminderModal}
              >
                <p className="fs-7 fw-light pe-1">
                  {!props.messageInfo.me
                    ? _.get(props, "memberInfo.name")
                    : null}
                </p>
                <div>
                  <div className="d-flex justify-content-between fw-bold text-primary">
                    <p>Lời nhắc</p>
                    {props.messageInfo.reminder.status == "finished" ? (
                      <p className="text-success fw-normal">Hoàn thành</p>
                    ) : helper.checkOutdated(props.messageInfo.reminder.due) ? (
                      <p className="text-danger fw-normal">Quá hạn</p>
                    ) : (
                      <p className="text-primary fw-normal">Tiến hành</p>
                    )}
                  </div>
                  <p
                    className="text-break"
                    style={{
                      backgroundColor: "#eae7e7",
                      padding: 5,
                      paddingTop: 10,
                      borderRadius: 5,
                    }}
                  >
                    {_.get(props, "messageInfo.reminder.content")}
                  </p>
                  <p className="fs-7 fw-light text-end">
                    {moment(_.get(props, "messageInfo.reminder.due")).format(
                      "DD-MM-YYYY HH:mm"
                    )}
                  </p>
                </div>
              </div>
            </OverlayTrigger>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default ChatMessage;
