"use client";

import { useEffect, useState } from "react";
import SudokuBoard from "./SudokuBoard";
import NumberPad from "./NumberPad";

import {
  generatePuzzle,
  isValidMove,
} from "@/lib/sudoku";

import {
  Board,
  Difficulty,
  CellPosition,
} from "@/types/sudoku";

export default function SudokuGame() {
  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

  const [board, setBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] =
    useState<Board>([]);

  const [solution, setSolution] =
    useState<Board>([]);

  const [selectedCell, setSelectedCell] =
    useState<CellPosition | null>(null);

  const [mistakes, setMistakes] = useState(0);

  const [time, setTime] = useState(0);

  const [gameWon, setGameWon] = useState(false);

  function startGame(level: Difficulty = difficulty) {
    const { puzzle, solution } =
      generatePuzzle(level);

    setBoard(puzzle);
    setInitialBoard(
      puzzle.map((row) => [...row])
    );
    setSolution(solution);

    setSelectedCell(null);
    setMistakes(0);
    setTime(0);
    setGameWon(false);
  }

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (gameWon) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameWon]);

  function handleNumber(number: number) {
    if (!selectedCell || gameWon) return;

    const { row, col } = selectedCell;

    if (initialBoard[row][col] !== 0) {
      return;
    }

    const newBoard = board.map((r) => [...r]);

    if (number !== solution[row][col]) {
      setMistakes((prev) => prev + 1);
      return;
    }

    newBoard[row][col] = number;

    setBoard(newBoard);

    checkWin(newBoard);
  }

  function handleDelete() {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    if (initialBoard[row][col] !== 0) {
      return;
    }

    const newBoard = board.map((r) => [...r]);

    newBoard[row][col] = 0;

    setBoard(newBoard);
  }

  function checkWin(currentBoard: Board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (
          currentBoard[row][col] !==
          solution[row][col]
        ) {
          return;
        }
      }
    }

    setGameWon(true);
  }

  const formattedTime = `${Math.floor(
    time / 60
  )
    .toString()
    .padStart(2, "0")}:${(time % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-center text-4xl font-bold">
          Sudoku
        </h1>

        <div className="mb-4 flex justify-between rounded-lg bg-white p-4 shadow">
          <div>
            <p className="text-sm text-slate-500">
              Time
            </p>
            <p className="font-bold">
              {formattedTime}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Mistakes
            </p>
            <p className="font-bold">
              {mistakes}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Difficulty
            </p>
            <p className="font-bold capitalize">
              {difficulty}
            </p>
          </div>
        </div>

        {board.length > 0 && (
          <SudokuBoard
            board={board}
            initialBoard={initialBoard}
            selectedCell={selectedCell}
            onCellClick={(row, col) =>
              setSelectedCell({ row, col })
            }
          />
        )}

        <NumberPad
          onNumberClick={handleNumber}
          onDelete={handleDelete}
        />

        <div className="mt-4 grid grid-cols-3 gap-2">
          {(["easy", "medium", "hard"] as Difficulty[]).map(
            (level) => (
              <button
                key={level}
                onClick={() => {
                  setDifficulty(level);
                  startGame(level);
                }}
                className="rounded-lg bg-slate-800 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {level}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => startGame()}
          className="mt-3 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
        >
          New Game
        </button>

        {gameWon && (
          <div className="mt-4 rounded-lg bg-green-100 p-4 text-center font-bold text-green-700">
            🎉 Congratulations! You solved the Sudoku!
          </div>
        )}
      </div>
    </main>
  );
}
