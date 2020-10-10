import React, { useState } from "react";
import Peer from "peerjs";
let peer = new Peer();
let isLiveG = null;
const initSignal = () => {
  console.log("Awaiting Hash", window.location.hash);
  peer.on("open", function (id) {
    document.getElementById("your-code").value = id;
  });
};
initSignal();
// const recieveSignal = () => {
//   peer.on("connection", (conn) => {
//     conn.on("data", (data) => {
//       isLiveG(true);
//     });
//     conn.on("open", () => {
//       conn.send(stream);
//     });
//   });
// };

const connect = (isLive) => {
  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  getUserMedia(
    { video: false, audio: true },
    function (stream) {
      var call = peer.call(document.getElementById("their-code").value, stream);
      call.on("stream", function (remoteStream) {});
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
};

let recieveSignal = () => {
  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  peer.on("call", function (call) {
    getUserMedia(
      { video: false, audio: true },
      function (stream) {
        call.answer(stream);
        call.on("stream", function (remoteStream) {
          let audioPlayer = document.getElementById("audio-player");
          audioPlayer.srcObject = remoteStream;

          console.log(remoteStream);
          audioPlayer.load();
          audioPlayer.play();
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  });
};
recieveSignal();

const Form = (props) => {
  const [isLive, setIsLive] = useState([("false", null)]);
  isLiveG = setIsLive;
  console.log(isLive[1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h4>Your Access Code</h4>
      <textarea id="your-code" />
      <h4>Their Access Code</h4>
      <textarea id="their-code" />
      <button
        style={{ display: "block", height: "10vh", width: "10vw" }}
        onMouseDown={connect}
      >
        Connect
      </button>
      <audio
        id="audio-player"
        controls
        style={{ hidden: "false" }}
        autoPlay={true}
      >
        EEEP
      </audio>
    </div>
  );
};

export default Form;
