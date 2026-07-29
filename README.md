# Campo El Rosario v9.00 — Record & Review

Campo v9.00 refocuses the application around the two most important jobs in a ranch-management workflow:

1. **Registrar** what happened or what was observed with very low friction.
2. **Revisar** field, herd and inventory performance with one coherent date reference.

The release preserves the existing local-data architecture, offline/PWA behavior, animated map, historical surveys, events, rainfall and separate demonstration workspace.

## Main changes

### Intent-based navigation

Primary destinations are now:

```text
Inicio
Registrar
Revisar
Mapa
Histórico
Más
```

On phones, the persistent navigation is reduced to:

```text
Inicio · Registrar · Revisar · Mapa
```

### Unified Registrar

The Registrar hub provides direct access to:

- Quick review based on projected inventory.
- Full count from zero.
- Sale.
- Purchase.
- Birth.
- Mortality.
- Recategorization.
- Rainfall.

Recent activity and projected stock are visible on the same screen.

### Two survey modes

- **Revisión rápida:** starts from the latest observed survey plus registered events. Users only review exceptions.
- **Conteo completo:** starts from an empty photograph for an independent count.

The survey workflow prioritizes lots with events, high load, missing condition or expected differences, while still allowing every lot to be edited.

### Review hub

One screen provides three coordinated views:

- **Campo:** hectare-weighted condition, load, coverage, condition/load matrix, trend and observation freshness.
- **Rodeo:** stock, composition, birth rate, mortality, commercial net movement and observed reproductive flow.
- **Balance:** expected versus observed inventory, including category-level differences.

### Home focused on attention

The home screen now begins with:

- Quick actions.
- Draft recovery when applicable.
- Stock, load, balance and rainfall KPIs.
- Consolidated exceptions.
- Field and herd performance summaries.
- Animated ranch map.
- Recent activity.

### Local-data confidence

- Existing storage key remains `campo-el-rosario-v2`.
- Demonstration data remains isolated under `campo-el-rosario-demo-v1`.
- Autosave status and app version remain visible.
- Backup timestamp is tracked locally.

## Architecture retained

- `app.js`: workflows, domain calculations and user interface.
- `animal-animation.js`: persistent animated agents and SimFarm movement.
- `animal-sprite-library.js`: current directional sprites and future frame support.
- `data/sample-v8.js`: bundled 16-month demonstration workspace.
- `scripts/`: preflight and smoke validation.

## Local development

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Validation

```bash
node --check app.js
node --check animal-animation.js
node --check animal-sprite-library.js
node scripts/preflight.mjs
node scripts/smoke.mjs
node scripts/animation-smoke.mjs
```
