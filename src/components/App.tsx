import { useService } from "@xstate/react";
import React from "react";
import { gameService } from "../services/game";
import BattleMode from "./BattleMode";
import ChooseGame from "./ChooseGame";
import GameSetup from "./GameSetup";
import Background from "./Background";
import Pier from "./Pier";
import GamePhase from "./GamePhase";
import IntroPage from "./IntroPage";
import { FaGithub } from "react-icons/fa";

function App() {
  const [{ value: state }] = useService(gameService);
  return (
    <Background>
      <div className='flex flex-row text-gray-300 h-full relative'>
        <Pier />
        <div className='w-9/12 md:w-11/12 flex  justify-center'>
          <div className='flex flex-col  items-center'>
            <GamePhase />
            {state === "intro" && <IntroPage />}
            {state === "arenaSetup" && <ChooseGame />}
            {state === "deployment" && <GameSetup />}
            {(state === "gameon" || state === "gameover") && <BattleMode />}
          </div>
        </div>
        {state === 'intro' && <div className='absolute m-2 right-0'>
          <a className="md:text-3xl" href='https://github.com/ChrisLincoln/battlestrip'>
            <FaGithub />
          </a>
        </div>}
      </div>
    </Background>
  );
}

export default App;
