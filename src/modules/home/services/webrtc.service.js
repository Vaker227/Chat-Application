window.pc = null;
window.dc = null;
const store = require("../../redux/store");
const socketIO = require("../services/socketio");
const helper = require("../../helper");

// config
const configPeerSTUN = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ],
};

const configPeerTURN = {
  iceServers: [
    {
      urls: "turn:14.162.161.195:3478",
      username: "testuser",
      credential: "superpwd",
    },
  ],
};

module.exports.resetAll = resetAll;
function resetAll() {
  // helper.collectGarbage();
}

function createPeerConnection() {
  const serverType = store.getState().webRTC.configType;
  const { type, video, mic } = store.getState().privateConnection;
  const localElement = document.getElementById(
    `local-${type == "vcall" ? "video" : "audio"}`
  );
  pc = new RTCPeerConnection(
    serverType == "stun" ? configPeerSTUN : configPeerTURN
  );
  navigator.mediaDevices
    .getUserMedia({
      video: type == "vcall" ? { height: 480, width: 460 } : false,
      audio: true,
    })
    .then(function (localStream) {
      window.localStream = localStream;
      localElement.srcObject = localStream;
      localStream.getTracks().forEach((track) => {
        if (track.kind == "video") {
          store.dispatch({ type: "TOGGLE_CALL_VIDEO", data: true });
        }
        if (track.kind == "audio") {
          store.dispatch({ type: "TOGGLE_CALL_MIC", data: true });
        }
        pc.addTrack(track, localStream);
      });
    })
    .catch((e) => {
      console.log(e);
      if (type == "vcall") {
        helper.setLocalNoCamObj(localElement.style);
      }
    });
  pc.onnegotiationneeded = async () => {
    console.log("negotiation");
    try {
      await pc.setLocalDescription();
      socketIO.sendRTCData({ sdp: pc.localDescription });
    } catch (error) {
      console.log(error);
    }
  };
  pc.onicecandidate = (e) => {
    socketIO.sendRTCData({ cand: e.candidate });
  };
  pc.onconnectionstatechange = (e) => {
    switch (pc.connectionState) {
      case "disconnected":
      case "failed":
      case "closed":
        closeChannel();
        break;
    }
  };
  pc.ontrack = (e) => {
    const remoteElement = document.getElementById(
      `remote-${type == "vcall" ? "video" : "audio"}`
    );
    e.streams[0].onremovetrack = (e) => {
      if (e.track.kind == "video") {
        helper.setRemoteNoCamObj(remoteElement.style, true);
      }
    };
    if (e.track.kind == "video") {
      helper.setRemoteNoCamObj(remoteElement.style, false);
    }
    remoteElement.srcObject = e.streams[0];
  };
}

module.exports.startChannel = () => {
  console.log("webrtc");
  createPeerConnection();
};

const toggleMic = (isOn) => {
  const { type } = store.getState().privateConnection;

  const localElement = document.getElementById(
    `local-${type == "vcall" ? "video" : "audio"}`
  );
  pc.getTransceivers().forEach((tran) => {
    localElement.srcObject.getAudioTracks()[0].enabled = isOn;
  });
  store.dispatch({ type: "TOGGLE_CALL_MIC", data: isOn });
};
module.exports.toggleMic = toggleMic;

const toggleCamera = (isOn) => {
  const { mic } = store.getState().privateConnection;
  const localVideo = document.getElementById("local-video");
  pc.getTransceivers().forEach((tran) => {
    localVideo.srcObject.getTracks().forEach((track) => track.stop());
    tran.stop();
  });
  if (!mic && !isOn) {
    store.dispatch({ type: "TOGGLE_CALL_VIDEO", data: isOn });
    return;
  }
  navigator.mediaDevices
    .getUserMedia({
      video: isOn ? { height: 480, width: 460 } : false,
      audio: mic,
    })
    .then(function (localStream) {
      window.localStream = localStream;
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
      localVideo.srcObject = localStream;
      store.dispatch({ type: "TOGGLE_CALL_VIDEO", data: isOn });
      if (!isOn) {
        // localVideo.srcObject = null;
        // localVideo.removeAttribute("srcObject");
        // localVideo.style.display = "none";

        helper.setLocalNoCamObj(localVideo.style);
      }
    })
    .catch((e) => {
      console.log(e);
      helper.setLocalNoCamObj(localVideo.style);
    });
};
module.exports.toggleCamera = toggleCamera;

const closeChannel = () => {
  const remoteVideo = document.getElementById("remote-video");
  const localVideo = document.getElementById("local-video");
  const remoteAudio = document.getElementById("remote-audio");
  const localAudio = document.getElementById("local-audio");
  if (remoteVideo && remoteVideo.srcObject) {
    remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
    remoteVideo.removeAttribute("srcObject");
  }
  if (localVideo && localVideo.srcObject) {
    localVideo.srcObject.getTracks().forEach((track) => track.stop());
    localVideo.removeAttribute("srcObject");
  }
  if (remoteAudio && remoteAudio.srcObject) {
    remoteAudio.srcObject.getTracks().forEach((track) => track.stop());
    remoteAudio.removeAttribute("srcObject");
  }
  if (localAudio && localAudio.srcObject) {
    localAudio.srcObject.getTracks().forEach((track) => track.stop());
    localAudio.removeAttribute("srcObject");
  }
  if (!pc) {
    return;
  }
  if (pc) {
    pc.close();
    pc = null;
  }
  helper.collectGarbage();
};

module.exports.closeChannel = closeChannel;

module.exports.handleChannel = async ({ sdp, cand }) => {
  if (sdp) {
    if (pc == null) {
      createPeerConnection();
    }
    await pc.setRemoteDescription(sdp);
    if (sdp.type == "offer") {
      await pc.setLocalDescription();
      socketIO.sendRTCData({ sdp: pc.localDescription });
    }
  } else if (cand) {
    const iceCand = new RTCIceCandidate(cand);
    pc.addIceCandidate(iceCand);
  }
};
