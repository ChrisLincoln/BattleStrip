import { useService } from "@xstate/react";
import React, { useEffect, useState } from "react";
import { randomShipAnchor } from "../services/botPlays";
import { GameAction, gameService } from "../services/game";
import { isLegalDeployment } from "../services/gameUtils";
import { Cell, Game, Orientation } from "../types";
import Button from "./Button";
import Gameboard from "./Gameboard";
import { useDeployShip } from "./Pier";

const GameSetup = () => {
  const [{ value: state, context }, send] = useService<Game, GameAction>(
    gameService
  );
  const { selectedShip, setSelectedShip } = useDeployShip();
  const [randomForMe, setRandomForMe] = useState(false);

  useEffect(() => {
    const botBoard = context.boards["bot"];
    if (botBoard.shipsAtPort.length > 0) {
      const ship = botBoard.shipsAtPort[0];
      const deployment = randomShipAnchor(botBoard, ship);
      if (deployment) {
        send({
          type: "DEPLOYSHIP",
          player: "bot",
          shipId: ship.id,
          anchorCellIndex: deployment.anchorIndex,
          orientation: deployment.orientation,
        });
      }
    }
  }, [state, send, context.boards]);

  useEffect(() => {
    const board = context.boards["human"];
    if (randomForMe && board.shipsAtPort.length > 0) {
      const ship = board.shipsAtPort[0];
      const deployment = randomShipAnchor(board, ship);
      if (deployment) {
        send({
          type: "DEPLOYSHIP",
          player: board.player,
          shipId: ship.id,
          anchorCellIndex: deployment.anchorIndex,
          orientation: deployment.orientation,
        });
      }
    }
  }, [state, send, context.boards, randomForMe]);

  useEffect(() => {
    const { shipsAtPort } = context.boards["human"];
    if (selectedShip === null && shipsAtPort.length > 0) {
      setSelectedShip(shipsAtPort[0]);
    }
  }, [context.boards, selectedShip, setSelectedShip]);
  const handleDeploy = (e: React.MouseEvent<HTMLElement>, cell: Cell) => {
    if (!selectedShip) return;
    const orientation: Orientation = e.shiftKey ? "vertical" : "horizontal";
    if (
      isLegalDeployment(
        context.boards["human"],
        selectedShip,
        cell.index,
        orientation
      )
    ) {
      send({
        type: "DEPLOYSHIP",
        player: "human",
        shipId: selectedShip.id,
        anchorCellIndex: cell.index,
        orientation,
      });
      setSelectedShip(null);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <Gameboard
        board={context.boards["human"]}
        showShips
        onCellClick={handleDeploy}
      />
      <div className='bg-blue-300 text-blue-800 p-2'>
        <p>Click a board grid to place the {selectedShip?.id}</p>
        <p className="mb-4">Press and hold the Shift key to place the ship vertically.</p>
        <Button
          onClick={() => {
            setRandomForMe(true);
          }}
        >
          Or Place My Ships For Me
        </Button>
      </div>
    </div>
  );
};

export default GameSetup;
