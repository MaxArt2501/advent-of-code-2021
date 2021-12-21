let positions = input.trim().split('\n').map(
  line => Number(line.slice('Player 1 starting position: '.length))
);
let scores = [0, 0];
let triRolls = 0;
let turn = 0;
while (scores[1 - turn] < 1000) {
  // We roll 3 times at once (hence `triRolls`). We may not care to go back to
  // 1 when reaching 100 since we always take the value modulo 10: we might as
  // well imagine the die to have infinite sides...
  positions[turn] += (triRolls++) * 9 + 6;
  scores[turn] += positions[turn] % 10 || 10;
  // Flip the current turn!
  turn = 1 - turn;
}
console.log(Math.min(...scores) * triRolls * 3);
