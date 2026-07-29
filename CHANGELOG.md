# Changelog

## Campo v9.00 — Record & Review

### Navigation and home

- Reorganized navigation around user intentions: Inicio, Registrar, Revisar, Mapa, Histórico and Más.
- Reduced phone navigation to four persistent destinations.
- Redesigned the home screen around quick actions, drafts, exceptions and operational performance.
- Preserved the animated map as the main visual overview without making it the first required action.

### Faster recording

- Added a unified Registrar hub for surveys, events and rainfall.
- Added Quick Review and Full Count survey modes.
- Quick Review preloads projected inventory from the latest survey plus events.
- Added exception-first lot ordering.
- Added lot review states: pending, confirmed and modified.
- Added quick confirmation for unchanged lots.
- Added persistent progress and draft recovery.
- Added event confirmation with projected-stock feedback.
- Added local memory for recently used lot and category.

### Field review

- Added hectare-weighted pasture-condition metrics.
- Added observed-coverage and trend indicators.
- Added a condition × load decision matrix.
- Added observation-freshness review.
- Added recent field trend visualization.

### Herd review

- Added stock and change versus prior survey.
- Added birth-rate and annualized-mortality metrics.
- Added commercial net movement.
- Added relative composition bars with quantities and percentages.
- Added an observed reproductive flow using available records only.
- Added mortality breakdown by category.

### Herd balance

- Added an authoritative balance screen.
- Shows previous observed stock, births, purchases, sales, mortality, expected stock and current observed stock.
- Added category-level expected-versus-observed differences.
- Added direct actions to review events or observed stock.

### Data confidence and compatibility

- Preserved real data under `campo-el-rosario-v2`.
- Preserved demonstration data under `campo-el-rosario-demo-v1`.
- Preserved active workspace preference and SimFarm animation.
- Added local backup timestamp.
- Updated PWA cache to `campo-v900-assets-1`.
- Updated workflow and validation scripts for v9.00.
