let [ polymer, rest ] = input.trim().split('\n\n');
const insertions = rest.split('\n').map(line => line.split(' -> '))
  .reduce((map, [ pair, element ]) => {
    map[pair] = element;
    return map;
  }, {});

for (let step = 0; step < 10; step++) {
  let next = polymer[0];
  for (let index = 0; index < polymer.length - 1; index++) {
    const pair = polymer.slice(index, index + 2);
    next += (insertions[pair] ?? '') + pair[1];
  }
  polymer = next;
}

const elementCount = polymer.split('').reduce((map, element) => {
  map[element] = (map[element] ?? 0) + 1;
  return map;
}, {});

const max = Math.max(...Object.values(elementCount));
const min = Math.min(...Object.values(elementCount));
console.log(max - min);
