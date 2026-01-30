import "./gameStyle.css";
import { useState } from "react";
import { Board } from "./Board";
import type { SquareValue } from "../utils/gameLogic";

export default function Game() {
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

  function jumpTo(move: number) {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>
          {history.map((_, move) => (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>
                {move > 0 ? `Go to move #${move}` : "Go to game start"}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
