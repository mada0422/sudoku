"use client";

import { Board, CellPosition } from "@/types/sudoku";
import SudokuCell from "./SudokuCell";

type Props = {
  board: Board;
  initialBoard: Board;
  selectedCell: CellPosition | null;
  wrongCell: {
    row: number;
    col: number;
    value: number;
  } | null;
  onCellClick: (row: number, col: number) => void;
};

export default function SudokuBoard({
  board,
  initialBoard,
  selectedCell,
  wrongCell,
  onCellClick,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-900 shadow-lg">
      <div className="sudoku-grid">
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex &&
              selectedCell?.col === colIndex;

            const isInSelectedRow =
              selectedCell?.row === rowIndex;

            const isInSelectedCol =
              selectedCell?.col === colIndex;

            const isWrong =
              wrongCell?.row === rowIndex &&
              wrongCell?.col === colIndex;

            const selectedValue = selectedCell
              ? board[selectedCell.row]?.[selectedCell.col] ?? 0
              : 0;

            const isSameNumber =
              !isSelected &&
              selectedValue !== 0 &&
              value !== 0 &&
              value === selectedValue;

            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                value={value}
                wrongValue={isWrong ? wrongCell?.value ?? null : null}
                row={rowIndex}
                col={colIndex}
                isInitial={initialBoard[rowIndex][colIndex] !== 0}
                isSelected={isSelected}
                isWrong={isWrong}
                isInSelectedRow={isInSelectedRow}
                isInSelectedCol={isInSelectedCol}
                isSameNumber={isSameNumber}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}