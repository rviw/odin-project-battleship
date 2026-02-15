import { createGameController } from "../game/createGameController.js";

const fixedRandom = (value = 0) => {
  return () => value;
};

describe("createGameController", () => {
  it("plays one round: human attacks then computer attacks, then turn returns to human", () => {
    const game = createGameController({
      random: fixedRandom(0),
      placements: {
        human: [{ length: 1, start: [9, 9], direction: "horizontal" }],
        computer: [{ length: 1, start: [9, 9], direction: "horizontal" }],
      },
    });

    const attackResult = game.attack([0, 0]);

    expect(attackResult.human.coord).toEqual([0, 0]);
    expect(attackResult.computer.coord).toEqual([0, 0]);

    expect(game.getState().turn).toBe("human");
    expect(game.getState().winner).toBe(null);
    expect(game.getState().isOver).toBe(false);
  });

  it("ends immediately when human sinks all computer ships", () => {
    const game = createGameController({
      random: fixedRandom(0),
      placements: {
        human: [{ length: 1, start: [9, 9], direction: "horizontal" }],
        computer: [{ length: 1, start: [0, 0], direction: "horizontal" }],
      },
    });

    const attackResult = game.attack([0, 0]);

    expect(attackResult.human.result).toBe("hit");
    expect(attackResult.computer).toBe(null);

    expect(game.getState().isOver).toBe(true);
    expect(game.getState().winner).toBe("human");
    expect(game.getState().turn).toBe(null);
  });

  it("ends when computer sinks all human ships", () => {
    const game = createGameController({
      random: fixedRandom(0),
      placements: {
        human: [{ length: 1, start: [0, 0], direction: "horizontal" }],
        computer: [{ length: 1, start: [9, 9], direction: "horizontal" }],
      },
    });

    game.attack([9, 0]);

    expect(game.getState().isOver).toBe(true);
    expect(game.getState().winner).toBe("computer");
    expect(game.getState().turn).toBe(null);
  });

  it("throws if attacking after game over", () => {
    const game = createGameController({
      random: fixedRandom(0),
      placements: {
        human: [{ length: 1, start: [9, 9], direction: "horizontal" }],
        computer: [{ length: 1, start: [0, 0], direction: "horizontal" }],
      },
    });

    game.attack([0, 0]);

    expect(() => game.attack([1, 1])).toThrow();
  });
});
