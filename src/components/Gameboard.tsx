import React from "react";
import { Board, Cell } from "../types";
import BoardCell from "./BoardCell";
interface Props {
  board: Board;
  onCellClick?: (e: React.MouseEvent<HTMLElement>, cell: Cell) => void;
  onCellHover?: (e: React.MouseEvent<HTMLElement>, cell?: Cell) => void;
  showShips?: boolean;
}
const Gameboard = ({ board, onCellClick, onCellHover, showShips }: Props) => {
  // cheesy way of looping in JSX
  const rows = Array(board.rows).fill(0);
  const columns = Array(board.columns).fill(0);
  return (
    <div className={`mb-4 flex flex-col border-b border-r bg-blue-800 ${showShips ? ' showships ': ''}`} style={{width: 'max-content'}}>
      {rows.map((_, row) => {
        return (
          <div key={row} className="flex border-t">
            {columns.map((_, column) => {
              const cellIndex = row * board.columns + column;

              return <BoardCell key={cellIndex} cell={board.cells[cellIndex]} onCellClick={onCellClick} onCellHover={onCellHover}/>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Gameboard;
