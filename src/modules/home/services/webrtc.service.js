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

module.exports.setConfig = ({ maxBuffer, chunkSize }) => {
  if (maxBuffer) {
    config.maxBuffer = maxBuffer;
  }
  if (chunkSize) {
    config.chunkSize = chunkSize;
  }
};
const config = {
  maxReceiveBuffer: 262144 * 10,
  maxBuffer: 262144,
  chunkSize: 16384,
};

module.exports.startSendingFile = (fileInfo) => {
  setSendInfo(fileInfo);
  // start checking progress
  window.progressInterval = setInterval(() => {
    store.dispatch({
      type: "UPDATE_DOWNLOAD_PROGRESS",
      data: {
        percent: ((sendInfo.end / sendInfo.file.data.size) * 100).toFixed(1),
        id: sendInfo.file.id,
      },
    });
    helper.collectGarbage();
  }, 1000);
  sendFile();
};
const setSendInfo = (file) => {
  sendInfo.file = file;
};
const resetSendInfo = () => {
  sendInfo.file = null;
  sendInfo.start = 0;
  sendInfo.end = 0;
  sendInfo.isStop = false;
};
const sendInfo = {
  file: null,
  start: 0,
  end: 0,
  isStop: false,
};

module.exports.setReceiveInfo = (info, path) => {
  receiveInfo.file = info;
  receiveInfo.path = path;
  console.log(receiveInfo);
  // setting buffer
  const numberOfPackets = Math.ceil(info.size / receiveInfo.packetLength);
  for (let i = 0; i < numberOfPackets; i++) {
    let packetLength = receiveInfo.packetLength;
    if (i == numberOfPackets - 1) {
      // last packet
      packetLength = info.size % receiveInfo.packetLength;
    }
    receiveInfo.buffer[i] = new Uint8Array(packetLength);
  }
  console.log();
  // start interval check progress
  window.progressInterval = setInterval(() => {
    store.dispatch({
      type: "UPDATE_DOWNLOAD_PROGRESS",
      data: {
        percent: (
          (receiveInfo.recvLength / receiveInfo.file.size) *
          100
        ).toFixed(1),
        id: receiveInfo.file.id,
      },
    });
    helper.collectGarbage();
  }, 1000);
};
const resetReceiveInfo = () => {
  receiveInfo.file = null;
  receiveInfo.recvLength = 0;
  receiveInfo.buffer = [];
  receiveInfo.path = "";
  receiveInfo.isStop = false;
};
const receiveInfo = {
  file: null,
  packetLength: config.chunkSize * 10000,
  recvLength: 0,
  buffer: [],
  path: "",
  isStop: false,
};

window.progressInterval = null; // check downloading progress
window.timing = null; // check when finish downloading packet
window.timingBuffered = null; // check onbufferedamountlow timeout
window.isIdlePacketState = true;

module.exports.resetAll = resetAll;
function resetAll() {
  resetSendInfo();
  resetReceiveInfo();
  if (window.progressInterval) {
    clearInterval(window.progressInterval);
  }
  if (window.timingBuffered) {
    clearTimeout(window.timingBuffered);
  }
  if (window.timing) {
    clearTimeout(window.timing);
  }
  window.progressInterval = null;
  window.timing = null;
  window.timingBuffered;
  helper.collectGarbage();
}

function createIndexBuffer(number) {
  const raw = number.toString(2).padStart(32, "0");
  const arr = new Uint8Array(4);
  for (let i = 3; i >= 0; i--) {
    arr[i] = parseInt(raw.substring(i * 8, (i + 1) * 8), 2);
  }
  return arr;
}

function parseToIndex(raw) {
  let combine = "";
  for (let i = 0; i < 4; i++) {
    combine += raw[i].toString(2).padStart(8, 0);
  }
  return parseInt(combine, 2);
}

