# Design: Terminal Utilitarian (OSINT Console)

OSINT work is reading raw evidence under time pressure — the interface should feel like an instrument, not a brochure: mono data, dense rows, one accent that means "signal".

## Palette (max 3 hues)
- Dominant: `#0B0F14` ground, `#111821` panel, `#16202B` raised (≈75% of surface)
- Neutral ramp: `#1E2A35` hairline, `#93A4B7` muted text, `#E8EEF6` primary text
- Accent: `#3B82F6` action (≈10%) — ONE accent per view
- Signal: `#E8A33D` text / `#D97706` fill for warnings and live ticks
- Semantic: success `#3FB950`, error `#F85149` (kept out of brand hues)
- Source: hand-derived dark variant of the "Analytics Dashboard" palette in `ui-ux-pro-max/colors.csv` (no dark analytics row exists in that DB — this is a documented fallback)

## Type
- Display/UI: **Fira Sans** 400/500/600 — labels ≥12px
- Data: **Fira Code** 400/500 — every identifier, hash, IP, phone, timestamp (tabular)
- Sizes: 11 / 12 / 13 / 15 / 20 (dense 1.2× ratio, dashboard scale)
- Body ≥15px on mobile, line-height 1.45

## Form
- Radius: 8 (inputs, panels), 4 (chips), 0 (table rows, bars)
- Spacing: 8pt grid, half-step 4
- Elevation: none — separation by background shift (`#0B0F14` → `#111821` → `#16202B`)
- Borders: hairline `#1E2A35` only as row dividers; never a box around every container

## Motion
- Personality: brisk, mechanical
- 120–180ms UI, ease-out; bars animate width only; reduced-motion honored

## This design will NOT use
- Gradient hero, centered marketing headline, three-card feature row
- Card-in-card borders, glow shadows, emoji as icons
- More than one accent hue per view
