import { createShip } from "./createShip.js";

const BOARD_SIZE = 10;

const keyOf = ([x, y]) => `${x},${y}`;

const isValidCoord = ([x, y]) =>
  Number.isInteger(x) &&
  Number.isInteger(y) &&
  x >= 0 &&
  y >= 0 &&
  x < BOARD_SIZE &&
  y < BOARD_SIZE;

const isValidDirection = (direction) =>
  direction === "horizontal" || direction === "vertical";

export const createGameboard = () => {
  const ships = [];
  const occupied = new Map();
  const attacked = new Set();
  const missedShots = [];
  const hitShots = [];

  const placeShip = (length, startCoord, direction) => {
    if (!isValidCoord(startCoord)) {
      throw new RangeError("Invalid start coordinate");
    }
    if (!isValidDirection(direction)) {
      throw new TypeError("Invalid direction");
    }

    const [sx, sy] = startCoord;

    const coords = Array.from({ length }, (_, i) => {
      const x = direction === "horizontal" ? sx + i : sx;
      const y = direction === "vertical" ? sy + i : sy;
      return [x, y];
    });

    for (const coord of coords) {
      if (!isValidCoord(coord))
        throw new RangeError("Ship placement out of bounds");
      if (occupied.has(keyOf(coord)))
        throw new Error("Ship placement overlaps");
    }

    const ship = createShip(length);
    ships.push(ship);

    for (const coord of coords) {
      occupied.set(keyOf(coord), ship);
    }

    return ship;
  };

  const receiveAttack = (coord) => {
    if (!isValidCoord(coord)) throw new RangeError("Invalid attack coordinate");

    const k = keyOf(coord);
    if (attacked.has(k)) throw new Error("Coordinate already attacked");

    attacked.add(k);

    const [x, y] = coord;
    const ship = occupied.get(k);

    if (ship) {
      ship.hit();
      hitShots.push([x, y]);
      return "hit";
    }

    missedShots.push([x, y]);
    return "miss";
  };

  const getMissedShots = () => missedShots.map(([x, y]) => [x, y]);
  const getHitShots = () => hitShots.map(([x, y]) => [x, y]);

  const areAllShipsSunk = () =>
    ships.length > 0 && ships.every((ship) => ship.isSunk());

  return {
    placeShip,
    receiveAttack,
    getMissedShots,
    getHitShots,
    areAllShipsSunk,
  };
};
