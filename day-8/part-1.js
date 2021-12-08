const readings = input.trim().split('\n')
  .map(line => line.split(' | ').map(chunk => chunk.split(' ')));

const isUniqueDigit = digit => digit.length < 5 || digit.length === 7;

const uniqueDigits = readings.reduce(
  (count, [, digits]) => count + digits.filter(isUniqueDigit).length, 0
);

console.log(uniqueDigits);
