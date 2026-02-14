import "./gameStyle.css";
import { useState } from "react";
import { Board } from "./Board";
import type { SquareValue } from "../utils/gameLogic";

import { useWebRTC } from "../../hooks/useWebRTC";

export default function Game() {
    // use WebRTC
    const { connect, send, connected } = useWebRTC();

    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState<SquareValue[][]>([
        Array(9).fill(null),
    ]);
    const [currentMove, setCurrentMove] = useState(0);

    const currentSquares = history[currentMove];

    function handlePlay(nextSquares: SquareValue[]) {
        const nextHistory = [
            ...history.slice(0, currentMove + 1),
            nextSquares,
        ];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        console.log(nextHistory);
        setXIsNext(nextHistory.length % 2 != 0);
    }

//   function jumpTo(move: number) {
//     setCurrentMove(move);
//     setXIsNext(move % 2 === 0);
//   }

    return (
        <>
            <div className="game">
                <div className="game-board">
                    <Board
                        xIsNext={xIsNext}
                        squares={currentSquares}
                        onPlay={handlePlay}
                    />
                </div>
            </div>
            <div>
                <button onClick={connect}>接続する</button>
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
