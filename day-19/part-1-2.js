const input = require('fs').readFileSync('./input.txt', 'utf-8')

const joinCoords = coords => coords.join();
const parseJoined = coords => coords.split(',').map(Number);

const scanners = input
  .trim()
  .split('\n\n')
  .map((block) =>
    block
      .split('\n')
      .slice(1)
      .map(parseJoined)
  );

const ROTS = [
  (coords) => coords,
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-y, x, z]
];

const PERMS = [
  (coords) => coords,
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [x, -y, -z]
];

function* transformCoords(coordList) {
  for (const permutate of PERMS) {
    for (const rotate of ROTS) {
      yield coordList.map(
        coords => permutate(rotate(coords))
      );
    }
  }
}

const getOverlappingCoords = (coordList, referenceList) => {
  const referenceCoords = referenceList.map(joinCoords);
  for (const transformed of transformCoords(coordList)) {
    for (let index = 0; index < transformed.length; index++) {
      const point = transformed[index];
      for (let refIndex = 0; refIndex < referenceList.length; refIndex++) {
        const refPoint = referenceList[refIndex];
        const shift = point.map((coord, coordIndex) => refPoint[coordIndex] - coord);
        const shiftedTransformed = transformed.map(coords => coords.map((coord, coordIndex) => coord + shift[coordIndex]));
        const joinedPoints = new Set([
          ...referenceCoords,
          ...shiftedTransformed.map(joinCoords)
        ]);
        const repeated = transformed.length + referenceList.length - joinedPoints.size;
        if (repeated > 11) {
          // The shift will end up being the scanner's coordinates relative to scanner 0
          return { list: shiftedTransformed, shift };
        }
      }
    }
  }
};

// We'll need these for part 2
const scannerCoords = Array(scanners.length);
scannerCoords[0] = [0, 0, 0];

(() => {
  const correctedIndexes = [0];
  const indexesToBeCorrected = new Set(Array.from({ length: scanners.length - 1 }, (_, index) => index + 1));

  while (indexesToBeCorrected.size > 0) {
    for (const index of indexesToBeCorrected) {
      for (const correctedIndex of correctedIndexes) {
        const correctedCoords = getOverlappingCoords(scanners[index], scanners[correctedIndex]);
        if (correctedCoords) {
          // Scanner #index overlaps with scanner #correctedIndex
          scanners[index] = correctedCoords.list;
          scannerCoords[index] = correctedCoords.shift;
          indexesToBeCorrected.delete(index);
          correctedIndexes.push(index);
          break;
        }
      }
    }
  }
})();

const beacons = [
  ...new Set(scanners.flatMap(
    coordList => coordList.map(joinCoords)
  ))
];

console.log(beacons.length);

const getManhattanDistance = (point1, point2) => point1
  .map((coord, index) => Math.abs(coord - point2[index]))
  .reduce((sum, dist) => sum + dist);

const distances = scannerCoords.flatMap(
  (scanner, index) => scannerCoords.slice(index + 1)
    .map(other => getManhattanDistance(scanner, other))
);

console.log(Math.max(...distances));
