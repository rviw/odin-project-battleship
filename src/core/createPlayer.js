import { createGameboard } from "./createGameboard.js";

const BOARD_SIZE = 10;

const keyOf = ([x, y]) => `${x},${y}`;

const buildAllCoords = () => {
  const coords = [];
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      coords.push([x, y]);
    }
  }
  return coords;
};

export const createPlayer = (type = "human", { random = Math.random } = {}) => {
  if (type !== "human" && type !== "computer") {
    throw new TypeError("Player type must be 'human' or 'computer'");
  }

  const board = createGameboard();
  const previousAttacks = new Set();

  const remainingMoves = type === "computer" ? buildAllCoords() : null;

  const pickComputerCoord = () => {
    if (!remainingMoves || remainingMoves.length === 0) {
      throw new Error("No legal moves remaining");
    }

    const idx = Math.floor(random() * remainingMoves.length);

    const last = remainingMoves.length - 1;
    [remainingMoves[idx], remainingMoves[last]] = [
      remainingMoves[last],
      remainingMoves[idx],
    ];

    return remainingMoves.pop();
  };

  const attack = (enemyBoard, coord) => {
    if (!enemyBoard || typeof enemyBoard.receiveAttack !== "function") {
      throw new TypeError("enemyBoard must provide receiveAttack()");
    }

    let chosen = coord;

    if (type === "human") {
      if (!Array.isArray(chosen) || chosen.length !== 2) {
        throw new TypeError("Human attack requires a coordinate [x, y]");
      }
    } else {
      if (chosen !== undefined) {
        throw new TypeError("Computer attack does not accept a coordinate");
      }
      chosen = pickComputerCoord();
    }

    const key = keyOf(chosen);
    if (previousAttacks.has(key)) {
      throw new Error("Coordinate already attacked by this player");
    }

    previousAttacks.add(key);
    const result = enemyBoard.receiveAttack(chosen);

    return { coord: chosen, result };
  };

  return {
    type,
    board,
    attack,
  };
};
