import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const zeroSuduko = new Array(9).fill(0);
  for (let i = 0; i < 9; i++) zeroSuduko[i] = new Array(9).fill(0);

  const [sudoku, setSudoku] = useState(zeroSuduko);
  const [status, setStatus] = useState("");

  const solveSudoku = (arr, rows, cols, grid, i, j) => {
    // write your code here. Use display function to display arr

    if (i == rows.length) {
      setSudoku(arr);
      return true;
    }

    var ni = i,
      nj = j;

    if (j == cols.length - 1) {
      ni++;
      nj = 0;
    } else {
      nj++;
    }

    if (arr[i][j] != 0) {
      if (solveSudoku(arr, rows, cols, grid, ni, nj)) {
        return true;
      }
    } else {
      for (let digit = 1; digit <= 9; digit++) {
        let digitmask = 1 << digit;
        if (
          (rows[i] & digitmask) == 0 &&
          (cols[j] & digitmask) == 0 &&
          (grid[Math.floor(i / 3)][Math.floor(j / 3)] & digitmask) == 0
        ) {
          rows[i] |= digitmask; // xor can also be used
          cols[j] |= digitmask;
          grid[Math.floor(i / 3)][Math.floor(j / 3)] |= digitmask;
          arr[i][j] = digit;

          if (solveSudoku(arr, rows, cols, grid, ni, nj) === true) {
            return true;
          }

          arr[i][j] = 0;
          rows[i] ^= digitmask;
          cols[j] ^= digitmask;
          grid[Math.floor(i / 3)][Math.floor(j / 3)] ^= digitmask;
        }
      }
    }
    return false;
  };

  const solveit = () => {
    if (verifySudoku(sudoku) == false) {
      setStatus("Wrong sudoku given");
      return 0;
    }

    const arr = new Array(9).fill(0);
    for (let i = 0; i < 9; i++) arr[i] = new Array(9).fill(0);

    var rows = new Array(9).fill(0);
    var cols = new Array(9).fill(0);
    var grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        arr[i][j] = sudoku[i][j];
      }
    }

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let digit = arr[i][j];
        rows[i] = rows[i] | (1 << digit);
        cols[j] = cols[j] | (1 << digit);
        grid[Math.floor(i / 3)][Math.floor(j / 3)] =
          grid[Math.floor(i / 3)][Math.floor(j / 3)] | (1 << digit);
      }
    }

    solveSudoku(arr, rows, cols, grid, 0, 0);
    setStatus("Solved");
  };

  const reset = () => {
    setSudoku(zeroSuduko);
    setStatus("");
  };

  const randomSudoku = () => {
    reset();
    let randomArr = new Array(9).fill(0);
    do {
      randomArr = new Array(9).fill(0);
      for (let i = 0; i < 9; i++) randomArr[i] = new Array(9).fill(0);
      for (let i = 0; i < 15; i++) {
        var random1 = Math.floor(Math.random() * 9);
        var random2 = Math.floor(Math.random() * 9);
        randomArr[random1][random2] = Math.floor(Math.random() * 10);
      }
    } while (verifySudoku(randomArr) == false);
  };

  const verifySudoku = (arr) => {
    var rows = new Array(9).fill(0);
    var cols = new Array(9).fill(0);
    var grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let digit = arr[i][j];
        if (digit == 0) continue;

        let r = rows[i] | (1 << digit);
        let c = cols[j] | (1 << digit);
        let g = grid[Math.floor(i / 3)][Math.floor(j / 3)] | (1 << digit);
        if (
          r == rows[i] ||
          c == cols[j] ||
          g == grid[Math.floor(i / 3)][Math.floor(j / 3)]
        ) {
          return false;
        } else {
          rows[i] = r;
          cols[j] = c;
          grid[Math.floor(i / 3)][Math.floor(j / 3)] = g;
        }
      }
    }
    setSudoku(arr);
    setStatus("");
    return true;
  };

  useEffect(() => {
    var grid = document.getElementsByClassName("sudoku")[0];
    grid.innerHTML = "";

    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        let gitem = document.createElement("input");
        gitem.setAttribute("id", i + "_" + j);
        gitem.setAttribute("type", "number");
        if (i == 2 || i == 5) {
          gitem.style.borderBottom = "2px solid black";
        }
        if (j == 2 || j == 5) {
          gitem.style.borderRight = "2px solid black";
        }

        gitem.onchange = (e) => {
          const temp = sudoku;
          temp[gitem.id.split("_")[0]][gitem.id.split("_")[1]] = parseInt(
            e.target.value
          );
          setSudoku(temp);
        };
        gitem.value = sudoku[i][j] == 0 ? "" : sudoku[i][j];
        grid.appendChild(gitem);
      }
    }
  }, [sudoku]);

  return (
    <>
      <header>
        <h1>Sudoku Solver</h1>
      </header>
      <div className="sudoku"></div>

      <div className="buttons">
        <button onClick={reset}>Reset</button>
        <button onClick={randomSudoku}>Generate sudoku</button>
        <button onClick={solveit} id="solve">
          Solve it!
        </button>
      </div>
      <p>{status}</p>
    </>
  );
}

export default App;
