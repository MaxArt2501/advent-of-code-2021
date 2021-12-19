// I'm expecting minX and maxX to be positive, while minY and maxY to be
// negative.
const [, minX, maxX, minY, maxY] = input
  .match(/^target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)$/)
  .map(Number);

// The minimum x-velocity to reach the area
const minVx = Math.ceil((-1 + Math.sqrt(1 + 8 * minX)) / 2);
// We need to maximize the time the probe goes up, but we also cannot overshoot
// so there's also an upper limit for the x-velocity.
const maxVx = Math.floor((-1 + Math.sqrt(1 + 8 * maxX)) / 2);

// We *could* computer this too but eh, not really worth it.
const minVx = 0;
// Now keep in mind that, for example, the y-velocity is 20, then after 20
// steps the probe will have a y-velocity of 0, and after 40 it will have a
// y-velocity of -20 (i.e. the opposite of the initial y-velocity) *and* will
// have a y coordinate of 0. So, in the next step it will be at y = -21.
// This means that if the initial y-velocity is greater or equal than the
// absolute value of minY, the probe will overshoot in the y-axis.
const maxVy = -1 - minY;

const willReachArea = (vx, vy) => {
  let x = 0;
  let y = 0;
  while (x <= maxX && y >= minY) {
    x += vx;
    y += vy;
    vx = Math.max(0, vx - 1);
    vy--;
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return true;
    }
  }
  return false;
};

let topYVelocity = -Infinity;
for (let vx = minVx; vx <= maxVx; vx++) {
  for (let vy = maxVy; vy >= minVx; vy--) {
    if (willReachArea(vx, vy) && topYVelocity < vy) {
      topYVelocity = vy;
    }
  }
}

// After topYVelocity steps, the probe will reach the top.
console.log(topYVelocity * (topYVelocity + 1) / 2);

// For part 2, we can just count...
let validVelocities = 0;
for (let vx = minVx; vx <= maxX; vx++) {
  for (let vy = minY; vy <= maxVy; vy++) {
    if (willReachArea(vx, vy)) {
      validVelocities++;
    }
  }
}

console.log(validVelocities);
