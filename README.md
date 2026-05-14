# TicTacToe 👣 (weil Toe checkt ihr?)

Ein nicht mehr ganz so simples TicTacToe-Spiel, das mittlerweile mehr Over-Engineering enthält als notwendig. Ursprünglich als kleines JS-Skript gestartet, ist es jetzt ein TypeScript-Projekt mit Architektur-Patterns, weil... warum nicht?

## Features

### 🎮 Gameplay
* **Flexibles Spiel:** Anpassbare Spielfeldgröße (z.B. 3x3 bis 10x10) und Gewinnbedingung (3-in-a-row, 4-in-a-row, etc.).
* **Bot-Gegner:** Es gibt einen Singleplayer-Modus gegen einen Bot mit verschiedenen Schwierigkeitsgraden:
    * *Einfach:* Macht zufällige Züge (dumm wie Brot).
    * *Mittel/Schwer:* Nutzt eine "ShortSighted"-Strategie (sieht Gewinnzüge und blockiert, plant aber nicht weit voraus).
    * *(Geplant):* Ein unbesiegbarer Minimax-Bot (kommt noch, versprochen!).
* **Lokaler Multiplayer:** 2 Spieler können klassisch an einem Gerät spielen (Innovativ xD).

### 🎨 UI & Design
* **Theme-Support:** Komplett dynamisches Farbschema via CSS-Variablen. Wähle zwischen Catppuccin, Dracula, Gruvbox, Nord, Sakura und mehr.
* **Dynamische UI:** Das Board wird basierend auf den Einstellungen per TypeScript generiert.

<details>
<summary><b>🎬 Demos ansehen (Klicken zum Ausklappen)</b></summary>
<br>

**Theme-Vorschau:**
<img src="./screenshotsForReadMe/themesGif.gif" width="100%" alt="Vorschau der verschiedenen Themes" />

<br>

**Flexible Spielfeldgrößen:**
<img src="./screenshotsForReadMe/sizes.gif" width="100%" alt="Vorschau der Spielfeldgrößen" /> 
</details>

### ⛷️ Technik (Das ist mein lieblings Emoji)
* **TypeScript:** Die gesamte Codebase wurde von JavaScript auf TypeScript migriert für mehr stuff mit Typen oder so.
* **Design Patterns:** Der Bot nutzt das Strategy Pattern, um Logik und Schwierigkeitsgrade Clean zu trennen.
* **Architektur:** Aufteilung in Core-Logik, Controller und UI (Basic M-V-C struktur).

## 🧱 Struktur (ab jetzt)
- `src/core` – Spiellogik und Game-Domain.
- `src/shared` – gemeinsame Typen, Contracts, Validierungsregeln.
- `src/client` – App-Start und Client-Orchestrierung.
- `src/server` – Socket.IO Multiplayer-Backend (Lobby-Lifecycle).

## 🌐 Multiplayer Server (Node + Socket.IO MVP)
```bash
npm run server:dev
```

## 📦 Monorepo-Workspaces (Client/Server getrennt)
- `apps/client` (`@tictactoe/client`) für UI/Web-App.
- `apps/server` (`@tictactoe/server`) für Socket.IO-Backend.
- Root-Skripte delegieren automatisch in die passenden Workspaces.
- Häufige Befehle:
  - `npm run dev` → Client lokal starten
  - `npm run server:dev` → Socket.IO-Server starten
  - `npm run test:run` → Vitest-Suite ausführen
  - `npm run build` → Client + Server validieren

Events und Payloads sind zentral in:
- `src/shared/contracts/RealtimeContracts.ts`

## 🚧 Roadmap / In Arbeit
* **Optionale Terminal-UI Version:** Einfach nur, weil Cool.
* **Online Multiplayer:** Node + Socket.IO Lobby-MVP ist vorhanden (Create/List/Join/Leave/Ready/Start), Match-Runtime folgt.
* **Minimax Algorithmus:** Damit der "Schwer"-Modus seinen Namen auch verdient.
* **Refactoring:** UI und Logik noch strikter trennen.
* **Mit Custom Emojis Spielen:** Ihr wolltet sicher schon immer mal "🥸 vs 💣" spielen oder so.
* **Mehr als zwei Spieler Multiplayer:** Imagine ihr spielt ein Tic-Tac-Toe Free for all mit all euren Freunden (oder mit den Bots falls ihr keine habt, I do not judge).
