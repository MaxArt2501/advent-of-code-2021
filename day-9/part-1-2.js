const heightmap = input.trim().split('\n')
  .map(line => line.split('').map(Number));

const isLowPoint = (row, column) => {
  const height = heightmap[row][column];
  return (!row || heightmap[row - 1][column] > height)
    && (!column || heightmap[row][column - 1] > height)
    && (row === heightmap.length - 1 || heightmap[row + 1][column] > height)
    && (column === heightmap[0].length - 1 || heightmap[row][column + 1] > height);
};

const lowPoints = heightmap.flatMap(
  (line, row) => line.flatMap((_, column) => isLowPoint(row, column) ? [[row, column]] : [])
);

console.log(lowPoints.reduce(
  (totalRisk, [row, column]) => totalRisk + heightmap[row][column] + 1, 0
));

const getBasinSize = coords => {
  const basin = new Set([coords.join()]);
  let size;
  do {
    size = basin.size;
    for (const basinCoords of basin.values()) {
      const [row, column] = basinCoords.split(',').map(Number);
      // This isn't very efficient, as coordinates might get added multiple
      // times, but it does its job. A Set will take care of the repetitions.
      if (row > 0 && heightmap[row - 1][column] < 9) {
        basin.add(row - 1 + ',' + column);
      }
      if (row < heightmap.length - 1 && heightmap[row + 1][column] < 9) {
        basin.add(row + 1 + ',' + column);
      }
      if (column > 0 && heightmap[row][column - 1] < 9) {
        basin.add(row + ',' + (column - 1));
      }
      if (column < heightmap[0].length - 1 && heightmap[row][column + 1] < 9) {
        basin.add(row + ',' + (column + 1));
      }
    }
  } while (size < basin.size);
  return size;
};

const basinSizes = lowPoints.map(getBasinSize).sort((a, b) => b - a);

console.log(basinSizes[0] * basinSizes[1] * basinSizes[2]);