function dataHandle(data) {
  if (receiveInfo.isStop) {
    return;
  }
  const temp = new Uint8Array(data);
  const rawOffset = parseToIndex(temp.slice(0, 4));
  const chunk = temp.slice(4);
  const packetNumber = Math.floor(rawOffset / receiveInfo.packetLength);
  const packetOffset = rawOffset % receiveInfo.packetLength;
  receiveInfo.buffer[packetNumber].set(chunk, packetOffset);
  // last packet
  if (rawOffset >= receiveInfo.file.size - config.chunkSize) {
    console.log("offset last - " + rawOffset);
    if (window.timing) {
      clearTimeout(window.timing);
    }
    window.timing = setTimeout(() => {
      composePacket(packetNumber, true);
    }, 2000);
    return;
  }
  // middle packet
  if (packetOffset == 0) {
    if (packetNumber == 0) {
      return;
    }
    console.log("offset middle - " + rawOffset);
    if (window.timing) {
      clearTimeout(window.timing);
    }
    window.timing = setTimeout(() => {
      composePacket(packetNumber - 1);
    }, 2000);
    return;
  }
}

function composePacket(packetNumber, last = false) {
  if (!window.electron) {
    console.log("electron is null");
    return;
  }
  if (!window.isIdlePacketState) {
    setTimeout(() => {
      composePacket(packetNumber, last);
    }, 100);
    return;
  }
  window.timing = null; // remove window.timing
  window.isIdlePacketState = false;
  window.electron
    .appendFile(receiveInfo.path, receiveInfo.buffer[packetNumber])
    .then(() => {
      window.isIdlePacketState = true;
      receiveInfo.buffer[packetNumber] = null;
      helper.collectGarbage();
    });
  if (last) {
    // console.log("complete");
    store.dispatch({
      type: "UPDATE_STATE_FILE",
      data: {
        state: "completed",
        path: receiveInfo.path,
        id: receiveInfo.file.id,
      },
    });
    resetAll();
  }
}

function createPeerConnection() {
  const serverType = store.getState().webRTC.configType;
  pc = new RTCPeerConnection(
    serverType == "stun" ? configPeerSTUN : configPeerTURN
  );
  pc.onicecandidate = (e) => {
    socketIO.sendRTCData({ cand: e.candidate });
  };
  pc.onnegotiationneeded = async () => {
    try {
      await pc.setLocalDescription();
      socketIO.sendRTCData({ sdp: pc.localDescription });
    } catch (error) {
      console.log(error);
    }
  };
  pc.onicegatheringstatechange = (e) => {
    if (e.target.iceGatheringState == "gathering") {
      store.dispatch({ type: "UPDATE_WEBRTC_STATUS", data: "new" });
      return;
    }
    if (e.target.iceGatheringState == "complete") {
      store.dispatch({ type: "UPDATE_WEBRTC_STATUS", data: "checking" });
      return;
    }
  };
  pc.onconnectionstatechange = (e) => {
    if (e.target.connectionState == "connected") {
      store.dispatch({ type: "UPDATE_WEBRTC_STATUS", data: "connected" });
    }
    if (e.target.connectionState == "fail") {
      store.dispatch({ type: "UPDATE_WEBRTC_STATUS", data: "fail" });
    }
  };
  pc.ondatachannel = (e) => {
    createDataChannel(e.channel);
  };
}

function createDataChannel(dataChannel) {
  if (!pc) {
    console.log("Peer Connection is null");
    return;
  }
  if (!dataChannel) {
    dataChannel = pc.createDataChannel("tranfer-file");
  }
  dataChannel.binaryType = "arraybuffer";
  dataChannel.bufferedAmountLowThreshold = config.chunkSize;
  dataChannel.onopen = () => {
    store.dispatch({ type: "UPDATE_WEBRTC_STATUS", data: "completed" });
    console.log("Connected data channel");
  };
  dataChannel.onerror = (e) => {
    console.log(e);
  };
  dataChannel.onmessage = (e) => {
    if (typeof e.data === "string") {
      console.log(e.data);
      if (e.data.indexOf("stop") !== -1) {
        stopDownload(true);
        return;
      }
    }
    receiveInfo.recvLength += e.data.byteLength - 4;
    dataHandle(e.data);
  };

  dataChannel.onclose = (e) => {
    store.dispatch({ type: "UPDATE_WEBRTC_STATUS", data: "idle" });
    console.log("Data channel closed");
  };
  dataChannel.onbufferedamountlow = (e) => {
    if (window.timingBuffered) {
      clearTimeout(window.timingBuffered);
    }
    window.timingBuffered = setTimeout(() => {
      sendFile();
    }, 10);
  };
  dc = dataChannel;
}

