const INSTRUCTION_MATCHER =
  /^(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/;
const instructions = input.trim().split('\n').map((line) => {
  const [, status, x0, x1, y0, y1, z0, z1] = line.match(INSTRUCTION_MATCHER);
  return { status, x: [+x0, +x1], y: [+y0, +y1], z: [+z0, +z1] };
});

const isSmallInstruction = instruction => ['x', 'y', 'z']
  .every(axis => instruction[axis].every(value => Math.abs(value) <= 50));
const cuboidSize = ({ x, y, z }) => (x[1] - x[0] + 1) * (y[1] - y[0] + 1) * (z[1] - z[0] + 1);

const areOverlapping = (cuboid1, cuboid2) => cuboid1.x[1] >= cuboid2.x[0]
  && cuboid2.x[1] >= cuboid1.x[0]
  && cuboid1.y[1] >= cuboid2.y[0]
  && cuboid2.y[1] >= cuboid1.y[0]
  && cuboid1.z[1] >= cuboid2.z[0]
  && cuboid2.z[1] >= cuboid1.z[0];

// The idea is to subtract cuboids, but in doing so the result will comprise
// up to 26 smaller convex cuboids, which all compose the minuend except the
// cuboid in common with the subtrahend.
// We suppose minuend and subtrahend to be overlapping.
const subtract = (minuend, subtrahend) => {
  const axisIntervals = {x: [], y:[], z:[]};
  for (const axis of 'xyz') {
    // First, determine the interval in common between the axis' intervals of
    // the minuend and the subtrahend.
    const commonInterval = [
      Math.max(subtrahend[axis][0], minuend[axis][0]),
      Math.min(subtrahend[axis][1], minuend[axis][1])
    ];
    axisIntervals[axis] = [commonInterval];
    // Then we push the possible intervals that are specific to the minuend.
    // We'll need them to generate the cuboids that are not in common with
    // the subtrahend.
    if (minuend[axis][0] < subtrahend[axis][0]) {
      axisIntervals[axis].push([minuend[axis][0], subtrahend[axis][0] - 1]);
    }
    if (minuend[axis][1] > subtrahend[axis][1]) {
      axisIntervals[axis].push([subtrahend[axis][1] + 1, minuend[axis][1]]);
    }
  }
  const remainingCuboids = [];
  axisIntervals.x.forEach((x, xIdx) => {
    axisIntervals.y.forEach((y, yIdx) => {
      axisIntervals.z.forEach((z, zIdx) => {
        // Skipping the common cuboid (the one with all 0 indexes)
        if (xIdx > 0 || yIdx > 0 || zIdx > 0) {
          remainingCuboids.push({ x, y, z });
        }
      });
    });
  });
  return remainingCuboids;
};

const lightCuboids = instructionList => {
  const litCuboids = new Set();
  for (const { status, ...cuboid } of instructionList) {
    for (const litCuboid of litCuboids) {
      if (areOverlapping(cuboid, litCuboid)) {
        const difference = subtract(litCuboid, cuboid);
        litCuboids.delete(litCuboid);
        for (const newCuboid of difference) {
          litCuboids.add(newCuboid);
        }
      }
    }
    if (status === 'on') {
      litCuboids.add(cuboid);
    }
  }
  return Array.from(litCuboids).reduce((sum, cuboid) => sum + cuboidSize(cuboid), 0);
};

console.log(lightCuboids(instructions.filter(isSmallInstruction)));
console.log(lightCuboids(instructions));
