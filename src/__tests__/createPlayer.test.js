import { createPlayer } from "../core/createPlayer.js";
import { createGameboard } from "../core/createGameboard.js";

const fixedRandom = (value = 0) => {
  return () => value;
};

describe("createPlayer", () => {
  it("creates a player with a type and its own board", () => {
    const p = createPlayer("human");

    expect(p.type).toBe("human");
    expect(p.board).toBeTruthy();
    expect(typeof p.board.placeShip).toBe("function");
  });

  it("human attacks with a provided coordinate", () => {
    const human = createPlayer("human");
    const enemyBoard = createGameboard();

    const { coord, result } = human.attack(enemyBoard, [1, 2]);

    expect(coord).toEqual([1, 2]);
    expect(result).toBe("miss");
    expect(enemyBoard.getMissedShots()).toEqual([[1, 2]]);
  });

  it("human attack throws if coordinate is missing", () => {
    const human = createPlayer("human");
    const enemyBoard = createGameboard();

    expect(() => human.attack(enemyBoard)).toThrow();
  });

  it("computer never repeats a move", () => {
    const computer = createPlayer("computer", { random: fixedRandom(0) });
    const enemyBoard = createGameboard();

    const coordKeys = new Set();

    for (let i = 0; i < 10; i += 1) {
      const { coord } = computer.attack(enemyBoard);
      coordKeys.add(coord.join(","));
    }

    expect(coordKeys.size).toBe(10);
    expect(enemyBoard.getMissedShots().length).toBe(10);
  });
});
