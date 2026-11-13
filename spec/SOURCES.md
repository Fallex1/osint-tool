# Source catalog — verified 2026-11-13

Test: `curl -H "Origin: https://fallex1.github.io"` → HTTP status + `access-control-allow-origin`.
"Direct" = browser can call it from GitHub Pages. "Proxy" = needs a Cloudflare Worker (CORS blocked) or a key.

## Direct (no key, CORS ok)

| Source | Endpoint | Gives | Used for |
|---|---|---|---|
| Google DoH | `https://dns.google/resolve?name=<d>&type=MX` | A/AAAA/MX/TXT/NS/SOA/CNAME, 200 + JSON | domain |
| Cloudflare DoH | `https://cloudflare-dns.com/dns-query?name=<d>&type=MX` + `accept: application/dns-json` | same, different resolver | domain |
| RDAP | `https://rdap.org/domain/<d>` (302 → registry), `https://rdap.org/ip/<ip>` | registrar, created/updated/expiry, nameservers, status, ASN | domain, ip |
| Gravatar | `https://gravatar.com/avatar/<sha256(email)>?d=404` | 200 = profile exists, 404 = none | email |
| GitHub | `https://api.github.com/users/<u>`, `/users/<u>/repos` | account age, name, company, repos, followers | username, email hint |
| GitLab | `https://gitlab.com/api/v4/users?username=<u>` | account, bio, website | username |
| Keybase | `https://keybase.io/_/api/1.0/user/lookup.json?username=<u>` | **proofs**: linked GitHub/Reddit/HN/Twitter/domains + PGP keys | username, email→handle pivot |
| HN Algolia | `https://hn.algolia.com/api/v1/search?query=<q>&tags=author_<u>` | comments/submissions, timestamps | username |
| Bluesky | `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=<handle>` | profile, DID, followers | username |
| npm | `https://registry.npmjs.org/-/v1/search?text=<q>&size=5` | packages, maintainer emails | username, email |
| Shodan InternetDB | `https://internetdb.shodan.io/<ip>` | open ports, hostnames, CPEs, CVEs — keyless | ip |
| ipwho.is | `https://ipwho.is/<ip>` | geo, connection ASN/ISP | ip |
| ipapi.co | `https://ipapi.co/<ip>/json/` | geo, org, timezone | ip |
| Wayback | `http://archive.org/wayback/available?url=<d>` | first/last snapshot | domain |
| Pwned Passwords | `https://api.pwnedpasswords.com/range/<5-hex>` | breach count by k-anonymity, no key | password hygiene (not email) |
| Disposable domains | `https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf` | ~8k domains, cache locally 30d | email |
| AlienVault OTX | `https://otx.alienvault.com/api/v1/indicators/domain/<d>/passive_dns` | passive DNS history, 429-prone | domain |
| HackerTarget | `https://api.hackertarget.com/hostsearch/?q=<d>` | subdomains, 50/day unauth | domain |

## Proxy needed (Worker) — no CORS header or key required

| Source | Endpoint | Gives | Why |
|---|---|---|---|
| crt.sh | `https://crt.sh/?q=%25.<d>&output=json` | **certificate transparency → subdomains** | no ACAO header |
| urlscan.io | `https://urlscan.io/api/v1/search/?q=domain:<d>` | scan history, page URLs, IPs | no ACAO header |
| Reddit | `https://www.reddit.com/user/<u>/about.json` | karma, created, verified email flag | 403 on non-browser UA, no ACAO |
| HaveIBeenPwned | `https://haveibeenpwned.com/api/v3/breachedaccount/<e>` | breach list | key required |
| VirusTotal | `https://www.virustotal.com/api/v3/domains/<d>` | reputation, DNS, certs, subdomains | key, free 4/min |
| Shodan full | `https://api.shodan.io/shodan/host/<ip>` | banners, services | key |
| Phone carrier | numverify / abstractapi `phone_validation` | carrier, line type | key |
| BGPView | `https://api.bgpview.io/ip/<ip>` | ASN prefixes, peers | down at test time (HTTP 000) |

## Coverage reality per data type

- **email** — Gravatar (exists), disposable list, DNS MX/SPF/DMARC via DoH, HIBP (proxy). No keyless breach data.
- **domain** — strongest: DoH, RDAP, crt.sh (proxy), OTX, HackerTarget, Wayback, InternetDB on its IP.
- **ip** — strong: InternetDB ports, RDAP ASN, ipwho.is geo.
- **username** — strong: GitHub, GitLab, Keybase (pivots to proofs), HN, Bluesky, npm.
- **phone** — weakest. No keyless carrier/owner API exists. Client-side `libphonenumber-js` (offline, ~145 KB) gives format, E.164, validity, line type, region. Carrier needs keyed API via proxy. Truecaller-style owner data: not available free — do not fake it.

## Rules

- Never claim a hit you did not fetch. `ok` / `partial` / `no data` per source, per query.
- Cache per source in `localStorage` with TTL (DNS 10 min, RDAP 24 h, GitHub 1 h) — GitHub unauth is 60 req/h.
- Confidence = weighted sources that actually returned; a missing source must lower it and say why.