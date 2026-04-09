import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { WinType, type IGameResult } from "@shared/Common.js";
import { GameSettings } from "@engine/GameSettings.js";
import "./GameLogo.js";
import { keyed } from "lit/directives/keyed.js";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import { Subscribe } from "@events/Decorators.ts";
import { globalEventBus } from "@events/EventBus.ts";

@customElement("game-board")
export class GameBoard extends LitElement {
  @property({ type: Object }) settings = new GameSettings();

  @property({ type: String }) cellRadius = "5%";
  @property({ type: Number }) turnNumber = 1;
  @property({ type: String }) currentPlayer = "";
  @property({ type: String }) winnerMessage = "";

  @state() private gameId = 0;
  @state() public cells: string[][] = [];

  constructor() {
    super();
    this.initBoard();
  }

  willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has("settings")) {
      const oldSettings = changedProperties.get("settings") as GameSettings;
      if (!oldSettings || this.settings.boardSize !== oldSettings.boardSize) {
        this.initBoard();
      }
    }
  }

  private initBoard() {
    this.cells = Array.from({ length: this.settings.boardSize }, () =>
      Array(this.settings.boardSize).fill(""),
    );
  }

  @Subscribe(AppEvent.Game.BoardState, EventActor.Controller)
  public onBoardState(data: any) {
    this.cells = data.grid.map((row: any[]) => row.map((cell) => cell || ""));
  }

  @Subscribe(AppEvent.Game.MoveMade, EventActor.Controller)
  public onMoveMade(data: any) {
    this.turnNumber = data.turn;
    this.currentPlayer = data.nextPlayerSymbol;
    this.updateCell(data.row, data.col, data.symbol);
  }

  @Subscribe(AppEvent.Game.Finished, EventActor.Controller)
  public async onGameFinished(result: IGameResult) {
    this.winnerMessage = result.winner
      ? `${result.winner} hat gewonnen!`
      : "Unentschieden!";
    await this.showWinAnimation(result);
  }

  @Subscribe(AppEvent.Game.SettingsChanged, EventActor.Controller)
  public onSettingsChanged(newSettings: any) {
    // Nur aktualisieren, wenn sich die Werte wirklich unterscheiden
    if (JSON.stringify(this.settings) !== JSON.stringify(newSettings)) {
      this.settings = Object.assign(new GameSettings(), newSettings);
    }
  }

  @Subscribe(AppEvent.Game.Reset, EventActor.Controller)
  public onReset(data?: any) {
    // Falls beim Reset neue Settings mitkommen, übernehmen wir diese
    if (
      data?.settings &&
      JSON.stringify(this.settings) !== JSON.stringify(data.settings)
    ) {
      this.settings = Object.assign(new GameSettings(), data.settings);
    }
    this.resetBoard();
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }
    .game-header {
      flex-shrink: 0;
      text-align: center;
      padding: 1rem 0;
    }
    .status-container {
      display: flex;
      gap: 2rem;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .victory-message {
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--color-win);
      min-height: 2.2rem;
      text-transform: uppercase;
    }
    .board-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
      padding: 1rem;
      container-type: inline-size;
    }
    .grid {
      display: grid;
      gap: 0.5rem;
      max-width: 100%;
      max-height: 100%;
      aspect-ratio: 1 / 1;
    }
    button.cell-btn {
      width: 100%;
      height: 100%;
      aspect-ratio: 1 / 1;
      background-color: var(--cell-bg);
      border: 0.25rem solid var(--border-color);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      overflow: hidden;
    }
    button.cell-btn:hover {
      background-color: var(--cell-hover);
      border-color: var(--primary-accent);
      z-index: 10;
      transform: scale(1.03);
    }
    button.cell-btn::after {
      content: "";
      position: absolute;
      top: var(--line-top, 50%);
      left: var(--line-left, 0%);
      width: var(--after-width, 100%);
      height: 0.4rem;
      background-color: var(--text-main);
      transform-origin: left center;
      transform: translate(0, -50%) rotate(var(--angle, 0deg)) scaleX(0);
      transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
      pointer-events: none;
      z-index: 20;
      border-radius: 1rem;
    }
    button.draw-line::after {
      transform: translate(0, -50%) rotate(var(--angle, 0deg)) scaleX(1);
    }
    button.win {
      background-color: var(--color-win) !important;
      border-color: var(--text-main);
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }
    button.spin {
      animation: winRotate 0.8s forwards;
    }
    @keyframes winRotate {
      from {
        transform: rotateY(0deg);
      }
      to {
        transform: rotateY(360deg);
      }
    }
    .action-panel {
      flex-shrink: 0;
      padding: 1rem 0 2rem 0;
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .reset-btn {
      padding: 0.8rem 2rem;
      font-weight: 700;
      background: var(--cell-bg);
      color: var(--text-main);
      border: 0.2rem solid var(--border-color);
      border-radius: 1rem;
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <style>
        .grid {
          display: grid;
          gap: 0.5rem;
          grid-template-columns: repeat(${this.settings.boardSize}, 1fr);
          grid-template-rows: repeat(${this.settings.boardSize}, 1fr);
          width: min(100%, 60vh);
          aspect-ratio: 1 / 1;
          margin: 0 auto;
        }
        button.cell-btn {
          border-radius: ${this.cellRadius};
          font-size: calc((60vh / ${this.settings.boardSize}) * 0.6);
        }
      </style>
      <header class="game-header">
        <div class="status-container">
          <span>Spieler: ${this.currentPlayer}</span>
          <span>Zug: ${this.turnNumber}</span>
        </div>
        <div class="victory-message">${this.winnerMessage}</div>
      </header>

      <div class="board-wrapper">
        ${keyed(
          this.gameId,
          html`
            <div class="grid" @click="${this._handleCellClick}">
              ${this.cells.map((row, r) =>
                row.map(
                  (cell, c) => html`
                    <button
                      class="cell-btn"
                      data-row="${r}"
                      data-col="${c}"
                      id="btn-${r}-${c}"
                    >
                      ${cell}
                    </button>
                  `,
                ),
              )}
            </div>
          `,
        )}
      </div>

      <div class="action-panel">
        <button class="reset-btn" @click="${this._handleResetClick}">
          Neu starten
        </button>
        <button
          class="reset-btn end-btn"
          @click="${this._handleEndClick}"
          style="margin-left: 1rem; border-color: #f38ba8;"
        >
          Beenden
        </button>
      </div>
    `;
  }

  private _handleEndClick() {
    globalEventBus.emit(AppEvent.UI.AppEndRequested, EventActor.WebUI);
  }

  private _handleCellClick(e: Event) {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "button.cell-btn",
    );
    if (!btn || btn.innerText !== "" || this.winnerMessage !== "") return;

    const cell = {
      row: parseInt(btn.dataset.row!),
      col: parseInt(btn.dataset.col!),
    };
    globalEventBus.emit(AppEvent.UI.CellClicked, EventActor.WebUI, cell);
  }

  private _handleResetClick() {
    globalEventBus.emit(AppEvent.UI.ResetRequested, EventActor.WebUI);
  }

  public updateCell(row: number, col: number, symbol: string) {
    const newCells = [...this.cells];
    newCells[row][col] = symbol;
    this.cells = newCells;
  }

  public resetBoard() {
    this.gameId++;
    this.initBoard();
    this.winnerMessage = "";
    this.turnNumber = 1;
  }

  public async showWinAnimation(result: IGameResult) {
    const currentTicket = this.gameId;
    if (result.type === WinType.Draw || !result.positions) return;

    if (result.type === WinType.DiagonalAnti) {
      result.positions.sort((a, b) => b.row - a.row);
    }

    const config = this.getLineConfig(result.type as WinType);
    const winningButtons = result.positions
      .map((pos) =>
        this.shadowRoot?.getElementById(`btn-${pos.row}-${pos.col}`),
      )
      .filter((btn): btn is HTMLButtonElement => !!btn);

    const spinPromises = winningButtons.map((btn) => {
      btn.classList.add("win", "spin");
      return new Promise<void>((resolve) => {
        btn.addEventListener("animationend", () => resolve(), { once: true });
      });
    });

    await Promise.all(spinPromises);
    if (this.gameId !== currentTicket) return;

    winningButtons.forEach((btn) => {
      btn.style.setProperty("--after-width", config.width);
      btn.style.setProperty("--line-top", config.top);
      btn.style.setProperty("--line-left", config.left);
      btn.style.setProperty("--angle", config.angle);
    });

    await new Promise((r) => setTimeout(r, 200));
    if (this.gameId !== currentTicket) return;

    for (const btn of winningButtons) {
      btn.classList.add("draw-line");
      await new Promise<void>((resolve) => {
        btn.addEventListener("transitionend", () => resolve(), { once: true });
      });
    }
  }

  private getLineConfig(type: WinType) {
    const isCircle = this.cellRadius === "50%";
    const widthMult = isCircle ? 1.17 : 1;
    switch (type) {
      case WinType.Horizontal:
        return { top: "50%", left: "0%", angle: "0deg", width: "100%" };
      case WinType.Vertical:
        return { top: "0%", left: "50%", angle: "90deg", width: "100%" };
      case WinType.DiagonalMain:
        return {
          top: "0%",
          left: "0%",
          angle: "45deg",
          width: `${widthMult * 141}%`,
        };
      case WinType.DiagonalAnti:
        return {
          top: "100%",
          left: "0%",
          angle: "-45deg",
          width: `${widthMult * 141}%`,
        };
      default:
        return { top: "50%", left: "0%", angle: "0deg", width: "100%" };
    }
  }
}
