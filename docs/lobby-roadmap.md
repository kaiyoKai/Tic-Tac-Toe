# Lobby Roadmap

## Already in place
- Socket.IO lobby lifecycle: create, list, join, leave, ready, update.
- Shared contracts for lobby, chat, profile, and game move payloads.
- Server-side lobby state with snapshots and game start.
- Client-side lobby browser and lobby creation dialogs.

## Implemented in this step
- Public/private/local visibility model.
- Host transfer payloads and notifications.
- Pending lobby setting requests with accept/reject flow.
- Game settings now include gravity, rotation, board size, win condition, timeout, and penalty mode.
- Board rotation and gravity support in the engine.
- Preset storage on the client for built-in and custom lobby presets.

## Next steps
1. Add a dedicated host toolbar for transfer and request decisions.
2. Show pending setting requests in a queue inside the lobby dialog.
3. Persist active lobby preset selection in the browser state.
4. Add a proper offline/local lobby session layer.
5. Expand bot/client-only lobby membership handling.
