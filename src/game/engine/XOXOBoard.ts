export class XOXOBoard {
  public size: number;
  public state: Uint8Array;

  constructor(size: number = 3) {
    this.size = size;
    this.state = new Uint8Array(this.size * this.size);
  }

  private getIndex(row: number, col: number): number {
    return row * this.size + col;
  }

  public getCell(row: number, col: number): number {
    return this.state[this.getIndex(row, col)];
  }

  public setCell(row: number, col: number, playerId: number): void {
    this.state[this.getIndex(row, col)] = playerId;
  }

  public clear(): void {
    this.state.fill(0);
  }

  public rotateClockwise(turns: number = 1): void {
    const normalizedTurns = ((turns % 4) + 4) % 4;
    for (let i = 0; i < normalizedTurns; i++) {
      const next = new Uint8Array(this.size * this.size);
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const newRow = col;
          const newCol = this.size - row - 1;
          next[newRow * this.size + newCol] = this.getCell(row, col);
        }
      }
      this.state = next;
    }
  }

  public applyGravity(): void {
    for (let col = 0; col < this.size; col++) {
      const values: number[] = [];
      for (let row = this.size - 1; row >= 0; row--) {
        const cell = this.getCell(row, col);
        if (cell !== 0) {
          values.push(cell);
        }
      }

      for (let row = this.size - 1; row >= 0; row--) {
        this.setCell(row, col, values[this.size - 1 - row] ?? 0);
      }
    }
  }

  public isFull(): boolean {
    return !this.state.includes(0);
  }

  public isInsideBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }
  copy() {
    const newBoard = new XOXOBoard(this.size);
    newBoard.state.set(this.state);
    return newBoard;
  }
}
