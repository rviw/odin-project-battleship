import "./styles.css";

import { createGameController } from "./game/createGameController.js";
import { createRandomGamePlacements } from "./game/placements.js";
import {
  getEl,
  renderBoard,
  bindEnemyBoardClicks,
  bindNewGameClick,
} from "./ui/index.js";

const playerBoardEl = getEl("#player-board");
const computerBoardEl = getEl("#computer-board");
const statusEl = getEl("#status");
const newGameBtnEl = getEl("#new-game-btn");

let game = null;
let lastResult = null;

const setStatus = (text) => {
  statusEl.textContent = text;
};

const createGame = () =>
  createGameController({
    placements: createRandomGamePlacements(),
  });

const render = () => {
  renderBoard(playerBoardEl, game.human.board, {
    revealShips: true,
    interactive: false,
  });

  renderBoard(computerBoardEl, game.computer.board, {
    revealShips: false,
    interactive: !game.getState().isOver,
  });
};

const setStatusForTurn = () => {
  if (game.getState().isOver) {
    setStatus(`Game over - ${game.getState().winner} wins!`);
    return;
  }

  if (!lastResult) {
    setStatus("Your turn: click a cell on the computer board.");
    return;
  }

  const humanText = `You attacked ${lastResult.human.coord.join(",")} (${lastResult.human.result}).`;
  const computerText = lastResult.computer
    ? ` Computer attacked ${lastResult.computer.coord.join(",")} (${lastResult.computer.result}).`
    : "";

  setStatus(`${humanText}${computerText}`);
};

const renderAll = () => {
  render();
  setStatusForTurn();
};

const startNewGame = () => {
  game = createGame();
  lastResult = null;
  renderAll();
};

bindEnemyBoardClicks(computerBoardEl, (coord) => {
  if (game.getState().isOver) return;

  if (game.computer.board.getAttackState(coord) !== "unattacked") return;

  try {
    lastResult = game.attack(coord);
    renderAll();
  } catch (e) {
    setStatus(String(e.message || e));
  }
});

bindNewGameClick(newGameBtnEl, startNewGame);

startNewGame();
