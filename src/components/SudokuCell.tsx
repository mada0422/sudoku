"use client";

type Props = {
  value: number;
  wrongValue: number | null;
  row: number;
  col: number;
  isInitial: boolean;
  isSelected: boolean;
  isWrong: boolean;
  isInSelectedRow: boolean;
  isInSelectedCol: boolean;
  isSameNumber: boolean;
  onClick: () => void;
};

export default function SudokuCell({
  value,
  wrongValue,
  row,
  col,
  isInitial,
  isSelected,
  isWrong,
  isInSelectedRow,
  isInSelectedCol,
  isSameNumber,
  onClick,
}: Props) {
  const stateClass = isWrong
    ? "sudoku-cell--wrong"
    : isSelected
      ? "sudoku-cell--selected"
      : isSameNumber
        ? "sudoku-cell--same"
        : isInSelectedRow || isInSelectedCol
          ? "sudoku-cell--related"
          : isInitial
            ? "sudoku-cell--initial"
            : "sudoku-cell--empty";

  const blockClass = `
    ${col === 2 || col === 5 ? "sudoku-cell--block-right" : ""}
    ${row === 2 || row === 5 ? "sudoku-cell--block-bottom" : ""}
  `;

  const displayValue =
    isWrong && wrongValue !== null
      ? wrongValue
      : value !== 0
        ? value
        : "";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Row ${row + 1}, Column ${col + 1}`}
      className={`sudoku-cell ${stateClass} ${blockClass}`}
    >
      {displayValue}
    </button>
  );
}
