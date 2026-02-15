const BOARD_SIZE = 10;
const DEFAULT_FLEET = [5, 4, 3, 3, 2];
const DIRECTIONS = ["horizontal", "vertical"];

const keyOf = ([x, y]) => `${x},${y}`;

const isInBounds = ([x, y], boardSize) =>
  x >= 0 && y >= 0 && x < boardSize && y < boardSize;

const buildCoords = (length, [sx, sy], direction) =>
  Array.from({ length }, (_, i) => {
    if (direction === "horizontal") return [sx + i, sy];
    return [sx, sy + i];
  });

const pickRandomInt = (random, maxExclusive) =>
  Math.floor(random() * maxExclusive);

export const generateRandomPlacements = ({
  random = Math.random,
  boardSize = BOARD_SIZE,
  fleet = DEFAULT_FLEET,
  maxAttemptsPerShip = 100,
  maxBoardRetries = 10,
} = {}) => {
  for (let boardTry = 0; boardTry < maxBoardRetries; boardTry += 1) {
    const occupied = new Set();
    const placements = [];
    let failed = false;

    for (const length of fleet) {
      if (!Number.isInteger(length) || length <= 0 || length > boardSize) {
        throw new RangeError(`Invalid ship length for board: ${length}`);
      }

      let placed = false;

      for (let attempt = 0; attempt < maxAttemptsPerShip; attempt += 1) {
        const direction = DIRECTIONS[pickRandomInt(random, DIRECTIONS.length)];
        const maxX =
          direction === "horizontal" ? boardSize - length : boardSize - 1;
        const maxY =
          direction === "vertical" ? boardSize - length : boardSize - 1;

        const start = [
          pickRandomInt(random, maxX + 1),
          pickRandomInt(random, maxY + 1),
        ];
        const coords = buildCoords(length, start, direction);

        const overlaps = coords.some(
          (coord) =>
            !isInBounds(coord, boardSize) || occupied.has(keyOf(coord)),
        );
        if (overlaps) continue;

        coords.forEach((coord) => occupied.add(keyOf(coord)));
        placements.push({ length, start, direction });
        placed = true;
        break;
      }

      if (!placed) {
        failed = true;
        break;
      }
    }

    if (!failed) return placements;
  }

  throw new Error("Failed to generate random placements");
};

export const createRandomGamePlacements = ({ random = Math.random } = {}) => ({
  human: generateRandomPlacements({ random }),
  computer: generateRandomPlacements({ random }),
});
