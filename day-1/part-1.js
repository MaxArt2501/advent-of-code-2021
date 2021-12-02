const measurements = input.trim().split('\n').map(Number);
let goDownCount = 0;
measurements.forEach((depth, index) => {
  if (index > 0 && depth > measurements[index - 1]) {
    goDownCount++;
  }
});

goDownCount;
