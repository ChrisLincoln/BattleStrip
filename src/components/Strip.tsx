import React from "react";
import { Cell, Orientation, Ship } from "../types";
import BoardCell from "./BoardCell";

interface Props {
  ship: Ship;
  orientation: Orientation;
}
const Strip = ({ ship, orientation }: Props) => {
  const cells: Cell[] = [...Array(ship.holes).keys()].map((index) => ({
    battleStatus: "open",
    ship: null,
    index,
  }));
  if (orientation === "vertical") {
    return (
      <div className='border-b border-r  text-gray-800 ' style={{width: 'max-content'}}>
        {cells.map((cell) => (
          <div key={cell.index} className='border-t'>
            <BoardCell cell={cell} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row border-t border-b border-r bg-brown-400 " style={{width: 'max-content'}}>
      {cells.map((cell) => (
        <BoardCell key={cell.index} cell={cell} />
      ))}
    </div>
  );
};

export default Strip;
