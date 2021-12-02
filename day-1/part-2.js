const measurements = input.trim().split('\n').map(Number);
const sumsOf3 = measurements.slice(2)
  .map((depth, index) => depth + measurements[index] + measurements[index + 1]);

let goDownCount = 0;
sumsOf3.forEach((sum, index) => {
  if (index > 0 && sum > sumsOf3[index - 1]) {
    goDownCount++;
  }
});

goDownCount;
