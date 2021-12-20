// I'm quite disappointed by this day's example. Everyone got an enhancing
// string that transform dark spaces into lit spaces, and vice-versa (i.e.,
// the enhanced character for 0 is # and the one for 511 is .). This means that
// the whole *infinite* image is *flashing* every two enhancements.
// Take that into account, and the rest is relatively easy...
const [enhanceString, rest] = input.trim().split('\n\n');
let image = rest.split('\n');

function getAroundIndex(image, row, column) {
  const lines = [
    image[row - 1],
    image[row],
    image[row + 1]
  ].map(line => line.substr(column + 1, 3));
  return parseInt(lines.join('').replace(/\./g, '0').replace(/#/g, '1'), 2);
}

function expand(image, filler = '.') {
  const newLine = filler.repeat(image[0].length + 4);
  return [
    newLine,
    newLine,
    ...image.map(line => filler + filler + line + filler + filler),
    newLine,
    newLine
  ];
}

function enhance(image, filler = '.') {
  const expanded = expand(image, filler);
  const enhanced = [];
  for (let row = 1; row < expanded.length - 1; row++) {
    const line = expanded[row];
    let newLine = '';
    for (let column = -1; column < line.length - 3; column++) {
      newLine += enhanceString[getAroundIndex(expanded, row, column)];
    }
    enhanced.push(newLine);
  }
  return enhanced;
}

function multipleEnhance(image, times) {
  let enhanced = image;
  for (let count = 0; count < times; count++) {
    const filler = count & 1 ? '#' : '.';
    enhanced = enhance(enhanced, filler);
  }
  return enhanced.join('').split('#').length - 1;
}

console.log(multipleEnhance(image, 2));
console.log(multipleEnhance(image, 50));
