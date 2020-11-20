import { interpret, Machine, assign } from "xstate";
import {
  Cell,
  CellBattleStatus,
  DeployedShip,
  Game,
  Orientation,
  Player,
  Ship,
} from "../types";
import { determineWinner, getShipIndices, makeBoard } from "./gameUtils";
export type GameAction =
  | {
    type: "START"
  }
  | {
      type: "NEWGAME";
    }
  | {
      type: "ADDBOARD";
      rows: number;
      columns: number;
      player: Player;
      ships: Ship[];
    }
  | {
      type: "DEPLOYSHIP";
      player: Player;
      shipId: string;
      anchorCellIndex: number;
      orientation: Orientation;
    }
  | {
      type: "FIRESALVO";
      player: Player;
      enemy: Player;
      cellIndex: number;
    }
  | {
      type: "ANNIHILATE";
      player: Player;
    };
function arenaIsReady(game: Game, event: GameAction) {
  return Object.keys(game.boards).length === 2;
}

function allShipsDeployed(game: Game, event: GameAction) {
  return !Object.keys(game.boards).some(
    (key) => game.boards[key].shipsAtPort.length !== 0
  );
}
function allShipsSunk(game: Game, event: GameAction) {
  return Object.keys(game.boards).some(
    (key) =>
      game.boards[key].sunkenShips.length === game.boards[key].shipsAtSea.length
  );
}

function nextPlayer(game: Game): Player {
  // todo:  Extend this logic to support multiple bots
  return game.turn === "human" ? "bot" : "human";
}

function gameReducer(game: Game, event: GameAction): Game {
  // Assertion: rules checking has been performed, and state machinery makes all reduction
  // logic legal.  In other words, indexes are assumed to be good, etc.
  switch (event.type) {
    case "ADDBOARD": {
      const board = makeBoard(
        event.player,
        event.rows,
        event.columns,
        event.ships
      );
      return {
        ...game,
        boards: {
          ...game.boards,
          [event.player]: board,
        },
      };
    }
    case "DEPLOYSHIP": {
      const board = game.boards[event.player];
      const ship = board.shipsAtPort.find(
        (ship) => ship.id === event.shipId
      ) as Ship;
      const shipsAtPort = board.shipsAtPort.filter(
        (ship) => ship.id !== event.shipId
      );
      const shipsAtSea = [...board.shipsAtSea];
      if (ship)
        shipsAtSea.push({
          ...ship,
          anchorCellIndex: event.anchorCellIndex,
          orientation: event.orientation,
        });
      // fill the board cells with the ship
      const deploymentIndices = getShipIndices(
        board,
        ship,
        event.anchorCellIndex,
        event.orientation
      );
      const cells = game.boards[event.player].cells.map((cell, index) => {
        if (deploymentIndices.includes(index)) {
          return { ...cell, ship: ship.id };
        }
        return cell;
      });
      return {
        ...game,
        boards: {
          ...game.boards,
          [event.player]: { ...board, cells, shipsAtPort, shipsAtSea },
        },
      };
    }
    case "FIRESALVO": {
      const board = game.boards[event.enemy];
      const cell = board.cells[event.cellIndex];
      let affectedCellIndices = [event.cellIndex];
      let battleStatus: CellBattleStatus = "miss";
      let ship: DeployedShip | null = null;
      let sunkenShips = [...board.sunkenShips];
      if (cell.ship) {
        //hit
        ship = board.shipsAtSea.find((s) => s.id === cell.ship) as DeployedShip;
        const otherShipIndices = getShipIndices(
          board,
          ship,
          ship.anchorCellIndex!,
          ship.orientation!
        ).filter((indice) => indice !== event.cellIndex);
        const stillAfloat = otherShipIndices.some(
          (indice) => board.cells[indice].battleStatus === "open"
        );
        if (!stillAfloat) {
          // sunken ship.  Mark all cells (below)
          affectedCellIndices = [...affectedCellIndices, ...otherShipIndices];
          sunkenShips.push(ship);
        }
        battleStatus = stillAfloat ? "hit" : "sunk";
      } else {
        // miss
      }
      // the fired salvo will affect either 1 cell, or N sells if a ship is sunk
      const cells = board.cells.map((c, index) => {
        if (affectedCellIndices.includes(index)) {
          return { ...c, battleStatus };
        }
        return c;
      });
      return {
        ...game,
        turn: nextPlayer(game),
        boards: {
          ...game.boards,
          [event.enemy]: { ...board, cells, sunkenShips },
        },
      };
    }
    case "ANNIHILATE": {
      const board = game.boards[event.player];
      // sink all cells with a ship
      const cells: Cell[] = board.cells.map((cell) => ({...cell, battleStatus: cell.ship ? "sunk" : cell.battleStatus}));
      const sunkenShips = [...board.shipsAtSea];
      return {
        ...game,
        boards: {
          ...game.boards,
          [event.player]: { ...board, cells, sunkenShips },
        },
      };
    }
  }
  return game;
}
export const gameMachine = Machine<Game, GameAction>(
  {
    id: "game",
    context: {
      boards: {},
      turn: null,
      winner: null,
    },
    initial: "intro",
    states: {
      intro: {
        on: {"START": 'arenaSetup'},
        meta: {
          message: "Welcome to Battlestrip!!!"
        }
      },
      arenaSetup: {
        entry: [
          assign((context) => ({
            boards: {},
            turn: null,
            winner: null,
          })),
        ],
        on: {
          ADDBOARD: {
            actions: assign((context, event) => gameReducer(context, event)),
          },
        },
        always: {
          target: "deployment",
          cond: "arenaIsReady",
        },
        meta: {
          message: "Choose a Game",
        },
      },
      deployment: {
        on: {
          DEPLOYSHIP: {
            actions: assign((context, event) => gameReducer(context, event)),
          },
        },
        always: {
          target: "gameon",
          cond: "allShipsDeployed",
        },
        meta: {
          message: "Deploy Your Ships",
        },
      },
      gameon: {
        entry: [
          assign({
            turn: (context) => "human",
          }),
        ],
        on: {
          FIRESALVO: {
            actions: [assign((context, event) => gameReducer(context, event))],
          },
          ANNIHILATE: {
            actions: [assign((context, event) => gameReducer(context, event))],
          },
        },
        always: [
          {
            target: "gameover",
            cond: "allShipsSunk",
          },
        ],
        meta: {
          message: "Game On!",
        },
      },
      gameover: {
        entry: [
          assign({
            winner: (context) => determineWinner(context)
          }),
        ],
        meta: {
          message: "Game Over",
        },
      },
    },
    on: {
      NEWGAME: "arenaSetup",
    },
  },
  {
    guards: {
      arenaIsReady,
      allShipsDeployed,
      allShipsSunk,
    },
  }
);

export const gameService = interpret(gameMachine);
gameService.start();

