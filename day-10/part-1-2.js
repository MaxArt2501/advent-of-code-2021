const lines = input.trim().split('\n');

const parensEnds = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
};

const checkLine = line => {
  const parensStack = [];
  for (const parens of line) {
    if (parens in parensEnds) {
      parensStack.push(parens);
    } else {
      const matchingOpening = parensStack.pop();
      if (parens !== parensEnds[matchingOpening]) {
        return { mismatch: parens };
      }
    }
  }
  return { missing: parensStack.reverse().map(parens => parensEnds[parens]) };
};

const mismatchingParentheses = lines.flatMap(line => {
  const { mismatch } = checkLine(line);
  return mismatch ? [ mismatch ] : [];
});

const mismatchValue = {
  ')' : 3,
  ']' : 57,
  '}' : 1197,
  '>' : 25137
};
console.log(mismatchingParentheses.reduce((sum, parens) => sum + mismatchValue[parens], 0));

const missingValues = lines.flatMap(line => {
  const { missing } = checkLine(line);
  return missing ? [
    missing.reduce((sum, parens) => sum * 5 + ')]}>'.indexOf(parens) + 1, 0)
  ] : [];
}).sort((a, b) => a - b);

console.log(missingValues[missingValues.length / 2 - .5]);
