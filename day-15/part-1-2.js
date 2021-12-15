const originalMap = input.trim().split('\n').map(line => [...line].map(Number));
let currentMap = originalMap;

// This is... not very efficient. It takes ~1.3s for the first part and ~4.5m
// for the second on my Ryzen 5 3600 and 16 GB RAM. But it does its job...
// The hard part is to take some optimal paths that goes up or left. Consider
// the following map:
// 19111
// 11191
// Of course the best path from the top left to the bottom right corser follows
// the 1's, but if our algorithm just moves down and right (as the examples
// might suggest it's enough), we won't get the correct answer.
const getMinPathTo = (row, column) => {
  // The idea is to keep a set of frontier points mapped to the value needed to
  // reach them. We don't care about the path used to reach them, only about
  // the minimum value we get to reach them.
  // We start from the top left corner, which has a value of 0, and expand the
  // frontier until it still has points.
  const frontierValues = new Map([['0,0', 0]]);
  const finalCoords = row + ',' + column;
  // Once we reach the final coordinates, we track the computed value so far. It
  // serves as an upper bound to the other paths (if a point has a larger value,
  // it's removed from the frontier as it won't get us a better final value).
  let minValue = Infinity;
  const insertPoint = (ptRow, ptCol, value) => {
    const moveCoords = ptRow + ',' + ptCol;
    const moveValue = Math.min(frontierValues.get(moveCoords) ?? Infinity, value + currentMap[ptRow][ptCol]);
    frontierValues.set(moveCoords, moveValue);
    if (moveCoords === finalCoords) minValue = Math.min(minValue, moveValue);
  }
  while (frontierValues.size)
    for (const [coords, value] of frontierValues.entries()) {
      if (value < minValue) {
        const [pointRow, pointCol] = coords.split(',').map(Number);
        if (pointRow < currentMap.length - 1) {
          insertPoint(pointRow + 1, pointCol, value);
        }
        if (pointCol < currentMap[0].length - 1) {
          insertPoint(pointRow, pointCol + 1, value);
        }
        if (pointRow) {
          insertPoint(pointRow - 1, pointCol, value);
        }
        if (pointCol) {
          insertPoint(pointRow, pointCol - 1, value);
        }
      }
      // We moved away from this point, so we remove it from the frontier
      frontierValues.delete(coords);
    }
  return minValue;
};

console.log(getMinPathTo(currentMap.length - 1, currentMap[0].length - 1));

// We start building our larger map...
currentMap = [];

for (let i = 0; i < 5; i++) {
  originalMap.forEach((_, row) => {
    currentMap[i * originalMap.length + row] = [];
  });
  for (let j = 0; j < 5; j++) {
    const dist = i + j;
    originalMap.forEach((line,row) => line.forEach(
      (value, column) => currentMap[i * originalMap.length + row][j * originalMap[0].length + column] = (value + dist - 1) % 9 + 1
    ));
  }
}

console.log(getMinPathTo(currentMap.length - 1, currentMap[0].length - 1));
