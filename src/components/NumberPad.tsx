"use client";

type Props = {
  onNumberClick: (number: number) => void;
  onDelete: () => void;
};

export default function NumberPad({
  onNumberClick,
  onDelete,
}: Props) {
  return (
    <div className="sudoku-number-pad">
      <div className="sudoku-number-pad__grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
          (number) => (
            <button
              key={number}
              type="button"
              onClick={() => onNumberClick(number)}
              className="sudoku-number-button"
            >
              {number}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="sudoku-delete-button"
      >
        <span className="sudoku-delete-button__icon">
          ⌫
        </span>

        <span>Delete</span>
      </button>
    </div>
  );
}
