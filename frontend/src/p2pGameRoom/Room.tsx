import "./gameStyle.css";
// import { useState } from "react";
import { useWebRTC } from "../hooks/useWebRTC";

export default function Game() {
    // use WebRTC
    const { connect, send, connected } = useWebRTC();

    return (
        <>
            <div>
                <button onClick={connect}>接続する</button>
                <div className="messageArea">

                </div>
                <button onClick={() => send("hello from react")} disabled={!connected}>
                    送信
                </button>
            </div>

            <p>
            状態: {connected ? "接続中" : "未接続"}
            </p>
        </>
    );
}
