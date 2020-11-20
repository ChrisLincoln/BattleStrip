import { Board, Orientation, Ship } from "../types";
import { getOpenCells, isLegalDeployment } from "./gameUtils";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomOrientation(): Orientation {
  return Math.random() < 0.5 ? "horizontal" : "vertical";
}
function randomBoardIndex(board: Board) {
  return randomIntFromInterval(0, board.cells.length);
}
export function randomShipAnchor(board: Board, ship: Ship) {
  // Take 10 random shots before brute-forcing through the grid.
  for (let attempt = 0; attempt < 10; attempt++) {
    const anchorIndex = randomBoardIndex(board);
    const orientation = randomOrientation();
    if (isLegalDeployment(board, ship, anchorIndex, orientation)) {
      return { anchorIndex, orientation };
    }
  }
  // brute force
  for (
    let anchorIndex = 0;
    anchorIndex < board.cells.length - 1;
    anchorIndex++
  ) {
    let orientation: Orientation = "horizontal";
    if (isLegalDeployment(board, ship, anchorIndex, orientation)) {
      return { anchorIndex, orientation };
    }
    orientation = "vertical";
    if (isLegalDeployment(board, ship, anchorIndex, orientation)) {
      return { anchorIndex, orientation };
    }
  }
  // boom
  return undefined;
}

export function randomShot(board: Board) {
  // get all open cells
  const openCells = getOpenCells(board);
  // produce an array of their grid indices
  const openIndices = openCells.map((cell) => cell.index);
  // pick a random, open grid indice
  const randomIndex = randomIntFromInterval(0, openCells.length - 1);
  return openIndices[randomIndex];
}
