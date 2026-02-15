const BOARD_SIZE = 10;

const createCell = ({ x, y, className = "" } = {}) => {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = `cell${className ? ` ${className}` : ""}`;
  cell.dataset.x = String(x);
  cell.dataset.y = String(y);
  cell.setAttribute("aria-label", `Cell ${x},${y}`);
  return cell;
};

const classForState = (attackState) => {
  if (attackState === "hit") return "cell--hit";
  if (attackState === "miss") return "cell--miss";
  return "";
};

export const renderBoard = (container, board, { revealShips = false } = {}) => {
  container.replaceChildren();

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const coord = [x, y];

      const attackState = board.getAttackState(coord);
      let className = classForState(attackState);

      if (
        revealShips &&
        attackState === "unattacked" &&
        board.hasShipAt(coord)
      ) {
        className = `${className} cell--ship`.trim();
      }

      const cell = createCell({ x, y, className });
      container.append(cell);
    }
  }
};
