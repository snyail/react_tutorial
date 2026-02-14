import { useRef } from "react";

type Signal =
  | { type: "role"; isInitiator: boolean }
  | { type: "offer"; offer: RTCSessionDescriptionInit }
  | { type: "answer"; answer: RTCSessionDescriptionInit }
  | { type: "candidate"; candidate: RTCIceCandidateInit };

export function useWebRTC() {
  const socketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);

  const isInitiatorRef = useRef<boolean | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  /* ------------------ 初期化 ------------------ */

  function connect() {
    createPeer();
    createSocket();
  }

  function createPeer() {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    peerRef.current = peer;

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        sendSignal({
          type: "candidate",
          candidate: e.candidate
        });
      }
    };

    peer.ondatachannel = (event) => {
      setupDataChannel(event.channel);
    };
  }

  function createSocket() {
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onmessage = async (event) => {
      const data: Signal = JSON.parse(event.data);
      await handleSignal(data);
    };
  }

  /* ------------------ signaling ------------------ */

  async function handleSignal(data: Signal) {
    switch (data.type) {
        // initiaterかrecieber化の判断
      case "role":
        await handleRole(data.isInitiator);
        break;
        // initiater側の処理
      case "offer":
        await handleOffer(data.offer);
        break;
        // receiver側の処理
      case "answer":
        await handleAnswer(data.answer);
        break;
        // ICE候補の収集
        // サーバから送られるもののオファーやanserより先に呼ばれる（下手したらroleより早い）
      case "candidate":
        await handleCandidate(data.candidate);
        break;
    }
  }

  // roleの決定
  async function handleRole(isInitiator: boolean) {
    isInitiatorRef.current = isInitiator;

    // initiator側なら処理をおこす
    // datachannelを作成
    // datachannnelができた後の処理を追加（setupDataChannel）
    // offerを作成
    // offerの内容を自分で保持
    // データチャンネルを通じてシグナルを送信
    if (isInitiator) {
      const channel = peerRef.current!.createDataChannel("game");
      setupDataChannel(channel);

      const offer = await peerRef.current!.createOffer();
      await peerRef.current!.setLocalDescription(offer);

      sendSignal({ type: "offer", offer });
    }
  }

  // offerを送信される側の処理（receiver）
  // offerが届いた場合に送信されて情報を自分の中に設定
  // ICEを収集（flushPendingCandidates）
  // anserの作成
  // anserを自分の中に準備
  // anserをsignalとして送信
  async function handleOffer(offer: RTCSessionDescriptionInit) {
    const peer = peerRef.current!;
    await peer.setRemoteDescription(offer);

    // setRemoteDescriptionがあるのでICEは使用可能
    // addIceCandidateを行い使用可能な状態にする
    flushPendingCandidates();

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    sendSignal({ type: "answer", answer });
  }

  // anserが送られてきた場合にinitiater側でanserとして送られてきたものを自分の中にセット
  async function handleAnswer(answer: RTCSessionDescriptionInit) {
    await peerRef.current!.setRemoteDescription(answer);
  }

  // ?
  async function handleCandidate(candidate: RTCIceCandidateInit) {
    const peer = peerRef.current!;
    // 相手の設計図があるならICEは使用可能
    if (peer.remoteDescription) {
      await peer.addIceCandidate(candidate);
    } else {
      pendingCandidatesRef.current.push(candidate);
    }
  }

  function flushPendingCandidates() {
    const peer = peerRef.current!;
    pendingCandidatesRef.current.forEach((c) => peer.addIceCandidate(c));
    pendingCandidatesRef.current = [];
  }

  /* ------------------ DataChannel ------------------ */

  function setupDataChannel(channel: RTCDataChannel) {
    channelRef.current = channel;

    channel.onopen = () => {
      console.log("P2P connected");
    };

    channel.onmessage = (e) => {
      console.log("received:", e.data);
    };
  }

  /* ------------------ util ------------------ */

  function sendSignal(data: Signal) {
    socketRef.current?.send(JSON.stringify(data));
  }

  function send(message: string) {
    if (channelRef.current?.readyState === "open") {
      channelRef.current.send(message);
    }
  }

  return { connect, send };
}
