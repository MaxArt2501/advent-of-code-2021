const initialPositions = input.trim().split('\n').map(
  line => Number(line.slice('Player 1 starting position: '.length))
);

// With three 3-side dice, this maps each possible outcome with the number of
// combinations that give that outcome. We are going to need these to compute
// the number of possible universes that have a given game configuration (that
// is made of each player's position and score).
// E.g. 5 can be obtained in 6 ways (1-1-3, 1-3-1, 3-1-1, 1-2-2, 2-1-2, 2-2-1),
// thus leading to 6 different universes.
const outcomeMap = { 3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1 };

const wins = [0, 0];
function roll(scores, positions, turn, universes) {
  for (let outcome = 3; outcome <= 9; outcome++) {
    const newUniverses = universes * outcomeMap[outcome];
    const newPositions = positions.slice();
    newPositions[turn] += outcome;
    const newScores = scores.slice();
    newScores[turn] += newPositions[turn] % 10 || 10;
    if (newScores[turn] >= 21) {
      wins[turn] += newUniverses;
    } else {
      roll(newScores, newPositions, 1 - turn, newUniverses);
    }
  }
}

roll([0, 0], initialPositions, 0, 1);

console.log(Math.max(...wins));
