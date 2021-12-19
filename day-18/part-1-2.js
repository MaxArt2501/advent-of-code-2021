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

const getPreviousRegular = (sfnum, index) => {
  const reversed = sfnum.slice(0, index).split('').reverse().join('');
  const previousRegularEnd = reversed.search(/\d/);
  if (previousRegularEnd < 0) {
    return -1;
  }
  const nonDigitIndex = reversed.slice(previousRegularEnd).search(/\D/);
  return index - previousRegularEnd - nonDigitIndex;
};
const getNextRegular = (sfnum, startIndex) => {
  const index = sfnum.slice(startIndex + 1).search(/\d/);
  return index >= 0 ? index + startIndex + 1 : -1;
};

const reduceNumber = number => {
  let reduced = number;
  let irregularIndex;
  do {
    irregularIndex = getFirstDeepNestedPair(reduced);
    if (irregularIndex >= 0) {
      // Exploding
      let closingIndex = reduced.indexOf(']', irregularIndex);
      const [first, second] = reduced
        .slice(irregularIndex + 1, closingIndex)
        .split(',')
        .map(Number);
      reduced = reduced.slice(0, irregularIndex) + '0' + reduced.slice(closingIndex + 1);

      const previousIndex = getPreviousRegular(reduced, irregularIndex);
      if (previousIndex >= 0) {
        const previousValue = parseInt(reduced.slice(previousIndex), 10);
        const previousValueLength = String(previousValue).length;
        const newValue = String(previousValue + first);
        reduced =
          reduced.slice(0, previousIndex) +
          newValue +
          reduced.slice(previousIndex + previousValueLength);
        irregularIndex += newValue.length - previousValueLength;
      }
      const nextIndex = getNextRegular(reduced, irregularIndex);
      if (nextIndex >= 0) {
        const nextValue = parseInt(reduced.slice(nextIndex), 10);
        const nextValueLength = String(nextValue).length;
        const newValue = String(nextValue + second);
        reduced =
          reduced.slice(0, nextIndex) +
          newValue +
          reduced.slice(nextIndex + nextValueLength);
      }
    } else {
      irregularIndex = reduced.search(/\d{2}/);
      if (irregularIndex >= 0) {
        // Splitting
        const value = parseInt(reduced.slice(irregularIndex), 10);
        reduced =
          reduced.slice(0, irregularIndex) +
          `[${value >> 1},${value - (value >> 1)}]` +
          reduced.slice(irregularIndex + String(value).length);
      }
    }
  } while (irregularIndex >= 0);
  return reduced;
};

const sum = (num1, num2) => reduceNumber(`[${num1},${num2}]`);

console.log(magnitude(JSON.parse(numbers.reduce((total, number) => sum(total, number)))));

const magnitudes = numbers.flatMap(
  (number, index) => numbers.map(
    (otherNumber, otherIndex) => index === otherIndex ? 0 : magnitude(JSON.parse(sum(number, otherNumber)))
  )
);

console.log(Math.max(...magnitudes));
