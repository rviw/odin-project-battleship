import { createPlayer } from "../core/createPlayer.js";

const applyPlacements = (board, placements) => {
  for (const p of placements) {
    board.placeShip(p.length, p.start, p.direction);
  }
};

export const createGameController = ({
  random = Math.random,
  placements = { human: [], computer: [] },
} = {}) => {
  const human = createPlayer("human");
  const computer = createPlayer("computer", { random });

  applyPlacements(human.board, placements.human);
  applyPlacements(computer.board, placements.computer);

  let turn = "human";
  let winner = null;
  let isOver = false;

  const getState = () => ({
    turn,
    winner,
    isOver,
  });

  const endGame = (who) => {
    winner = who;
    isOver = true;
    turn = null;
  };

  const attack = (coord) => {
    if (isOver) throw new Error("Game is over");
    if (turn !== "human") throw new Error("Not human turn");

    const humanMove = human.attack(computer.board, coord);

    if (computer.board.areAllShipsSunk()) {
      endGame("human");
      return { human: humanMove, computer: null };
    }

    turn = "computer";
    const computerMove = computer.attack(human.board);

    if (human.board.areAllShipsSunk()) {
      endGame("computer");
      return { human: humanMove, computer: computerMove };
    }

    turn = "human";
    return { human: humanMove, computer: computerMove };
  };

  return {
    human,
    computer,
    getState,
    attack,
  };
};
