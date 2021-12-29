// BOY it this hasn't requested a toll on my spare time while visiting
// relatives! Fortunately, the second part needed just a slight change to work.
// Some explanations are definitely required because, in the end, *we don't
// even need to run the "ALU" at all!* We just need to examine the underlying
// code and understand how it works.
// Basically, we have a set of 252 instructions that we can split into 14
// groups of 18 instructions each, differing from each other by just 3 values,
// all as the second argument of their respective instructions:
// - `zDivisor` on the 5th instruction: it can be either 1 or... another fixed
//   value (it was 26 for me) and it's used to divide `z`;
// - `xAdder` on the 6th instruction: added to `x` at a certain point, it can
//   be >= 10 (if `zDivider` is 1) or negative (otherwhise);
// - `yAdder` on the 16th instruction, which can be either positive or negative
// I guess all puzzle inputs differ by just the values used, and never by the
// given instructions.
// An instruction sequence like `mul x 0; add x z` basically means setting `x`
// equal to `z`. We can thus infer that each of the 18-instruction groups just
// take two values: the one it gets from the initial `inp w` instrucction; and
// the value of `z` from the computation of the previous group.
// A deeper inspection reveal that if `zDivider` is 1, then `x` is always 1,
// therefore the final value for `z` will always be greater than the value we
// started with. In order to reduce `z` to 0 we need `x` to be 0, and that
// only may happen only when `zDivider` is not 1. And if you notice the values
// for it, for 7 times it's 1 and for the remaining 7 it's not... Convenient,
// huh? Also, the first one is always 1 and the last one is of course not 1.
// If `zDivider` is 1, then `z = 26 * z + w + yAdder` (that 26 might differ?);
// and if `zDivider` is *not* 1, then if we manage to get `x` to be 0 then `z`
// has the value it had *before* it increased its value the previous time
// `zDivider` was 1.
// In the end, we can completely avoid brute force and compute the digits by
// playing with the sum of `xAdder` and `yAdder` from a previous group. We
// don't even need to compute any `z`!
// Clear? No? Of course not, it was a heck of a puzzle just on Christmas' eve!
// I'm just disappointed that I didn't implement a *general* solution, but
// rather a specific implementation for this set of instructions.

const instructions = input.trim().split('\n').map(line => line.split(' '));
const groupSize = instructions.length / 14; // Should be 18

const valueGroups = instructions.reduce((groups, [opcode, _, value], index) => {
  if (opcode === 'inp') {
    groups.push([]);
  }
  if ([4, 5, 15].includes(index % groupSize)) {
    groups[groups.length - 1].push(Number(value));
  }
  return groups;
}, []);

// We compute the digits in pairs, each time `zDivider` is not 1.
// The `digitPicker` is a function that selects the digit from the previous
// index, given the sum between `xAdder` and the previous `yAdder`. It's the
// only thing that changes in the second part of the puzzle.
function getModelNumber(digitPicker) {
  const digits = Array(14);
  const stack = [];
  valueGroups.forEach(([zDivisor, xAdder, yAdder], index) => {
    if (zDivisor === 1) {
      // In this case, we store yAdder into the stack, together with the
      // current index (to retroset the relative digit)
      stack.push([yAdder, index]);
    } else {
      const [prevYAdder, prevIndex] = stack.pop();
      const sum = prevYAdder + xAdder;
      digits[prevIndex] = digitPicker(sum);
      digits[index] = digits[prevIndex] + sum;
    }
  });

  return digits.join('');
}

console.log(getModelNumber(sum => Math.min(9, 9 - sum)));
console.log(getModelNumber(sum => Math.max(1, 1 - sum)));
