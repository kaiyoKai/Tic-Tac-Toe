# Lobby / Game Interfaces

## LobbySettings
- `maxPlayers`
- `allowedLocalPlayers`
- `maxBots`
- `visibility: public | private | local`
- `autoStart`
- `boardSize`
- `winCon`
- `gravityEnabled`
- `rotationEnabled`
- `moveTimeoutMs`
- `penaltyMode`
- `presetId`

## LobbySnapshot
- `id`, `name`, `hostId`, `createdAt`, `status`
- `members`
- `settings`
- `pendingSettingRequests`

## LobbySettingRequest
- `id`
- `lobbyId`
- `requesterId`
- `requesterName`
- `targetSetting`
- `proposedValue`
- `reason`
- `status`
- `createdAt`

## HostTransferRequest
- `lobbyId`
- `nextHostId`

## Game actions
- `place`: standard move
- `rotate`: board rotation action, followed by gravity if enabled

## Presets
- Built-in presets: Tic-Tac-Toe and Connect Four
- Custom presets are stored locally in the browser
