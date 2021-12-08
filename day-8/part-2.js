const readings = input.trim().split('\n')
  .map((line) => line.split(' | ').map((chunk) => chunk.split(' ')));

const sortSegments = digit => digit.split('').sort().join('');

const findDigit = (digits, length) =>
  digits.find(digit => digit.length === length);

/** Checks whether some segments completely include some other segments */
const includeSegments = (digit, segments) =>
  segments.split('').every((segment) => digit.includes(segment));

const decodeDigits = digits => {
  const decoded = Array(10);
  // These are known, as the only digits with 2/3/4/7 segments
  decoded[1] = findDigit(digits, 2);
  decoded[7] = findDigit(digits, 3);
  decoded[4] = findDigit(digits, 4);
  decoded[8] = findDigit(digits, 7);
  // 9 is the digit with 6 segments and includes all the segments that 4 has
  // It's the only one like that
  decoded[9] = digits.find(digit => digit.length == 6 && includeSegments(digit, decoded[4]));
  // 9 is the digit with 6 segments and does NOT include all the segments that 7 has
  decoded[6] = digits.find(digit => digit.length == 6 && !includeSegments(digit, decoded[7]));
  // 0 is the remaining 6-segment digit
  decoded[0] = digits.find(digit =>
    digit.length == 6 && digit !== decoded[6] && digit !== decoded[9]);
  // And so on...
  decoded[5] = digits.find(digit => digit.length == 5 && includeSegments(decoded[6], digit));
  decoded[2] = digits.find(digit => digit.length == 5 && !includeSegments(decoded[9], digit));
  decoded[3] = digits.find(digit => !decoded.includes(digit));
  return decoded.map(sortSegments);
};

const getDepth = ([ digits, depthDigits ]) => {
  const decoded = decodeDigits(digits);
  return Number(depthDigits.map(digit => decoded.indexOf(sortSegments(digit))).join(''));
};

console.log(readings.reduce((sum, reading) => sum + getDepth(reading), 0));
