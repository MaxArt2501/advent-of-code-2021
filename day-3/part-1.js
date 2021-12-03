const values = input.trim().split('\n');

function countOnes(index) {
  return values.reduce((count, value) => count += value[index] === '1', 0);
}

const bits = values[0].length;
const gamma = parseInt(Array.from(values[0], (_, index) => countOnes(index) >= (values.length >> 1) ? 1 : 0).join(''), 2);
const epsilon = (1 << bits) - gamma - 1;

console.log(gamma * epsilon);
