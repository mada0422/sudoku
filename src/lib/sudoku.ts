import { Board, Difficulty } from "@/types/sudoku";

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () =>
    Array(9).fill(0)
  );
}

export function isValidMove(
  board: Board,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

function shuffle(numbers: number[]): number[] {
  const result = [...numbers];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function solveSudoku(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }

        return false;
      }
    }
  }

  return true;
}


export function generateSolvedBoard(): Board {
  const board = createEmptyBoard();

  solveSudoku(board);

  return board;
}

// Create the puzzle
export function generatePuzzle(
  difficulty: Difficulty
): {
  puzzle: Board;
  solution: Board;
} {
  const solution = generateSolvedBoard();

  const puzzle = solution.map((row) => [...row]);

  const cellsToRemove = {
    easy: 35,
    medium: 45,
    hard: 55,
  };

  let removed = 0;

  while (removed < cellsToRemove[difficulty]) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }

  return {
    puzzle,
    solution,
  };
}
