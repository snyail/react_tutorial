import { Square } from "./Square";
import type { SquareValue } from "../utils/gameLogic";
import { calculateWinner } from "../utils/gameLogic";

type Props = {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
};

export function Board({ xIsNext, squares, onPlay }: Props) {
  function handleClick(i: number) {
    if (calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`;

//   0 1 2
//   3 4 5
//   6 7 8
//   上記のようなマッピングをおこなうために繰り返し文を作っている
//   管理はリストで行なっているのでmapからlistに変換している
  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const i = row + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}