module.exports.startChannel = () => {
  createPeerConnection();
  createDataChannel();
};
module.exports.closeChannel = () => {
  if (!dc && !pc) {
    return;
  }
  if (dc) {
    dc.close();
    dc = null;
  }
  if (pc) {
    pc.close();
    pc = null;
  }
  helper.collectGarbage();
};

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

function handleSendEnding() {
  console.log("Tranfer completed");
  store.dispatch({
    type: "UPDATE_STATE_FILE",
    data: {
      state: "completed",
      id: sendInfo.file.id,
    },
  });
  resetAll();
}

module.exports.sendFile = sendFile;
function sendFile() {
  if (sendInfo.isStop) {
    return;
  }
  let currentBuffer = dc.bufferedAmount;
  while (sendInfo.end < sendInfo.file.data.size) {
    sendChunk(sendInfo.file.data);
    currentBuffer += config.chunkSize;
    if (currentBuffer >= config.maxBuffer) {
      if (dc.bufferedAmount <= config.chunkSize) {
        setTimeout(() => sendFile(), 50);
        break;
      }
      break;
    }
  }
  if (sendInfo.end === sendInfo.file.data.size) {
    if (window.timing) {
      clearTimeout(window.timing);
    }
    window.timing = setTimeout(() => {
      handleSendEnding();
    }, 2000);
  }
}

function appendBuffer(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp;
}

function sendChunk() {
  sendInfo.start = sendInfo.end;
  sendInfo.end =
    sendInfo.start + config.chunkSize > sendInfo.file.data.size
      ? sendInfo.file.data.size
      : sendInfo.start + config.chunkSize;
  const reader = new FileReader();
  reader.offset = sendInfo.start;
  const slidedBlob = sendInfo.file.data.slice(sendInfo.start, sendInfo.end);
  reader.onload = (e) => {
    // console.log("send");
    dc.send(appendBuffer(createIndexBuffer(reader.offset), e.target.result));
  };
  reader.readAsArrayBuffer(slidedBlob);
}

module.exports.stopDownload = stopDownload;
function stopDownload(isReceiver = false) {
  console.log("Tranfer stopped");
  if (!isReceiver) {
    dc.send("stop");
  }
  if (receiveInfo.file) {
    receiveInfo.isStop = true;
    if (window.electron) {
      window.electron.removeStoppedFile(receiveInfo.path);
    }
  }
  if (sendInfo.file) {
    sendInfo.isStop = true;
  }
  store.dispatch({
    type: "UPDATE_STATE_FILE",
    data: {
      state: "stopped",
      id: receiveInfo.file ? receiveInfo.file.id : sendInfo.file.id,
    },
  });
  setTimeout(() => {
    resetAll();
  }, 2000);
}

module.exports.testTURN = async (cb) => {
  window.tempConnection = new RTCPeerConnection(configPeerTURN);
  tempConnection.createDataChannel("testTurn");
  function clearTest() {
    tempConnection.close();
    tempConnection = null;
    helper.collectGarbage();
  }
  const timeCount = setTimeout(() => {
    clearTest();
    cb(false);
  }, 7000);
  tempConnection.onicecandidate = (e) => {
    if (e.candidate.candidate.indexOf("relay") !== -1) {
      clearTimeout(timeCount);
      clearTest();
      cb(true);
      return;
    }
    if (e.candidate == null) {
      clearTimeout(timeCount);
      clearTest();
      cb(false);
    }
  };
  tempConnection.setLocalDescription();
};
