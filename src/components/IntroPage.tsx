import { useService } from "@xstate/react";
import React from "react";
import { gameService } from "../services/game";
import Button from "./Button";

const IntroPage = () => {
  const [, send] = useService(gameService);
  return (
    <div className="flex flex-col">
      <h2>
        Deploy your ships to sea, then try to sink your opponent's ships before
        they sink yours!
      </h2>
      <Button className="self-center mt-8" onClick={() => send("NEWGAME")}>Start</Button>
    </div>
  );
};

export default IntroPage;
