# OSINT Console — project rules

Single-page OSINT lookup tool. Start: email lookup. Then phone, domain, username, IP.

## Hard constraints
- 100% free. GitHub Pages static hosting (`https://Fallex1.github.io/osint-tool/`), public repo.
- No API keys in the client. Keyless sources only: Cloudflare DoH (`https://cloudflare-dns.com/dns-query` JSON), Gravatar (`https://gravatar.com/avatar/<sha256>?d=404`), crt.sh, RDAP (`https://rdap.org/domain/...`). Anything needing a key goes behind a Cloudflare Worker proxy later, never in JS.
- Alpine.js (~15 KB, no build step): single `index.html` + `app.js` + `styles.css`. No bundler, no npm deps.
- Must work at 390px and 1440px.

## Design contract
`DESIGN.md` is authoritative — read it before writing CSS. Terminal utilitarian: Fira Sans UI, Fira Code for every identifier/hash/IP/timestamp; bg `#0B0F14`, panel `#111821`, raised `#16202B`, field `#1C2937`, hairline `#1E2A35`, text `#E8EEF6`, muted `#9AABBD`, one accent `#3B82F6`, signal amber `#E8A33D`, good `#3FB950`, bad `#F85149`.
Banned: gradients, centered marketing hero, card-in-card borders, glow shadows, emoji as icons, a second accent hue.

## Reference implementation
FigCraft file `/home/lefi/osint-design/osint-console.figcraft` (frames `01 · Desktop · Investigation`, `02 · Mobile · Investigation`). PNGs: `/home/lefi/osint-design/desktop.png`, `/home/lefi/osint-design/mobile.png`. Match its layout, 8pt spacing grid, and type scale.

## Layout to reproduce
Desktop: topbar 56px (wordmark, nav, source count, avatar) → query block (752px field, quiet Lookup button, type chips) → three columns: rail 208px (saved + source health + quota), findings table 856px (TARGET/TYPE/SOURCES/CONF; scores 92/81/78/64/58/51), feed 296px → statusbar 24px.
Mobile: 52px topbar, query row, chips, findings list, live signals, 64px tab bar; `padding-bottom` for the fixed tab bar.

## Behaviour
- One focal point: the query field. Enter submits; loading state on button; errors inline near field; empty state with example selectors.
- Confidence ramp single hue: ≥75 good, 50–74 amber, <50 muted, with a legend under the table.
- Honour `prefers-reduced-motion`; visible `focus-visible` rings; touch targets ≥44px.

## Checks before saying done
Serve with `python3 -m http.server`, screenshot at 390 and 1440; text contrast ≥4.5:1; no horizontal scroll; each listed source shows real state (ok / partial / no data).
