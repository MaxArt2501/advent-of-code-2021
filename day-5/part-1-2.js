const lines = input.trim().split('\n').map(
  row => row.split(' -> ').map(coords => coords.split(',').map(Number))
);

const isHortogonal = ([[ x1, y1 ], [ x2, y2 ]]) => x1 === x2 || y1 === y2;

const getDangerousPoints = lines => {
  const countMap = {};
  for (const [[ x1, y1 ], [ x2, y2 ]] of lines) {
    if (x1 === x2) for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      const key = `${x1},${y}`;
      countMap[key] = (countMap[key] ?? 0) + 1;
    } else {
      const dx = Math.sign(x2 - x1);
      const dy = Math.sign(y2 - y1);
      for (let x = x1, y = y1; x !== x2 + dx; x += dx, y += dy) {
        const key = `${x},${y}`;
        countMap[key] = (countMap[key] ?? 0) + 1;
      }
    }
  }
  return Object.values(countMap).filter(count => count > 1).length;
}

console.log(getDangerousPoints(lines.filter(isHortogonal)));

console.log(getDangerousPoints(lines));
