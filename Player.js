/**
 * @param {"human"|"bot"|"remote"} type
 * @param {string} symbol
 */
export class Player {
  constructor(type, symbol) {
    this.type = type;
    this.symbol = symbol;
  }
}
