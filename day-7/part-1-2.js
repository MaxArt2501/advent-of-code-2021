const positions = input.split(',').map(Number);
const minPos = Math.min(...positions);
const maxPos = Math.max(...positions);

const linearConsumptions = Array.from(
  { length: maxPos - minPos + 1 },
  (_, pos) => positions.reduce(
    (total, crabPos) => total + Math.abs(pos + minPos - crabPos), 0
  )
);

console.log(Math.min(...linearConsumptions));

const triangularConsumptions = Array.from(
  { length: maxPos - minPos + 1 },
  (_, pos) => positions.reduce((total, crabPos) => {
    const diff = Math.abs(pos - crabPos);
    /** Note: the sum of the integers from 0 to n is n*(n + 1)/2
     * @see {@link https://en.wikipedia.org/wiki/Triangular_number} */
    return total + diff * (diff + 1) / 2;
  }, 0)
);

console.log(Math.min(...triangularConsumptions));
