import { createGameboard } from "../core/createGameboard.js";

describe("createGameboard", () => {
  it("places a ship and registers hits when attacked", () => {
    const board = createGameboard();

    board.placeShip(2, [0, 0], "horizontal");

    const r = board.receiveAttack([0, 0]);

    expect(r).toBe("hit");
    expect(board.getHitShots()).toEqual([[0, 0]]);
    expect(board.getMissedShots()).toEqual([]);
    expect(board.areAllShipsSunk()).toBe(false);
  });

  it("records missed attacks", () => {
    const board = createGameboard();

    const r = board.receiveAttack([0, 0]);

    expect(r).toBe("miss");
    expect(board.getHitShots()).toEqual([]);
    expect(board.getMissedShots()).toEqual([[0, 0]]);
  });

  it("throws if the same coordinate is attacked twice", () => {
    const board = createGameboard();

    board.receiveAttack([0, 0]);

    expect(() => board.receiveAttack([0, 0])).toThrow();
  });

  it("reports when all ships are sunk", () => {
    const board = createGameboard();

    board.placeShip(2, [0, 0], "horizontal"); // [0,0] [1,0]
    board.placeShip(1, [2, 2], "vertical"); // [2,2]

    expect(board.areAllShipsSunk()).toBe(false);

    board.receiveAttack([0, 0]);
    board.receiveAttack([1, 0]);
    expect(board.areAllShipsSunk()).toBe(false);

    board.receiveAttack([2, 2]);
    expect(board.areAllShipsSunk()).toBe(true);
  });

  it("throws when placing ship out of bounds", () => {
    const board = createGameboard();

    expect(() => board.placeShip(2, [9, 0], "horizontal")).toThrow(RangeError);
    expect(() => board.placeShip(2, [0, 9], "vertical")).toThrow(RangeError);
  });

  it("throws when placing ship overlapping another ship", () => {
    const board = createGameboard();

    board.placeShip(2, [0, 0], "horizontal");

    expect(() => board.placeShip(2, [1, 0], "vertical")).toThrow();
  });

  it("throws when attacking out of bounds", () => {
    const board = createGameboard();

    expect(() => board.receiveAttack([-1, 0])).toThrow(RangeError);
    expect(() => board.receiveAttack([10, 0])).toThrow(RangeError);
  });
});
