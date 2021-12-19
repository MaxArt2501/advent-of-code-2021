const numbers = input.trim().split('\n');

const magnitude = ([a, b]) =>
  3 * (typeof a == 'number' ? a : magnitude(a)) +
  2 * (typeof b == 'number' ? b : magnitude(b));

const regularPairRE = /^\d+,\d+/;
const getFirstDeepNestedPair = (sfnum) => {
  const splitted = sfnum.split('[').slice(1);
  let openCount = 0;
  let index = 0;
  for (const chunk of splitted) {
    if (openCount > 3 && regularPairRE.test(chunk)) {
      return index;
    }
    const closing = chunk.split(']').length - 1;
    openCount += 1 - closing;
    index += chunk.length + 1;
  }
  return -1;
};

const reduceNumber = number => {
  let reduced = number;
  let invalidIndex;
  do {
    invalidIndex = getFirstDeepNestedPair(reduced);
    if (invalidIndex >= 0) {
      // Exploding
      let closingIndex = reduced.indexOf(']', invalidIndex);
      const [first, second] = reduced
        .slice(invalidIndex + 1, closingIndex)
        .split(',').map(Number);
      reduced = reduced.slice(0, invalidIndex)
        .replace(/\d+(?=\D*$)/, regularNumber => Number(regularNumber) + first)
        + '0'
        + reduced.slice(closingIndex + 1)
          .replace(/\d+/, regularNumber => Number(regularNumber) + second);
    } else {
      invalidIndex = reduced.search(/\d{2}/);
      if (invalidIndex >= 0) {
        // Splitting
        const value = parseInt(reduced.slice(invalidIndex), 10);
        reduced =
          reduced.slice(0, invalidIndex) +
          `[${value >> 1},${value - (value >> 1)}]` +
          reduced.slice(invalidIndex + String(value).length);
      }
    }
  } while (invalidIndex >= 0);
  return reduced;
};

const sum = (num1, num2) => reduceNumber(`[${num1},${num2}]`);

console.log(magnitude(JSON.parse(numbers.reduce(sum))));

const magnitudes = numbers.flatMap(
  (number, index) => numbers.map(
    (otherNumber, otherIndex) => index === otherIndex ? 0 : magnitude(JSON.parse(sum(number, otherNumber)))
  )
);

console.log(Math.max(...magnitudes));
