import { createGameboard } from "../core/createGameboard.js";
import {
  generateRandomPlacements,
  createRandomGamePlacements,
} from "../game/placements.js";

const DEFAULT_FLEET = [5, 4, 3, 3, 2];
const BOARD_SIZE = 10;

const makeSeededRandom = (seed = 1) => {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
};

const coordsForPlacement = ({ length, start: [sx, sy], direction }) =>
  Array.from({ length }, (_, i) => {
    if (direction === "horizontal") return [sx + i, sy];
    return [sx, sy + i];
  });

describe("placements", () => {
  it("generates default fleet with valid placement shape", () => {
    const placements = generateRandomPlacements({ random: makeSeededRandom(1) });

    expect(placements).toHaveLength(DEFAULT_FLEET.length);
    expect(placements.map((p) => p.length)).toEqual(DEFAULT_FLEET);

    for (const p of placements) {
      expect(Array.isArray(p.start)).toBe(true);
      expect(p.start).toHaveLength(2);
      expect(["horizontal", "vertical"]).toContain(p.direction);
      expect(Number.isInteger(p.start[0])).toBe(true);
      expect(Number.isInteger(p.start[1])).toBe(true);
    }
  });

  it("keeps every generated coordinate in-bounds and non-overlapping", () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const placements = generateRandomPlacements({
        random: makeSeededRandom(seed),
      });

      const seen = new Set();

      for (const p of placements) {
        const coords = coordsForPlacement(p);

        for (const [x, y] of coords) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(BOARD_SIZE);
          expect(y).toBeLessThan(BOARD_SIZE);

          const key = `${x},${y}`;
          expect(seen.has(key)).toBe(false);
          seen.add(key);
        }
      }
    }
  });

  it("produces placements that can be applied to a gameboard", () => {
    const placements = generateRandomPlacements({ random: makeSeededRandom(7) });
    const board = createGameboard();

    for (const p of placements) {
      board.placeShip(p.length, p.start, p.direction);
    }

    for (const p of placements) {
      for (const coord of coordsForPlacement(p)) {
        expect(board.hasShipAt(coord)).toBe(true);
      }
    }
  });

  it("creates random placements for both human and computer", () => {
    const gamePlacements = createRandomGamePlacements({
      random: makeSeededRandom(42),
    });

    expect(gamePlacements.human).toHaveLength(DEFAULT_FLEET.length);
    expect(gamePlacements.computer).toHaveLength(DEFAULT_FLEET.length);
    expect(gamePlacements.human).not.toBe(gamePlacements.computer);
  });

  it("throws RangeError when a fleet item is invalid for board size", () => {
    expect(() =>
      generateRandomPlacements({ boardSize: 5, fleet: [6] }),
    ).toThrow(RangeError);
  });

  it("throws when retries are exhausted and no valid layout is found", () => {
    expect(() =>
      generateRandomPlacements({
        random: () => 0,
        boardSize: 2,
        fleet: [2, 2, 2],
        maxAttemptsPerShip: 1,
        maxBoardRetries: 1,
      }),
    ).toThrow("Failed to generate random placements");
  });
});
