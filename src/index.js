import "./styles.css";

import { createGameController } from "./game/createGameController.js";
import { getEl, renderBoard, bindEnemyBoardClicks } from "./ui/index.js";

const game = createGameController({
  placements: {
    human: [
      { length: 5, start: [0, 0], direction: "horizontal" },
      { length: 4, start: [0, 2], direction: "horizontal" },
      { length: 3, start: [0, 4], direction: "horizontal" },
      { length: 3, start: [0, 6], direction: "horizontal" },
      { length: 2, start: [0, 8], direction: "horizontal" },
    ],
    computer: [
      { length: 5, start: [0, 0], direction: "vertical" },
      { length: 4, start: [2, 0], direction: "vertical" },
      { length: 3, start: [4, 0], direction: "vertical" },
      { length: 3, start: [6, 0], direction: "vertical" },
      { length: 2, start: [8, 0], direction: "vertical" },
    ],
  },
});

const playerBoardEl = getEl("#player-board");
const computerBoardEl = getEl("#computer-board");
const statusEl = getEl("#status");

const setStatus = (text) => {
  statusEl.textContent = text;
};

const render = () => {
  renderBoard(playerBoardEl, game.human.board, { revealShips: true });
  renderBoard(computerBoardEl, game.computer.board, { revealShips: false });
};

setStatus("Your turn: click a cell on the computer board.");
render();

bindEnemyBoardClicks(computerBoardEl, (coord) => {
  if (game.getState().isOver) return;

  if (game.computer.board.getAttackState(coord) !== "unattacked") return;

  try {
    const result = game.attack(coord);

    if (game.getState().isOver) {
      setStatus(`Game over - ${game.getState().winner} wins!`);
    } else {
      setStatus(
        `You attacked ${result.human.coord.join(",")} (${result.human.result}). ` +
          `Computer attacked ${result.computer.coord.join(",")} (${result.computer.result}).`,
      );
    }

    render();
  } catch (e) {
    setStatus(String(e.message || e));
  }
});
