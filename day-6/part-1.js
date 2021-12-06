let fishTimers = input.split(',').map(Number);

// I knew this wasn't efficient from the start, but for the first part is
// fast enough. See part 2 for something *much* more efficient.
const evolve = population => population
  .flatMap(timer => timer === 0 ? [6, 8] : [timer - 1]);

for (let index = 0; index < 80; index++) {
  fishTimers = evolve(fishTimers);
}

console.log(fishTimers.length);
