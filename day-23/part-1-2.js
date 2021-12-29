const rawSequence = input.replace(/[^ABCD]/g, '');

const parseBeginning = sequence => Array.from(
  { length: 4 },
  (_, index) => Array.from({ length: sequence.length >> 2}, (__, roomIdx) => sequence[(roomIdx << 2) + index])
);

const validHallwayPositions = [1, 2, 4, 6, 8, 10, 11];
const roomPositions = [3, 5, 7, 9];
const amphipodRooms = { A: 0, B: 1, C: 2, D: 3 };
const amphipodCosts = { A: 1, B: 10, C: 100, D: 1000 };

// We keep track of the cost of every reached configuration and the cost of
// reaching our goal configuration. Because this is just another application
// of Dijkstra's path finding algorithm.
let minCost = Infinity;
const costs = new Map();
let finalRoomConfig = '';

function getMinCost(sequence) {
  // Note: we'll consider room 0-3 as the "regular", vertical rooms, and room 4
  // as the hallway.
  const initialRooms = parseBeginning(sequence);
  initialRooms[4] = Array(7).fill(null);

  const roomDepth = initialRooms[0].length;
  finalRoomConfig = 'ABCD'.replace(/./g, letter => (letter + ',').repeat(roomDepth)) + ',,,,,,';

  minCost = Infinity;
  costs.clear();

  evolve(initialRooms, 0);
  return minCost;
}

function getMoveCost(amphipod, start, end) {
  const startHallPos = start.room === 4 ? validHallwayPositions[start.slot] : roomPositions[start.room];
  const endHallPos = end.room === 4 ? validHallwayPositions[end.slot] : roomPositions[end.room];
  const hallDist = Math.abs(startHallPos - endHallPos);
  const roomDist = (start.room === 4 ? 0 : start.slot + 1) + (end.room === 4 ? 0 : end.slot + 1);
  return (hallDist + roomDist) * amphipodCosts[amphipod];
}

function applyMove({ rooms, cost }, start, end) {
  const newRooms = rooms.map(r => r.slice());
  const amphipod = newRooms[start.room][start.slot];
  newRooms[start.room][start.slot] = null;
  newRooms[end.room][end.slot] = amphipod;
  const moveCost = getMoveCost(amphipod, start, end);
  evolve(newRooms, cost + moveCost);
}

function evolve(rooms, cost) {
  const roomKey = rooms.join();
  if (cost >= costs.get(roomKey) ?? minCost) {
    return;
  }
  costs.set(roomKey, cost);
  if (roomKey === finalRoomConfig) {
    minCost = cost;
    return;
  }

  for (let room = 0; room < rooms.length; room++) {
    const slots = rooms[room];
    if (room === 4) {
      // Trying to move the amphipods in the hallway back into their rooms
      for (let slot = 0; slot < slots.length; slot++) {
        const amphipod = slots[slot];
        if (amphipod === null) {
          continue;
        }
        const ownRoom = amphipodRooms[amphipod];
        const freeRoomIndex = rooms[ownRoom].lastIndexOf(null);
        const isRoomAvailable = rooms[ownRoom].slice(freeRoomIndex + 1).every(occupant => occupant === amphipod);
        const canMoveInRoom = isRoomAvailable && validHallwayPositions.every((_, idx) => {
          return idx <= Math.min(slot, ownRoom + 1) || idx >= Math.max(slot, ownRoom + 2) || rooms[4][idx] === null;
        });
        if (canMoveInRoom) {
          applyMove({ rooms, cost }, { room, slot }, { room: ownRoom, slot: freeRoomIndex });
        }
      }
    } else {
      // Moving the first amphipod in the room to the hallway.
      // We *could* move an amphipod directly in its own room if possibile, but
      // doing it in two moves instead of one won't change the total cost.
      const slot = slots.lastIndexOf(null) + 1;
      if (slot === slots.length) {
        // This room is empty. Duh.
        continue;
      }
      const isInPlace = room === amphipodRooms[slots[slot]]
        && slots.slice(slot + 1).every(occupant => occupant === slots[slot]);
      if (isInPlace) {
        // If the amphipod is already in the right place, we do nothing
        continue;
      }

      // Checking if it's possible to move in the slots before...
      for (let index = room + 1; index >= 0; index--) {
        if (rooms[4][index]) {
          break;
        }
        applyMove({ rooms, cost }, { room, slot }, { room: 4, slot: index });
      }
      // ... and after the room
      for (let index = room + 2; index < validHallwayPositions.length; index++) {
        if (rooms[4][index]) {
          break;
        }
        applyMove({ rooms, cost }, { room, slot }, { room: 4, slot: index });
      }
    }
  }
}

console.log(getMinCost(rawSequence));
console.log(getMinCost(rawSequence.slice(0, 4) + 'DCBADBAC' + rawSequence.slice(4)));
