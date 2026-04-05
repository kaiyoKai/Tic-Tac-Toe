import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { WinType, type IGameResult } from "../types/Common.js";
import "./GameLogo.js";

@customElement("game-board")
export class GameBoard extends LitElement {
  static busEvents = {
    "cell-clicked": "ui:cell-clicked",
    "reset-requested": "ui:reset-requested",
  };

  static busSubscriptions = {
    "game:board-state": "onBoardState",
    "game:move-made": "onMoveMade",
    "game:finished": "onGameFinished",
    "game:reset": "resetBoard",
    "game:settings-changed": "onSettingsChanged",
  };

  @property({ type: Number }) boardSize = 3;
  @property({ type: String }) cellRadius = "5%";
  @property({ type: Number }) turnNumber = 1;
  @property({ type: String }) currentPlayer = "";
  @property({ type: String }) winnerMessage = "";

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

  public onBoardState(data: any) {
    this.cells = data.grid.map((row: any[]) => row.map((cell) => cell || ""));
  }

  public onMoveMade(data: any) {
    this.turnNumber = data.turn;
    this.currentPlayer = data.nextPlayerSymbol;
    this.updateCell(data.row, data.col, data.symbol);
  }

  public async onGameFinished(result: IGameResult) {
    this.winnerMessage = result.winner
      ? `${result.winner} Won!`
      : "It's a draw!";
    await this.showWinAnimation(result);
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .game-header {
      text-align: center;
      margin-bottom: 1.25rem;
    }

    .status-container {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      font-size: 1.2rem;
      margin: 0.625rem 0;
    }

    .victory-message {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--color-win);
      min-height: 2rem;
    }

    .grid {
      display: grid;
      width: min(80vmin, 37.5rem);
      aspect-ratio: 1/1;
      perspective: 1000px;
      container-type: inline-size;
      grid-auto-rows: 1fr;
    }

    button.cell-btn {
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;

      background-color: var(--cell-bg);
      border: 0.3125rem solid var(--border-color);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: visible !important;
      transition:
        background-color 0.2s,
        border-color 0.2s,
        transform 0.2s,
        border-radius 0.3s ease;
      cursor: pointer;
      margin: 0;
      padding: 0;
      line-height: 1;
    }

    button.cell-btn:hover {
      background-color: var(--cell-hover);
      border-color: var(--primary-accent);
      z-index: 10;
      box-shadow:
        0 0 1.25rem var(--glow-core),
        0 0 1.25rem var(--glow-aura);
    }

    button.cell-btn:active {
      transform: translateY(0.3125rem);
    }

    /* Animationen für den Win */
    button.cell-btn::after {
      content: "";
      position: absolute;
      top: var(--line-top, 50%);
      left: var(--line-left, 0%);
      width: var(--after-width, 100%);
      height: 0.375rem;
      background-color: var(--text-main);
      transform-origin: left center;
      transform: translate(0, -50%) rotate(var(--angle, 0deg)) scaleX(0);
      transition: transform 0.4s ease-out;
      pointer-events: none;
      z-index: 110;
      border-radius: 0.1875rem;
    }

    button.draw-line::after {
      transform: translate(0, -50%) rotate(var(--angle, 0deg)) scaleX(1);
    }

    button.win {
      background-color: var(--color-win) !important;
      border-color: var(--text-main);
      box-shadow: 0 0 3.125rem var(--glow-core);
    }

    @keyframes winRotate {
      from {
        transform: perspective(1000px) rotateY(0deg);
      }
      to {
        transform: perspective(1000px) rotateY(360deg);
      }
    }

    button.spin {
      animation: winRotate 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
      z-index: 100;
    }

    .reset-btn {
      display: block;
      font-size: 1.5rem;
      padding: 0.625rem 2.5rem;
      background-color: var(--cell-bg);
      color: var(--text-main);
      border: 0.125rem solid var(--border-color);
      border-radius: 0.625rem;
      cursor: pointer;
      transition: 0.2s;
      margin-top: 1.5rem;
    }

    .reset-btn:hover {
      border-color: var(--primary-accent);
      background-color: var(--cell-hover);
    }
    logo-icon {
    }
  `;

  render() {
    return html`
      <header class="game-header">
        <game-logo
          class="logo-icon header-logo"
          aria-label="XOXO & CO"
        ></game-logo>
        <div class="status-container">
          <p>Current Turn: ${this.currentPlayer}</p>
          <p>Turn Number: ${this.turnNumber}</p>
        </div>
        <p class="victory-message">${this.winnerMessage}</p>
      </header>

      <style>
        .grid {
          grid-template-columns: repeat(${this.boardSize}, minmax(0, 1fr));
        }
        button.cell-btn {
          border-radius: ${this.cellRadius};
          font-size: calc(65cqw / ${this.boardSize});
        }
      </style>

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

      <button class="reset-btn" @click="${this._handleResetClick}">
        Zurücksetzen
      </button>
    `;
  }

  private _handleCellClick(e: Event) {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "button.cell-btn",
    );
    if (!btn) return;

    this.dispatchEvent(
      new CustomEvent("cell-clicked", {
        detail: {
          row: parseInt(btn.dataset.row!),
          col: parseInt(btn.dataset.col!),
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleResetClick() {
    this.dispatchEvent(
      new CustomEvent("reset-requested", {
        bubbles: true,
        composed: true,
      }),
    );
  }
  public onSettingsChanged(settings: any) {
    this.boardSize = settings.boardSize;
    this.initBoard();
  }
  public updateCell(row: number, col: number, symbol: string) {
    const newCells = [...this.cells];
    newCells[row][col] = symbol;
    this.cells = newCells;
  }

  public resetBoard() {
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

    winningButtons.forEach((btn) => {
      btn.style.setProperty("--after-width", config.width);
      btn.style.setProperty("--line-top", config.top);
      btn.style.setProperty("--line-left", config.left);
      btn.style.setProperty("--angle", config.angle);
    });

    await new Promise((r) => setTimeout(r, 200));

    for (const btn of winningButtons) {
      btn.classList.add("draw-line");
      await new Promise<void>((resolve) => {
        btn.addEventListener("transitionend", () => resolve(), { once: true });
      });
    }
  }

  private getLineConfig(type: WinType) {
    const widthMult = this.cellRadius === "100%" ? 1.09 : 1;
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
