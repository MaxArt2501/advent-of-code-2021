const [ numData, ...boardData ] = input.trim().split('\n\n');
// We don't actually *need* to convert to numbers, but eh.
const numbers = numData.split(',').map(Number);
const boards = boardData.map(
  rawBrd => rawBrd.split('\n').map(row => row.trim().split(/ +/).map(Number))
);

function getExtractionsToWin(board) {
  const moves = board.map(row => row.map(number => numbers.indexOf(number)));
  return Math.min(
    ...moves.map(row => Math.max(...row)),
    ...moves.map((_, index) => Math.max(...moves.map(row => row[index])))
  ) + 1; // Because indexes are 0-based
}

function getScore(board, extractions) {
  const extracted = numbers.slice(0, extractions);
  const unmarked = board.flat().filter(number => !extracted.includes(number));
  return unmarked.reduce((sum, number) => sum + number, 0) * extracted[extractions - 1];
}

const boardExtractions = boards.map(getExtractionsToWin);
const minExtractions = Math.min(...boardExtractions);
const winningBoard = boards[boardExtractions.indexOf(minExtractions)];

console.log(getScore(winningBoard, minExtractions));

const maxExtractions = Math.max(...boardExtractions);
const losingBoard = boards[boardExtractions.indexOf(maxExtractions)];

console.log(getScore(losingBoard, maxExtractions));
