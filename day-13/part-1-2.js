const [ coords, instructions ] = input.trim().split('\n\n');

let dots = coords.split('\n').map(line => line.split(',').map(Number));

const folds = instructions.split('\n').map(line => {
  const [ axis, value ] = line.slice('fold along '.length).split('=');
  return [ axis, Number(value) ];
});

folds.forEach(([ axis, value ], index) => {
  dots = dots.map(([ x, y ]) => {
    if (axis === 'x') {
      return x > value ? [ value * 2 - x, y ] : [ x, y ];
    }
    return y > value ? [ x, value * 2 - y ] : [ x, y ];
  });
  if (index === 0) {
    // Part 1 solution
    const uniqueDots = new Set(dots.map(String));
    console.log(uniqueDots.size);
  }
});

// We *could* reduce the list of dots at this point but eh, they're 902 for me
// so I say it's fast enough.
const maxX = Math.max(...dots.map(([ x ]) => x));
const maxY = Math.max(...dots.map(([ , y ]) => y));
const dotMatrix = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill(' '));

for (const [ x, y ] of dots) {
  dotMatrix[y][x] = '#';
}
// Just read the result, I'm not doing any character recognition 😜
console.log(dotMatrix.map(line => line.join('')).join('\n'));
