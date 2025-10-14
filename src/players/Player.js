/**
 * Represents a player participating in a Tic-Tac-Toe match.
 */
export class Player {
  /**
   * @param {"human"|"bot"|"remote"} type
   * @param {string} symbol
   */
  constructor(type, symbol) {
    this.type = type;
    this.symbol = symbol;
  }
}
