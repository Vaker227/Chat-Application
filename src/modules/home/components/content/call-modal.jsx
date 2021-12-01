import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { disconnectPrivate } from "../../services/socketio";
import { toggleCamera, toggleMic } from "../../services/webrtc.service";

function useTimer(hour = 0, minute = 0, second = 0) {
  const [hours, setHours] = useState(hour);
  const [minutes, setMinutes] = useState(minute);
  const [seconds, setSeconds] = useState(second);
  useEffect(() => {
    let timer = setInterval(() => {
      if (seconds >= 59) {
        setSeconds(0);
        if (minutes >= 59) {
          setMinutes(0);
          setHours(hours + 1);
          return;
        }
        setMinutes(minutes + 1);
        return;
      }
      setSeconds(seconds + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });
  return `${hours <= 0 ? " " : hours + " : "}${
    minutes < 10 ? "0" + minutes : minutes
  } : ${seconds < 10 ? "0" + seconds : seconds}`;
}

function CallModal(props) {
  const timer = useTimer(0, 0, 0);
  return (
    <Modal backdrop="static" centered size="xl" show={true}>
      <Modal.Body>
        <div className="p-relative" style={{ height: "80vh" }}>
          {props.privateConnection.type == "vcall" ? (
            <>
              <div /* remote-video */ className="w-100 h-100">
                <video
                  id="remote-video"
                  className="w-100 h-100"
                  style={{
                    backgroundImage: "url('../../../mushroom.png')",
                    filter: "blur(40px)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    objectFit: "cover",
                  }}
                  autoPlay
                ></video>
              </div>
              <div
                /* local-video */
                style={{
                  position: "absolute",
                  height: 190,
                  bottom: "1rem",
                  right: "1rem",
                  zIndex: 10,
                }}
              >
                <video
                  id="local-video"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    borderTopRightRadius: "10px",
                    borderTop: "2px solid black",
                    borderRight: "2px solid black",
                    transform: "rotateY(180deg)",
                    maxHeight: "100%",
                  }}
                  autoPlay
                  muted
                ></video>
              </div>
            </>
          ) : (
            <>
              <div
                /* remote-audio */ className="bg-warning w-100 h-100"
                style={{
                  backgroundImage: "url('../../../mushroom.png')",
                  filter: "blur(40px)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <audio id="remote-audio" autoPlay></audio>
              </div>
              <div
              /* local-audio */
              >
                <audio id="local-audio" autoPlay muted></audio>
              </div>
            </>
          )}
          <div // buttons
            className="d-flex justify-content-around w-50 py-2 "
            style={{
              borderRadius: "30px",
              backgroundColor: "rgba(0 0 0 / 0.4)",
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              marginLeft: "auto",
              marginRight: "auto",
              zIndex: 20,
            }}
          >
            <div className="fw-bold border border-4 border-danger rounded-pill bg-white p-2">
              {timer}
            </div>
            {props.privateConnection.mic ? (
              <div
                className="fs-5 text-center call-btn-sm text-white bg-secondary pt-2"
                title="Tắt mic"
                onClick={() => toggleMic(false)}
              >
                <i className="fas fa-microphone-alt"></i>
              </div>
            ) : (
              <div
                className="fs-5 text-center call-btn-sm text-white bg-danger pt-2"
                title="Bật mic"
                onClick={() => toggleMic(true)}
              >
                <i className="fas fa-microphone-alt-slash"></i>
              </div>
            )}
            {props.privateConnection.type == "vcall" ? (
              props.privateConnection.video ? (
                <div
                  className="fs-5 text-center call-btn-sm text-white bg-secondary pt-2"
                  title="Tắt camera"
                  onClick={() => toggleCamera(false)}
                >
                  <i className="fas fa-video"></i>
                </div>
              ) : (
                <div
                  className="fs-5 text-center call-btn-sm text-white bg-danger pt-2"
                  title="Bật camera"
                  onClick={() => toggleCamera(true)}
                >
                  <i className="fas fa-video-slash"></i>
                </div>
              )
            ) : (
              ""
            )}

            <div
              className="fs-5 text-center call-btn-sm bg-danger pt-2"
              title="Kết thúc cuộc gọi"
              onClick={() => disconnectPrivate(timer)}
            >
              <i className="fas fa-phone-slash text-white"></i>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

const CallModalSTP = (state) => {
  return { privateConnection: state.privateConnection };
};

const CallModalReduxed = connect(CallModalSTP)(CallModal);

export default CallModalReduxed;
