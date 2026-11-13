# SENTINEL //osint

Keyless OSINT lookup console. Static site — Alpine.js + vanilla JS, no build step, no API keys, no tracking.

Live: https://fallex1.github.io/osint-tool/

## What it does

Type an email, domain, IP, phone or username. Every source is queried directly from the browser:

| Type | Sources |
|---|---|
| email | Gravatar (SHA-256), disposable-domain list |
| domain | Google DoH (MX/TXT/NS/A), RDAP, InternetDB, crt.sh, HackerTarget |
| ip | InternetDB (ports/CVEs), ipwho.is, ipapi.co, RDAP |
| username | GitHub, GitLab, Keybase, HN Algolia, npm, Bluesky |
| phone | E.164 format, validity, line type, region — offline only |

Confidence = how many independent sources agreed. A failed source lowers it and is marked degraded in the live-signal feed — never silently faked.

`spec/SOURCES.md` records which endpoints were tested for CORS from a GitHub Pages origin. Blocked ones (crt.sh, urlscan.io, Reddit, HIBP, VirusTotal) need a proxy; they show as `blocked` rather than pretending to work.

## Run




No install, no dependencies.

## Layout

- `index.html` — Alpine template
- `app.js` — detection, probes, confidence merge
- `styles.css` — tokens from `DESIGN.md`
- `spec/` — design spec, node tree, crops, source catalog

Design source: FigCraft, `DESIGN.md` in the [design repo](https://github.com/Fallex1/osint-tool/blob/main/DESIGN.md).
