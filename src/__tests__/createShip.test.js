import { createShip } from "../core/createShip.js";

describe("createShip", () => {
  it("creates a ship with length and 0 hits", () => {
    const ship = createShip(3);

    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
    expect(ship.isSunk()).toBe(false);
  });

  it("increments hits when hit() is called", () => {
    const ship = createShip(3);

    ship.hit();
    ship.hit();

    expect(ship.hits).toBe(2);
    expect(ship.isSunk()).toBe(false);
  });

  it("is sunck when hits reach its length", () => {
    const ship = createShip(2);

    ship.hit();
    ship.hit();

    expect(ship.hits).toBe(2);
    expect(ship.isSunk()).toBe(true);
  });

  it("does not increase hits past length", () => {
    const ship = createShip(1);

    ship.hit();
    ship.hit();

    expect(ship.hits).toBe(1);
    expect(ship.isSunk()).toBe(true);
  });

  it("throws if length is not a positive integer", () => {
    expect(() => createShip(0)).toThrow(TypeError);
    expect(() => createShip(-1)).toThrow(TypeError);
    expect(() => createShip(2.5)).toThrow(TypeError);
  });
});
