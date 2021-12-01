import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";

import { responsePrivateConnection } from "../../services/socketio";

function WebRTCModal(props) {
  const {
    isReceivingRequest,
    exchangingTarget,
    isRequesting,
    type,
    isConnected,
  } = props.privateConnection;
  const handleClose = () => {
    if (isRequesting) {
      props.stopRequest({ sendBy: exchangingTarget, type });
    } else {
      props.responseRequest({ sendBy: exchangingTarget, type });
    }
  };
  const handleResponse = (isAccept) => {
    responsePrivateConnection(isAccept);
  };
  return (
    <>
      {props.privateConnection.exchangingTarget && (
        <Modal
          backdrop="static"
          centered
          size="sm"
          show={isReceivingRequest || isRequesting}
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title>
              {isRequesting ? (
                <>
                  Calling{" "}
                  <span className="text-primary fw-bold">
                    {exchangingTarget.name}
                  </span>
                  ... <Spinner animation="grow" size="sm" variant="primary" />
                </>
              ) : (
                <>
                  <span className="text-primary fw-bold">
                    {exchangingTarget.name}
                  </span>{" "}
                  is calling{" "}
                  <Spinner animation="grow" size="sm" variant="primary" />
                </>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-around pt-5">
              <div
                className="fs-3 text-center call-btn bg-danger pt-2"
                onClick={() => handleResponse(false)}
              >
                <i className="fas fa-phone-slash text-white"></i>
              </div>
              {!isRequesting && (
                <div
                  className="fs-3 text-center call-btn bg-success pt-2"
                  onClick={() => handleResponse(true)}
                >
                  <i className="fas fa-phone text-white"></i>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

const WebRTCModalSTP = (state) => {
  return { privateConnection: state.privateConnection };
};

const WebRTCModalDTP = (dispatch) => {
  return {
    stopRequest: function (data) {
      return dispatch({ type: "END_REQUESTING_PRIVATE_CONNECTION", data });
    },
    responseRequest: function (data) {
      return dispatch({ type: "END_RECEIVING_REQUEST", data });
    },
  };
};

const WebRTCModalReduxed = connect(WebRTCModalSTP, WebRTCModalDTP)(WebRTCModal);

export default WebRTCModalReduxed;
