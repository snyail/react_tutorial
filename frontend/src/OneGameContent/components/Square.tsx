import { memo } from "react";
import type { SquareValue } from "../utils/gameLogic";

type Props = {
    value: SquareValue;
    onSquareClick: () => void;
};

export const Square = memo(({ value, onSquareClick }: Props) => {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
});
