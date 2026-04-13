import { XOXOGame } from "@engine/XOXOGame.js";
import { GameSettings } from "@engine/GameSettings.js";
import { type Player } from "@players/Player.js";
import { MoveStatus } from "@shared/Common.js";
import { globalEventBus } from "@events/EventBus.js";
import { EventActor, AppEvent } from "@events/EventTypes.js";
import { Logger } from "@shared/Logger.js";

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
    Logger.log(
      EventActor.Controller,
      `Starte Game-Loop für Spiel ${this.gameId}`,
    );

    this.emitInitialState();

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

      if (
        moveStatus === MoveStatus.SUCCESS ||
        moveStatus === MoveStatus.GAME_OVER
      ) {
        const nextIdx = (this.currentIndex + 1) % this.players.length;
        const nextPlayer = this.players[nextIdx];

        globalEventBus.emit(AppEvent.Game.MoveMade, EventActor.Controller, {
          row: move.row,
          col: move.col,
          symbol: currentPlayer.symbol,
          turn: this.game.turn,
          nextPlayerSymbol: nextPlayer.symbol,
          grid: this.getBoardAsStrings(),
        });

        if (moveStatus === MoveStatus.GAME_OVER) {
          globalEventBus.emit(
            AppEvent.Game.Finished,
            EventActor.Controller,
            this.game.result!,
          );
        } else {
          this.currentIndex = nextIdx;
        }
      }
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

  private emitInitialState() {
    const nextPlayer = this.players[this.currentIndex];
    globalEventBus.emit(AppEvent.Game.Reset, EventActor.Controller, {
      turn: this.game.turn,
      nextPlayerSymbol: nextPlayer.symbol,
      settings: this.game.settings,
    });
  }
  public stop() {
    if (this.game) {
      this.game.isRunning = false;
    }
    Logger.log(EventActor.Controller, `Spiel ${this.gameId} wurde gestoppt.`);
  }
}
