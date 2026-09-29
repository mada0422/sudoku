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
    <div className="mt-4 grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <button
          key={number}
          onClick={() => onNumberClick(number)}
          className="rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {number}
        </button>
      ))}

      <button
        onClick={onDelete}
        className="rounded-lg bg-slate-200 py-3 font-semibold hover:bg-slate-300"
      >
        ⌫
      </button>
    </div>
  );
}
