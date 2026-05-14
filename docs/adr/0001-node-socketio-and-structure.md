# ADR 0001: Multiplayer Runtime und Projektstruktur

## Status
Accepted

## Kontext
Das Projekt braucht eine belastbare Grundlage für Multiplayer mit Lobby-System, ohne große Rewrites im ersten Schritt.

## Entscheidung
1. Für den ersten Multiplayer-Release wird **Node + Socket.IO** genutzt.
2. Die Struktur wird in `core`, `shared`, `client`, `server` gegliedert.
3. Multiplayer-Kommunikation nutzt zentral definierte Shared-Contracts.
4. **Bun** bleibt eine spätere Evaluierungsoption nach stabilen Contracts und Lastprofilen.

## Konsequenzen
- Schnellere MVP-Lieferung durch Socket.IO Features (Rooms, Reconnect, Event-Flow).
- Klarere Ownership-Grenzen zwischen Spiellogik, UI und Server-Lifecycle.
- Einfachere Weiterentwicklung durch Contract-First Ansatz.
