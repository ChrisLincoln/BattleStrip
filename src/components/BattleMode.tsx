import { useService } from "@xstate/react";
import React, { useEffect } from "react";
import { randomShot } from "../services/botPlays";
import { gameService } from "../services/game";
import { Cell, Player } from "../types";
import Gameboard from "./Gameboard";
import { useCheating } from "./Pier";

const BattleMode = () => {
  const [{ context }, send] = useService(gameService);
  const cheating = useCheating((state) => state.cheating);

  useEffect(() => {
    // todo:  Don't assume the bot will want to kill the human first
    setTimeout(() => {
      const humanBoard = context.boards["human"];
      if (context.turn === "bot") {
        send({
          type: "FIRESALVO",
          player: "bot",
          enemy: "human",
          cellIndex: randomShot(humanBoard),
        });
      }
    }, 1000);
  }, [context.boards, context.turn, send]);
  const handleHumanTurn = (enemy: Player) => (
    e: React.MouseEvent,
    cell: Cell
  ) => {
    if (context.turn === "human") {
      send({
        type: "FIRESALVO",
        player: "human",
        enemy,
        cellIndex: cell.index,
      });
    }
  };
  return (
    <div>
      <p>Bot</p>
      <Gameboard
        board={context.boards["bot"]}
        onCellClick={handleHumanTurn("bot")}
        showShips={cheating}
      />
      <p>You</p>
      <Gameboard board={context.boards["human"]} showShips />
    </div>
  );
};

export default BattleMode;
