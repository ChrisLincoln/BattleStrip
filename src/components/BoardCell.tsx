import React from "react";
import styled from "styled-components";
import { Cell } from "../types";
import {FaCircle, FaTimes} from 'react-icons/fa'
const CSS = styled.div`
  
`;

interface Props {
  cell: Cell;
  onCellClick?: (e: React.MouseEvent<HTMLElement>, cell: Cell) => void;
  onCellHover?: (e: React.MouseEvent<HTMLElement>, cell?: Cell) => void;
}
const BoardCell = ({ cell, onCellClick, onCellHover }: Props) => {
  const className = `border-l cell ${onCellClick ? ' cursor-pointer ' : ''} ${cell.ship ? " ship " : ""}`;
  const icon = cell.battleStatus === 'open' ? <FaCircle /> : <FaTimes />
  const color = cell.battleStatus === 'open' ? 'text-gray-800' : ['hit', 'sunk' ].includes(cell.battleStatus) ? 'text-red-900' : 'text-gray-300'
  return (
    <CSS
      onClick={(e) => {
        if (onCellClick) onCellClick(e, cell);
      }}
      onMouseEnter={(e) => {
        if (onCellHover) onCellHover(e, cell)
      }}
      onMouseLeave={(e) => {
        if (onCellHover) onCellHover(e, undefined)
      }}
    >
      <div className={className}><span className={color}>{icon}</span></div>
    </CSS>
  );
};

export default BoardCell;
