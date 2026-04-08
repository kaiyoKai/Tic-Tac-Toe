import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { WinType, type IGameResult } from "@shared/Common.js";
import "./GameLogo.js";
import { keyed } from "lit/directives/keyed.js";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import { Subscribe } from "@events/Decorators.ts";
import { globalEventBus } from "@events/EventBus.ts";
@customElement("game-board")
export class GameBoard extends LitElement {
  @property({ type: Number }) boardSize = 3;
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
    if (changedProperties.has("boardSize")) {
      this.initBoard();
    }
  }

  private initBoard() {
    this.cells = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(""),
    );
  }

  @Subscribe(AppEvent.Game.BoardState, EventActor.WebUI)
  public onBoardState(data: any) {
    this.cells = data.grid.map((row: any[]) => row.map((cell) => cell || ""));
  }

  @Subscribe(AppEvent.Game.MoveMade, EventActor.WebUI)
  public onMoveMade(data: any) {
    this.turnNumber = data.turn;
    this.currentPlayer = data.nextPlayerSymbol;
    this.updateCell(data.row, data.col, data.symbol);
  }

  @Subscribe(AppEvent.Game.Finished, EventActor.WebUI)
  public async onGameFinished(result: IGameResult) {
    this.winnerMessage = result.winner
      ? `${result.winner} hat gewonnen!`
      : "Unentschieden!";
    await this.showWinAnimation(result);
  }

  @Subscribe(AppEvent.Game.SettingsChanged, EventActor.WebUI)
  public onSettingsChanged(settings: any) {
    this.boardSize = settings.boardSize;
    this.initBoard();
  }

  @Subscribe(AppEvent.Game.Reset, EventActor.WebUI)
  public onReset() {
    this.resetBoard();
  }
  @Subscribe(AppEvent.UI.ButtonShapeChanged, EventActor.WebUI)
  public onShapeChanged(radius: string) {
    this.cellRadius = radius;
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }

    .game-header {
      text-align: center;
      padding: 1rem 0 0 0;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    game-logo {
      display: block;
      height: clamp(8rem, 20vh, 15rem);
      width: auto;
      margin: 0 auto;
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }

    .status-container {
      display: flex;
      gap: 2rem;
      justify-content: center;
      font-size: 1.1rem;
      margin: 0.5rem 0;
      font-weight: 600;
    }

    .victory-message {
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--color-win);
      min-height: 2.2rem;
      text-transform: uppercase;
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }

    .board-wrapper {
      width: 100%;
      height: 100%;
      overflow: auto; /* Erlaubt das Scrollen, falls Logo + Board zu hoch sind,work in progress*/
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      box-sizing: border-box;
    }
    .grid {
      display: grid;
      gap: 0.5rem;
      container-type: inline-size;
      perspective: 1000px;
      margin: auto;
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
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    button.cell-btn:hover {
      background-color: var(--cell-hover);
      border-color: var(--primary-accent);
      z-index: 10;
      transform: scale(1.03);
    }

    /* Win Animation */
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
    button.win:active {
      animation: winRotateClick 0.8s ease;
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
      padding: 1rem 0 2rem 0;
      display: flex;
      justify-content: center;
      flex-shrink: 0;
    }

    .reset-btn {
      padding: 1rem 3rem;
      font-size: 1.2rem;
      font-weight: 700;
      background: var(--cell-bg);
      color: var(--text-main);
      border: 0.2rem solid var(--border-color);
      border-radius: 1rem;
      cursor: pointer;
      transition: 0.3s;
    }

    .reset-btn:hover {
      border-color: var(--primary-accent);
      background: var(--cell-hover);
      box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.2);
    }
  `;

  render() {
    //Keine scrollbar bei klenen Boards (hoffentlich)
    const isSmallBoard = this.boardSize <= 5;
    return html`
      <style>
        :host {
          height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }

        .board-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 0;
          flex: 1;
          padding: 1rem;
          overflow: ${isSmallBoard ? "hidden" : "auto"};
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(${this.boardSize}, 1fr);
          grid-template-rows: repeat(${this.boardSize}, 1fr);
          aspect-ratio: 1 / 1;

          ${isSmallBoard
          ? `
            height: 100%;
            width: auto;
            max-width: 100%;
            max-height: 100%;
            `
          : `
            width: calc(${this.boardSize} * 4.5rem);
            height: calc(${this.boardSize} * 4.5rem);
            `}
        }

        button.cell-btn {
          border-radius: ${this.cellRadius};
          font-size: calc(60cqw / ${this.boardSize});
        }
      </style>

      <header class="game-header">
        <game-logo></game-logo>
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
      </div>
    `;
  }
  private _handleCellClick(e: Event) {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "button.cell-btn",
    );
    if (!btn || btn.innerText !== "" || this.winnerMessage !== "") return;

    globalEventBus.emit(AppEvent.UI.CellClicked, EventActor.WebUI, {
      row: parseInt(btn.dataset.row!),
      col: parseInt(btn.dataset.col!),
    });
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
    this.shadowRoot
      ?.querySelectorAll<HTMLButtonElement>("button.cell-btn")
      .forEach((btn) => {
        btn.className = "cell-btn";
        btn.style.cssText = "";
      });
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
