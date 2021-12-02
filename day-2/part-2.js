const moves = input.trim().split('\n').map(command => command.split(' '));
let position = 0;
let depth = 0;
let aim = 0;
for (const [direction, amount] of moves) {
  if (direction === 'forward') {
    position += +amount;
    depth += aim * amount;
  } else {
    aim += amount * (direction === 'up' ? -1 : 1);
  }
}

depth * position;
