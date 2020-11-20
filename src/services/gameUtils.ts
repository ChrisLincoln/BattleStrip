import { Board, Cell, Game, Orientation, Player, Ship } from "../types";

export function makeBoard(player: Player, rows: number, columns: number, shipsAtPort: Ship[]) {
  const cells: Cell[] = [...Array(rows * columns).keys()].map(index => 
    ({
     battleStatus: "open",
     ship: null,
     index
   }));
   const ships = shipsAtPort.map(ship => ({...ship}))
   return {
    player,
    shipsAtPort: ships,
    shipsAtSea: [],
    sunkenShips: [],
    rows: rows,
    columns: columns,
    cells,
  }
}
function getRow(board: Board, index: number) {
  let row = Math.floor(index / board.columns);
  return row;
}

export function getShipIndices(board: Board, ship: Ship, cellIndex: number, orientation: Orientation) {
  const indices = orientation === 'horizontal' 
  ? Array(ship.holes).fill(undefined).map((hole, index) => cellIndex + index) 
  : Array(ship.holes).fill(undefined).map((hole, index) => cellIndex + (index * board.columns));
  return indices;
}
export function isLegalDeployment(board: Board, ship: Ship, cellIndex: number, orientation: Orientation) {
  const indices = getShipIndices(board, ship, cellIndex, orientation);

  // Check 1: Are all indices on the board?
  if (indices.some(i => i > board.cells.length-1)) return false;

  // Check 2: For horizontal placement, are all indices on the same row?
  const anchorRow = getRow(board, indices[0]);
  if (orientation === 'horizontal' && indices.some((i) => getRow(board, i) !== anchorRow)) return false;

  // Check 3: Are there any ships already here?
  if (indices.some((i) => board.cells[i].ship)) return false;

  // good to go
  return true;
}

export function getOpenCells(board: Board) {
  return board.cells.filter(cell => cell.battleStatus === 'open')
}
function isWinner(board: Board) {
  return getOpenCells(board).some(cell => cell.ship);
}
export function determineWinner(game: Game) : Player | null {
  const players = Object.keys(game.boards) as Player[];
  for(let i=0; i<players.length - 1; i++ ) {
    if (isWinner(game.boards[players[i]]))
      return players[i];
  }
  return null;
}