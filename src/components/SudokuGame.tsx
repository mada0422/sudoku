"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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

type WrongCell = {
  row: number;
  col: number;
  value: number;
};

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

  const [wrongCell, setWrongCell] =
    useState<WrongCell | null>(null);

  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  /*
   * -----------------------------------------
   * Start / restart game
   * -----------------------------------------
   */

  const startGame = useCallback(
    (level: Difficulty = difficulty) => {
      const {
        puzzle,
        solution: generatedSolution,
      } = generatePuzzle(level);

      setBoard(puzzle);

      setInitialBoard(
        puzzle.map((row) => [...row])
      );

      setSolution(generatedSolution);

      setSelectedCell(null);
      setWrongCell(null);
      setMistakes(0);
      setTime(0);
      setGameWon(false);
    },
    [difficulty]
  );

  /*
   * Start initial game
   */

  useEffect(() => {
    startGame("easy");
  }, [startGame]);

  /*
   * -----------------------------------------
   * Timer
   * -----------------------------------------
   */

  useEffect(() => {
    if (gameWon || board.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTime((previous) => previous + 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [gameWon, board.length]);

  /*
   * -----------------------------------------
   * Formatted time
   * -----------------------------------------
   */

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [time]);

  /*
   * -----------------------------------------
   * Win check
   * -----------------------------------------
   */

  const checkWin = useCallback(
    (currentBoard: Board) => {
      const solved = currentBoard.every(
        (row, rowIndex) =>
          row.every(
            (value, colIndex) =>
              value === solution[rowIndex][colIndex]
          )
      );

      if (solved) {
        setGameWon(true);
      }
    },
    [solution]
  );

  /*
   * -----------------------------------------
   * Select cell
   * -----------------------------------------
   */

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      setSelectedCell({ row, col });
      setWrongCell(null);
    },
    []
  );

  /*
   * -----------------------------------------
   * Number input
   * -----------------------------------------
   */

  const handleNumber = useCallback(
    (number: number) => {
      if (
        !selectedCell ||
        gameWon ||
        board.length === 0
      ) {
        return;
      }

      const { row, col } = selectedCell;

      // Cannot edit initial cells
      if (initialBoard[row][col] !== 0) {
        return;
      }

      // Already solved cell
      if (board[row][col] === number) {
        return;
      }

      /*
       * Wrong answer
       */

      if (number !== solution[row][col]) {
        setMistakes((previous) => previous + 1);

        setWrongCell({
          row,
          col,
          value: number,
        });

        window.setTimeout(() => {
          setWrongCell((current) => {
            if (
              current?.row === row &&
              current?.col === col &&
              current?.value === number
            ) {
              return null;
            }

            return current;
          });
        }, 700);

        return;
      }

      /*
       * Correct answer
       */

      const newBoard = board.map((currentRow) => [
        ...currentRow,
      ]);

      newBoard[row][col] = number;

      setBoard(newBoard);
      setWrongCell(null);

      checkWin(newBoard);
    },
    [
      selectedCell,
      gameWon,
      board,
      initialBoard,
      solution,
      checkWin,
    ]
  );

  /*
   * -----------------------------------------
   * Delete number
   * -----------------------------------------
   */

  const handleDelete = useCallback(() => {
    if (!selectedCell || gameWon) {
      return;
    }

    const { row, col } = selectedCell;

    if (initialBoard[row][col] !== 0) {
      return;
    }

    if (board[row][col] === 0) {
      return;
    }

    const newBoard = board.map((currentRow) => [
      ...currentRow,
    ]);

    newBoard[row][col] = 0;

    setBoard(newBoard);
    setWrongCell(null);
  }, [
    selectedCell,
    gameWon,
    initialBoard,
    board,
  ]);

  /*
   * -----------------------------------------
   * Difficulty
   * -----------------------------------------
   */

  const handleDifficultyChange = useCallback(
    (level: Difficulty) => {
      setDifficulty(level);
      startGame(level);
    },
    [startGame]
  );

  /*
   * -----------------------------------------
   * Render
   * -----------------------------------------
   */

  return (
  <main className="sudoku-game">
    <div className="sudoku-container">

      {/* Header */}
      <header className="sudoku-header">
        <div className="sudoku-logo">
          <span>🧩</span>
        </div>

        <h1>Sudoku</h1>

        <p>
          Complete the puzzle and challenge yourself
        </p>
      </header>

      {/* Stats */}
      <div className="sudoku-stats">

        <div className="sudoku-stat sudoku-stat--border">
          <span className="sudoku-stat__icon">⏱️</span>

          <span className="sudoku-stat__label">
            Time
          </span>

          <span className="sudoku-stat__value sudoku-stat__value--mono">
            {formattedTime}
          </span>
        </div>

        <div className="sudoku-stat sudoku-stat--border">
          <span className="sudoku-stat__icon">❌</span>

          <span className="sudoku-stat__label">
            Mistakes
          </span>

          <span
            className={`sudoku-stat__value ${
              mistakes > 0
                ? "sudoku-stat__value--danger"
                : ""
            }`}
          >
            {mistakes}
          </span>
        </div>

        <div className="sudoku-stat">
          <span className="sudoku-stat__icon">🎯</span>

          <span className="sudoku-stat__label">
            Level
          </span>

          <span className="sudoku-stat__value sudoku-stat__value--capitalize">
            {difficulty}
          </span>
        </div>

      </div>

      {/* Game */}
      <section className="sudoku-card">

        {board.length > 0 && (
          <SudokuBoard
            board={board}
            initialBoard={initialBoard}
            selectedCell={selectedCell}
            wrongCell={wrongCell}
            onCellClick={handleCellClick}
          />
        )}

        <NumberPad
          onNumberClick={handleNumber}
          onDelete={handleDelete}
        />

      </section>

      {/* Difficulty */}
      <section className="sudoku-difficulty">

        <p className="sudoku-section-label">
          Difficulty
        </p>

        <div className="sudoku-difficulty__buttons">
          {(["easy", "medium", "hard"] as Difficulty[]).map(
            (level) => {
              const active = difficulty === level;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    handleDifficultyChange(level)
                  }
                  className={`sudoku-difficulty__button ${
                    active
                      ? "sudoku-difficulty__button--active"
                      : ""
                  }`}
                >
                  {level}
                </button>
              );
            }
          )}
        </div>

      </section>

      {/* New Game */}
      <button
        type="button"
        onClick={() => startGame()}
        className="sudoku-new-game"
      >
        <span>↻</span>
        New Game
      </button>

      {/* Win */}
      {gameWon && (
        <div className="sudoku-win">

          <div className="sudoku-win__icon">
            🎉
          </div>

          <h2>
            Sudoku Solved!
          </h2>

          <p>
            Great job! You completed the puzzle in{" "}
            <strong>{formattedTime}</strong>.
          </p>

          <button
            type="button"
            onClick={() => startGame()}
            className="sudoku-win__button"
          >
            Play Again
          </button>

        </div>
      )}

      {/* Footer */}
      <p className="sudoku-footer">
        Take your time. Think ahead. 🧠
      </p>

    </div>
  </main>
);

}