"use client";

import { Board, CellPosition } from "@/types/sudoku";
import SudokuCell from "./SudokuCell";

type Props = {
  board: Board;
  initialBoard: Board;
  selectedCell: CellPosition | null;
  onCellClick: (row: number, col: number) => void;
};

export default function SudokuBoard({
  board,
  initialBoard,
  selectedCell,
  onCellClick,
}: Props) {
  return (
    <div className="grid grid-cols-9 overflow-hidden rounded-lg border-2 border-slate-900">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <SudokuCell
            key={`${rowIndex}-${colIndex}`}
            value={value}
            row={rowIndex}
            col={colIndex}
            isInitial={initialBoard[rowIndex][colIndex] !== 0}
            isSelected={
              selectedCell?.row === rowIndex &&
              selectedCell?.col === colIndex
            }
            onClick={() =>
              onCellClick(rowIndex, colIndex)
            }
          />
        ))
      )}
    </div>
  );
}
