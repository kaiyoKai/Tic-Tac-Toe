import { XOXOGame } from "@engine/XOXOGame.js";
import { GameSettings } from "@engine/GameSettings.js";
import { type Player } from "@players/Player.js";
import { MoveStatus } from "@shared/Common.js";

export class GameController {
  public game: XOXOGame;
  public players: Player[];
  public currentIndex: number = 0;
  private gameId: number;
  private static totalGames = 0;

  constructor(settings: GameSettings, players: Player[]) {
    this.game = new XOXOGame(settings);
    this.players = players;
    GameController.totalGames++;
    this.gameId = GameController.totalGames;
  }

  public async startGameLoop() {
    console.log(`Starte Game-Loop für Spiel ${this.gameId}`);

    while (this.game.isRunning) {
      const currentPlayer = this.players[this.currentIndex];

      const move = await currentPlayer.makeMove(this.game);

      if (!move || !this.game.isRunning) break;

      const moveStatus = this.game.makeMove(
        move.row,
        move.col,
        currentPlayer.userId,
        currentPlayer.symbol,
      );
    }
  }

  private getBoardAsStrings(): string[][] {
    const size = this.game.board.size;
    const uiBoard: string[][] = [];
    for (let r = 0; r < size; r++) {
      const row: string[] = [];
      for (let c = 0; c < size; c++) {
        const cellPlayerId = this.game.board.getCell(r, c);
        if (cellPlayerId === 0) {
          row.push("");
        } else {
          const player = this.players.find((p) => p.userId === cellPlayerId);
          row.push(player ? (player.symbol as unknown as string) : "");
        }
      }
      uiBoard.push(row);
    }
    return uiBoard;
  }
}
