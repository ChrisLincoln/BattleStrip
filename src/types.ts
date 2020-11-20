export type CellBattleStatus = 'open' | 'miss' | 'hit' | 'sunk';
export type Orientation = 'horizontal' | 'vertical';
export type Player = 'human' | 'bot';
export type Game = {
  boards: {[index: string] : Board};
  turn: Player | null;
  winner: Player | null;
}
export type Ship = {
  id: string;
  holes: number;
}
export type DeployedShip = {
  id: string;
  holes: number;
  anchorCellIndex: number;  //undefined means "at port, not at sea"
  orientation: Orientation;
}
export type Board = {
  player: Player;
  cells: Cell[];
  rows: number;
  columns: number;
  shipsAtPort: Ship[];
  shipsAtSea: DeployedShip[];
  sunkenShips: DeployedShip[];
}
export type Cell = {
  battleStatus: CellBattleStatus;
  ship: string | null;
  index: number;
}