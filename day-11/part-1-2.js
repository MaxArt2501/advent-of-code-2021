const input = require('fs').readFileSync('./input.txt', 'utf-8');

const octs = input.trim().split('\n').map(line => [...line].map(Number));
const rows = octs.length;
const cols = octs[0].length;

const getAdjacentCoords = (row, column) => {
  const adjacent = [];
  const minRow = Math.max(0, row - 1);
  const maxRow = Math.min(rows - 1, row + 1);
  const minCol = Math.max(0, column - 1);
  const maxCol = Math.min(cols - 1, column + 1);
  for (let _row = minRow; _row <= maxRow; _row++) {
    for (let _col = minCol; _col <= maxCol; _col++) {
      if (_row !== row || _col !== column) {
        adjacent.push([_row, _col]);
      }
    }
  }
  return adjacent;
};

const evolve = grid => {
  const evolved = grid.map(line => line.map(oct => oct + 1));
  while (evolved.join().includes('10')) {
    evolved.forEach((line, row) => line.forEach((level, column) => {
      if (level < 10) return;
      evolved[row][column] = 0;
      for (const [_row, _col] of getAdjacentCoords(row, column)) {
        const adjLevel = evolved[_row][_col];
        if (adjLevel > 0 && adjLevel < 10) {
          evolved[_row][_col] = adjLevel + 1;
        }
      }
    }));
  }
  return evolved;
};

let flashes = 0;
for (let step = 0, grid = octs; step < 100; step++) {
  grid = evolve(grid);
  flashes += grid.join().split('0').length - 1;
}

console.log(flashes);
const ALL_FLASHES = '0,'.repeat(99) + '0';

let step = 0;
let grid = octs;
while (grid.join() !== ALL_FLASHES) {
  grid = evolve(grid);
  step++;
}

console.log(step);
