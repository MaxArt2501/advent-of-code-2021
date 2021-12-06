const fishTimers = input.split(',').map(Number);

// The solution for the first part wasn't fast enough for 256 iterations, so I
// needed another strategy. Rather than keeping track of *all* the fish' timers
// we can count how many timers have reached 0, how many 1 and so on up to 8.
let timerCounts = Array(9).fill(0);
for (const timer of fishTimers) {
  timerCounts[timer]++;
}

const evolve = counts => counts.map((_, timer) => {
  if (timer === 6) {
    return counts[0] + counts[7];
  }
  if (timer === 8) {
    return counts[0];
  }
  return counts[timer + 1];
});

for (let index = 0; index < 256; index++) {
  timerCounts = evolve(timerCounts);
}

// Now we sum all the counts...
console.log(timerCounts.reduce((sum, count) => sum + count));
