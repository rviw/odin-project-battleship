export const bindEnemyBoardClicks = (container, onClickCell) => {
  container.addEventListener("click", (e) => {
    const cell = e.target.closest(".cell");
    if (!cell || !container.contains(cell)) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    if (!Number.isInteger(x) || !Number.isInteger(y)) return;

    onClickCell([x, y]);
  });
};
