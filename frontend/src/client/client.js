const socket = new WebSocket("ws://localhost:3001");

socket.onopen = () => {
  console.log("signaling server connected");
};

//

const peer = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
});

// webRTCの準備

let channel;

const button = document.getElementById("connect");

button.onclick = async () => {
  channel = peer.createDataChannel("chat");

  channel.onopen = () => {
    console.log("P2P connected");
    channel.send("hello from peer");
  };

  channel.onmessage = (event) => {
    console.log("received:", event.data);
  };
};

//
const offer = await peer.createOffer();
await peer.setLocalDescription(offer);

socket.send(JSON.stringify({
  type: "offer",
  offer
}));

//
socket.onmessage = async (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "offer") {
    await peer.setRemoteDescription(data.offer);

    peer.ondatachannel = (event) => {
      channel = event.channel;
      channel.onmessage = (e) => {
        console.log("received:", e.data);
      };
    };

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.send(JSON.stringify({
      type: "answer",
      answer
    }));
  }

  if (data.type === "answer") {
    await peer.setRemoteDescription(data.answer);
  }

  if (data.type === "candidate") {
    await peer.addIceCandidate(data.candidate);
  }
};

