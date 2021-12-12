const exits = input.trim().split('\n').reduce((map, connection) => {
  const [e1, e2] = connection.split('-');

  if (e1 in map) map[e1].push(e2);
  else map[e1] = [ e2 ];

  if (e2 in map) map[e2].push(e1);
  else map[e2] = [ e1 ];

  return map;
}, {});

const smallCave = Object.keys(exits).reduce((map, cave) => {
  map[cave] = !/[A-Z]/.test(cave);
  return map;
}, {});

const paths = new Set([ 'start' ]);
// Using a regex to check if a path has passed through a small cave twice is not
// very efficient, but it does its job.
const twoSmallCavesCheck = /,([a-z]+),.+?,\1/;
let openPaths;

while ((openPaths = [...paths].filter(path => !path.includes('end'))).length > 0) {
  for (const path of openPaths) {
    // If `path` doesn't include a comma (i.e. we're at the start), this still
    // gives the correct index! In fact, -1 + 1 = 0.
    const lastCave = path.slice(path.lastIndexOf(',') + 1);
    for (const nextCave of exits[lastCave]) {
      if (!smallCave[nextCave]
        || !path.includes(nextCave)
        || (nextCave !== 'start' && !twoSmallCavesCheck.test(path))
      ) {
        paths.add(`${path},${nextCave}`);
      }
    }
    paths.delete(path);
  }
}

console.log(paths.size);
