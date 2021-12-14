let [polymer, rest] = input.trim().split("\n\n");
const insertions = rest
  .split("\n")
  .map((line) => line.split(" -> "))
  .reduce((map, [pair, element]) => {
    map[pair] = element;
    return map;
  }, {});

// 40 iterations means that we'd get a (19 * 2^40 + 1)-long string with the
// solution from part 1. We need to stop computing each pair individually and
// start to count them in group.
// This pairCountMap counts how many times the element pairs appear in the
// polymer. We're going to update it after each iteration.
let pairCountMap = Array.from({ length: polymer.length - 1 }, (_, index) =>
  polymer.slice(index, index + 2)
).reduce((countMap, pair) => {
  countMap[pair] = (countMap[pair] ?? 0) + 1;
  return countMap;
}, {});

// We need to keep track of the starting and ending element pair in the polymer
// See later for the explanation
let startingPair = polymer.slice(0, 2);
let endingPair = polymer.slice(-2);

for (let step = 0; step < 40; step++) {
  // We're going to build a new pairCountMap, using the current one.
  const newPairCountMap = Object.keys(pairCountMap).reduce((countMap, pair) => {
    const insertElement = insertions[pair];
    // This `if` is probably not necessary...
    if (insertElement) {
      // Each pair in the polymer will produce two pairs: one with the first
      // element and the insert element, and the other with the insert element
      // and the second element.
      const firstPair = pair[0] + insertElement;
      const secondPair = insertElement + pair[1];
      countMap[firstPair] = (countMap[firstPair] ?? 0) + pairCountMap[pair];
      countMap[secondPair] = (countMap[secondPair] ?? 0) + pairCountMap[pair];
      // If we're mutating the starting pair, we're going to keep track of that
      if (pair === startingPair) startingPair = firstPair;
      // Same for the ending pair...
      if (pair === endingPair) endingPair = secondPair;
    }
    return countMap;
  }, {});
  pairCountMap = newPairCountMap;
}

// Now that we know how many pairs of each kind are in the final polymer, we
// can count how many of each element are there. Since pairs have each
// element in common with the adjacent pairs, each element is going to be
// counted twice... *except* for the pairs at the beginning and the end of the
// polymer, and that's why we needed to keep track of those.
const elementCountDoubled = Object.entries(pairCountMap)
  .reduce((map, [[firstElement, secondElement], count]) => {
    map[firstElement] = (map[firstElement] ?? 0) + count;
    map[secondElement] = (map[secondElement] ?? 0) + count;
    return map;
  }, {});

// So we need to half the values found above.
const elementCount = Object.fromEntries(
  Object.entries(elementCountDoubled).map(([element, count]) => [
    element,
    // Adding 1 if it's the element at the beginning or the end of the polymer,
    // so that dividing by 2 will always return an integer
    (count + (element === startingPair[0] || element === endingPair[1] ? 1 : 0)) / 2,
  ])
);

const max = Math.max(...Object.values(elementCount));
const min = Math.min(...Object.values(elementCount));
console.log(max - min);
