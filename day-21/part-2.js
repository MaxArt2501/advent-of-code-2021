const [initialPos1, initialPos2] = input.trim().split('\n').map(
  line => Number(line.slice('Player 1 starting position: '.length))
);

// With three 3-side dice, this maps each possible outcome with the number of
// combinations that give that outcome. We are going to need these to compute
// the number of possible universes that have a given game configuration (that
// is made of each player's position and score).
// E.g. 5 can be obtained in 6 ways (1-1-3, 1-3-1, 3-1-1, 1-2-2, 2-1-2, 2-2-1),
// thus leading to 6 different universes.
const outcomeMap = { 3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1 };

let p1Wins = 0;
let p2Wins = 0;
function roll(score1, score2, pos1, pos2, universes) {
  for (let outcome1 = 3; outcome1 <= 9; outcome1++) {
    const p1Universes = universes * outcomeMap[outcome1];
    const newPos1 = pos1 + outcome1;
    const newScore1 = score1 + (newPos1 % 10 || 10);
    if (newScore1 >= 21) {
      p1Wins += p1Universes;
      continue;
    }
    for (let outcome2 = 3; outcome2 <= 9; outcome2++) {
      const newPos2 = pos2 + outcome2;
      const newScore2 = score2 + (newPos2 % 10 || 10);
      const p2Universes = p1Universes * outcomeMap[outcome2];
      if (newScore2 >= 21) {
        p2Wins += p2Universes;
      } else {
        roll(newScore1, newScore2, newPos1, newPos2, p2Universes);
      }
    }
  }
}

roll(0, 0, initialPos1, initialPos2, 1);

console.log(Math.max(p1Wins, p2Wins));
