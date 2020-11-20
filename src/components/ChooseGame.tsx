import { useService } from "@xstate/react";
import React from "react";
import { gameService } from "../services/game";
import { makeBoard } from "../services/gameUtils";
import { Board, Ship } from "../types";
import Gameboard from "./Gameboard";

const boards: Board[] = [
  makeBoard("human", 3, 3, [
    { id: "2-holer", holes: 2 },
    { id: "3-holer", holes: 3 },
  ]),
  makeBoard("human", 5, 5, [
    { id: "2-holer", holes: 2 },
    { id: "3-holer", holes: 3 },
  ]),
  makeBoard("human", 8, 8, [
    { id: "2-holer", holes: 2 },
    { id: "3-holer", holes: 3 },
    { id: "4-holer", holes: 4 },
  ]),
];
const ChooseGame = () => {
  const [, send] = useService(gameService);
  const addBoards = (rows: number, columns: number, ships: Ship[]) => {
    send({
      type: "ADDBOARD",
      rows,
      columns,
      player: "human",
      ships,
    });
    send({
      type: "ADDBOARD",
      rows,
      columns,
      player: "bot",
      ships,
    });
  };
  return (
    <div className='flex flex-col md:flex-row'>
      {boards.map((board) => (
        <div key={board.rows} className='mr-4'>
          <Gameboard
            board={board}
            onCellClick={() => addBoards(board.rows, board.columns, board.shipsAtPort)}
          />
          {`${board.shipsAtPort.length} ships`}
        </div>
      ))}
    </div>
  );
};

export default ChooseGame;
