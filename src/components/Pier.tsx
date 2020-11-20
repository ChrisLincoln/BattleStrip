import { useService } from "@xstate/react";
import React, { useEffect } from "react";
import { GameAction, gameService } from "../services/game";
import { Game, Ship } from "../types";
import create from "zustand";
import Button from "./Button";
import Strip from "./Strip";

type DeployShipState = {
  selectedShip: Ship | null;
  setSelectedShip: (ship: Ship | null) => void;
};
export const useDeployShip = create<DeployShipState>((set) => ({
  selectedShip: null,
  setSelectedShip: (selectedShip: Ship | null) => set({ selectedShip }),
}));

type CheatState = {
  cheating: boolean;
  setCheating: (cheating: boolean) => void;
};
export const useCheating = create<CheatState>((set) => ({
  cheating: false,
  setCheating: (cheating: boolean) => set({ cheating }),
}));

const Pier = () => {
  const { selectedShip, setSelectedShip } = useDeployShip();
  const { cheating, setCheating } = useCheating();

  const [{ value, context }, send] = useService<Game, GameAction>(gameService);
  const yourShips = context.boards["human"]?.shipsAtPort || [];
  useEffect(() => {
    if (value === "arenaSetup") {
      setCheating(false);
    }
  }, [setCheating, value]);
  return (
    <div className='w-1/12 flex flex-col px-2 py-4 justify-between bg-brown-700'>
      <div className='flex flex-col'>
        <Button
          disabled={["intro", "arenaSetup"].includes(value.toString())}
          onClick={() => {
            send("NEWGAME");
          }}
        >
          start over
        </Button>
        {yourShips.map((ship) => { 
          const selectedClassnames = ship === selectedShip ? ' bg-white opacity-25 text-black ' : '';
          return (
          <div key={ship.id} className={`mt-2 ${selectedClassnames}`}>
            <p>{ship.id}</p>
            <div className="cursor-pointer" onClick={() => setSelectedShip(ship)}><Strip ship={ship} orientation='horizontal' /></div>
          </div>
        )})}
      </div>
      <div className='flex flex-col'>
        <Button
          disabled={value !== "gameon"}
          onClick={() => send({ type: "ANNIHILATE", player: "bot" })}
        >
          Annihilate
        </Button>
        <Button
          disabled={value !== "gameon"}
          onClick={() => send({ type: "ANNIHILATE", player: "human" })}
        >
          Concede
        </Button>
        <Button
          disabled={value !== "gameon"}
          onClick={() => setCheating(!cheating)}
        >
          Cheat
        </Button>
      </div>
    </div>
  );
};

export default Pier;
