// I'm not proud of this implementation, but... I needed things to be done! 😬
const map = input.trim().split('\n').map(line => line.split(''));

function evolve() {
  // Moving to the East...
  for (let row = 0; row < map.length; row++) {
    const mapRow = map[row];
    // We need to keep the first on the row, because it could be emptied if
    // the second cell is empty. But that would mess the movement of the *last*
    // cell in the row.
    const [first] = mapRow;
    for (let column = 0; column < mapRow.length; column++)
      if (mapRow[column] === '>' && (column < mapRow.length - 1 ? mapRow[column + 1] : first) === '.') {
        mapRow[column] = '.';
        mapRow[(column + 1) % mapRow.length] = '>';
        column++;
      }
  }
  // Moving to the South...
  for (let column = 0; column < map[0].length; column++) {
    // Same as above
    const first = map[0][column];
    for (let row = 0; row < map.length; row++) {
      if (map[row][column] === 'v' && (row < map.length - 1 ? map[row + 1][column] : first) === '.') {
        map[row][column] = '.';
        map[(row + 1) % map.length][column] = 'v';
        row++;
      }
    }
  }
}

let prevSnapshot;
let currSnapshot = map.join();
let steps = 0;
do {
  prevSnapshot = currSnapshot;
  evolve();
  steps++;
  currSnapshot = map.join();
} while (currSnapshot !== prevSnapshot);

console.log(steps);
