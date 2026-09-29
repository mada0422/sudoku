"use client";

type Props = {
  value: number;
  row: number;
  col: number;
  isInitial: boolean;
  isSelected: boolean;
  onClick: () => void;
};

export default function SudokuCell({
  value,
  row,
  col,
  isInitial,
  isSelected,
  onClick,
}: Props) {
  const borderRight =
    col === 2 || col === 5 ? "border-r-2 border-r-slate-900" : "";

  const borderBottom =
    row === 2 || row === 5 ? "border-b-2 border-b-slate-900" : "";

  return (
    <button
      onClick={onClick}
      className={`
        flex
        aspect-square
        items-center
        justify-center
        border
        border-slate-300
        text-xl
        font-semibold
        ${borderRight}
        ${borderBottom}
        ${
          isSelected
            ? "bg-blue-200"
            : "bg-white hover:bg-slate-100"
        }
        ${
          isInitial
            ? "text-slate-900"
            : "text-blue-600"
        }
      `}
    >
      {value || ""}
    </button>
  );
}
