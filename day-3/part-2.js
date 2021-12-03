const values = input.trim().split('\n');

function countOnes(list, index) {
  return list.reduce((count, value) => count + (value[index] === '1'), 0);
}

function siftByCriteria(bitForLessOnes) {
  const bitForMoreOnes = bitForLessOnes === '0' ? '1' : '0';
  let index = 0;
  let siftedList = values;
  while (siftedList.length > 1) {
    const ones = countOnes(siftedList, index);
    const zeros = siftedList.length - ones;
    const requiredBit = ones < zeros ? bitForLessOnes : bitForMoreOnes;
    siftedList = siftedList.filter(value => value[index] === requiredBit);
    index++;
  }

  return parseInt(siftedList[0], 2);
}

console.log(siftByCriteria('0') * siftByCriteria('1'));
