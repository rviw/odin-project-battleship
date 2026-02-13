export const createShip = (length) => {
  if (!Number.isInteger(length) || length <= 0) {
    throw new TypeError("Ship length must be a positive integer");
  }

  let hits = 0;

  return {
    get length() {
      return length;
    },

    get hits() {
      return hits;
    },

    hit() {
      if (hits < length) hits += 1;
    },

    isSunk() {
      return hits >= length;
    },
  };
};
