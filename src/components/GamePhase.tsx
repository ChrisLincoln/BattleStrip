import { useService } from '@xstate/react';
import React from 'react';
import { GameAction, gameService } from '../services/game';
import { Game } from '../types';

const GamePhase = () => {
  const [{value, meta, context}] = useService<Game, GameAction>(
    gameService
  );
  // I'm not sure how people go about doing this with XState.
  // I came to it by loggin the state, and noticing the same of 'meta'
  const metaKey = `game.${value}`;
  const metaObject = meta[metaKey];
  return (
    <h1 className="text-6xl">
      {value !== 'gameover' && metaObject.message}
      {value === 'gameover' && (context.winner === 'human' ? 'You Win!!!' : 'You lose')}
    </h1>
  );
};

export default GamePhase;