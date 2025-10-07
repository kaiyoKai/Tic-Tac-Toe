export class GameSettings {
  constructor(mode = "local", boardSize = 3, winCon = 3) {
    this.mode = mode;
    this.boardSize = boardSize;
    this.winCon = winCon;
  }

  isValid() {
    return this.winCon <= this.boardSize;
  }
  fixInvalidValues() {
    if (!this.isValid()) this.winCon = this.boardSize;
  }
}
