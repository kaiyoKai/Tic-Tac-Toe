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
