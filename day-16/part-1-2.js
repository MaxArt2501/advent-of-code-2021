const binaryInput = [...input.trim()]
    .map((hexDigit) => parseInt(hexDigit, 16)
    .toString(2)
    .padStart(4, 0)).join('');

const binaryValue = (binaryString, startIndex, length) => parseInt(binaryString.substr(startIndex, length), 2);

const decode = (binaryString, startIndex) => {
  const version = binaryValue(binaryString, startIndex, 3);
  const type = binaryValue(binaryString, startIndex + 3, 3);
  let endIndex = startIndex + 6;
  if (type == 4) {
    let value = 0;
    let chunk;
    do {
      chunk = binaryValue(binaryString, endIndex, 5);
      endIndex += 5;
      value = (value * 16) + (chunk & 15);
    } while (chunk > 15);
    return { version, type, value, endIndex, totalVersion: version };
  }

  const lengthId = +binaryString[endIndex++];
  const subPackets = [];
  if (lengthId) {
    const length = binaryValue(binaryString, endIndex, 11);
    endIndex += 11;
    for (let z = 0; z < length; z++) {
      const nextPacket = decode(binaryString, endIndex);
      subPackets.push(nextPacket);
      endIndex = nextPacket.endIndex;
    }
  } else {
    const length = binaryValue(binaryString, endIndex, 15);
    const finalIndex = length + endIndex + 15;
    endIndex += 15;
    while (endIndex < finalIndex) {
      const nextPacket = decode(binaryString, endIndex);
      subPackets.push(nextPacket);
      endIndex = nextPacket.endIndex;
    }
  }
  const totalVersion = version + subPackets.reduce((sum, packet) => sum + packet.totalVersion, 0);
  return { version, type, subPackets, endIndex, totalVersion };
};

const packetTree = decode(binaryInput, 0);
console.log(packetTree.totalVersion);

const compute = ({ type, value, subPackets }) => {
  switch (type) {
    case 0:
      return subPackets.reduce((sum, packet) => sum + compute(packet), 0);
    case 1:
      return subPackets.reduce((product, packet) => product * compute(packet), 1);
    case 2:
      return Math.min(...subPackets.map(compute));
    case 3:
      return Math.max(...subPackets.map(compute));
    case 4:
      return value;
    case 5:
      return +(compute(subPackets[0]) > compute(subPackets[1]));
    case 6:
      return +(compute(subPackets[0]) < compute(subPackets[1]));
    case 7:
      return +(compute(subPackets[0]) === compute(subPackets[1]));
  }
};

console.log(compute(packetTree));
