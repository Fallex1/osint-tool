// OSINT Console — real keyless lookups. No API keys, no proxy.
const DOH = 'https://dns.google/resolve?name=';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IP_RE = /^(\d{1,3}\.){3}\d{1,3}$/;
const DOMAIN_RE = /^(?!-)[a-z0-9-]{1,63}(\.[a-z0-9-]{1,63})+$/i;

if (typeof module !== 'undefined') module.exports = { detectType: (q) => EMAIL_RE.test(q) ? 'email' : IP_RE.test(q) ? 'ip' : /^\+?[\d\s()-]{7,}$/.test(q) ? 'phone' : DOMAIN_RE.test(q) ? 'domain' : /^[a-z0-9_-]{2,30}$/i.test(q) ? 'username' : 'unknown' };

const j = async (url, opt = {}) => {
  const c = new AbortController(), t = setTimeout(() => c.abort(), 9000);
  try {
    const r = await fetch(url, { ...opt, signal: c.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return opt.raw ? r : await r.json();
  } finally { clearTimeout(t); }
};
const sha256 = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))]
  .map(b => b.toString(16).padStart(2, '0')).join('');
const detectType = (q) => EMAIL_RE.test(q) ? 'email' : IP_RE.test(q) ? 'ip' : /^\+?[\d\s()-]{7,}$/.test(q) ? 'phone'
  : DOMAIN_RE.test(q) ? 'domain' : /^[a-z0-9_-]{2,30}$/i.test(q) ? 'username' : 'unknown';

// every probe resolves to {src, state, note, findings[]}
const probe = async (src, fn) => {
  try {
    const r = await fn();
    return { src, state: r && r.findings && r.findings.length ? 'ok' : 'nodata', note: (r && r.note) || '', findings: (r && r.findings) || [] };
  } catch (e) {
    return { src, state: /abort/i.test(e.message) ? 'timeout' : /CORS|Failed to fetch/i.test(e.message) ? 'blocked' : 'error', note: e.message.slice(0, 40), findings: [] };
  }
};

const doh = async (name, type) => {
  const d = await j(`${DOH}${encodeURIComponent(name)}&type=${type}`);
  return (d.Answer || []).map(a => a.data);
};

const P = {
  email: async (email) => {
    const hash = await sha256(email.trim().toLowerCase());
    const dom = email.split('@')[1];
    const out = await Promise.all([
      probe('Gravatar', async () => {
        const r = await fetch(`https://gravatar.com/avatar/${hash}?d=404`);
        return { findings: r.status === 200 ? [{ target: email, type: 'email', chips: ['Gravatar'], conf: 55, note: 'profile exists' }] : [], note: r.status === 404 ? 'no profile' : '' };
      }),
      probe('DNS', async () => {
        const mx = await doh(dom, 'MX');
        return { findings: mx.length ? [{ target: dom, type: 'domain', chips: ['DNS'], conf: 50, note: `${mx.length} MX` }] : [], note: mx.length ? '' : 'no MX' };
      }),
      probe('SPF/DMARC', async () => {
        const txt = (await doh(dom, 'TXT')).join(' ');
        const dmarc = await doh('_dmarc.' + dom, 'TXT').catch(() => []);
        const f = [];
        if (/v=spf1/.test(txt)) f.push({ target: dom, type: 'domain', chips: ['SPF'], conf: 45, note: 'spf present' });
        if (dmarc.length) f.push({ target: dom, type: 'domain', chips: ['DMARC'], conf: 45, note: 'dmarc present' });
        return { findings: f, note: f.length ? '' : 'no spf/dmarc' };
      }),
      probe('Keybase', async () => {
        const d = await j(`https://keybase.io/_/api/1.0/user/lookup.json?email_address=${encodeURIComponent(email)}`);
        const u = d.them && d.them[0];
        return { findings: u ? [{ target: u.basics.username, type: 'username', chips: ['Keybase'], conf: 70, note: 'email→handle' }] : [], note: u ? '' : 'no account' };
      }),
      probe('Disposable', async () => {
        const list = await j('https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf', { raw: true }).then(r => r.text());
        const hit = list.split('\n').includes(dom.toLowerCase());
        return { findings: [], note: hit ? 'disposable domain' : 'not disposable', state: hit ? 'ok' : 'nodata' };
      }),
    ]);
    return out;
  },

  domain: async (dom) => {
    const out = await Promise.all([
      probe('DNS', async () => {
        const [a, ns, mx] = await Promise.all([doh(dom, 'A'), doh(dom, 'NS'), doh(dom, 'MX')]);
        const f = a.map(ip => ({ target: ip, type: 'ip', chips: ['DNS'], conf: 60, note: dom }));
        if (ns.length) f.push({ target: dom, type: 'domain', chips: ['NS'], conf: 50, note: ns.slice(0, 2).join(', ') });
        if (mx.length) f.push({ target: dom, type: 'domain', chips: ['MX'], conf: 50, note: `${mx.length} records` });
        return { findings: f, note: a.length ? '' : 'no A record' };
      }),
      probe('RDAP', async () => {
        const d = await j(`https://rdap.org/domain/${dom}`);
        const ev = (d.events || []).find(e => /registration/.test(e.eventAction));
        return { findings: [{ target: dom, type: 'domain', chips: ['RDAP'], conf: 75, note: (d.entities && d.entities[0] && d.entities[0].handle) || 'registered' }], note: ev ? 'since ' + ev.eventDate.slice(0, 10) : '' };
      }),
      probe('crt.sh', async () => { await j(`https://crt.sh/?q=${encodeURIComponent('%25.' + dom)}&output=json`); return { findings: [] }; }),
      probe('InternetDB', async () => {
        const ips = await doh(dom, 'A'); if (!ips.length) throw new Error('no A record');
        const d = await j('https://internetdb.shodan.io/' + ips[0]);
        const ports = d.ports || [];
        return { findings: ports.length ? [{ target: ips[0], type: 'ip', chips: ['Shodan'], conf: 65 + Math.min(ports.length, 10), note: `${ports.length} ports on ${dom}` }] : [], note: ports.length ? '' : 'no ports' };
      }),
    ]);
    return out;
  },

  ip: async (ip) => {
    return await Promise.all([
      probe('InternetDB', async () => {
        const d = await j('https://internetdb.shodan.io/' + ip);
        const ports = d.ports || [];
        return { findings: ports.length ? [{ target: ip, type: 'ip', chips: ['Shodan'], conf: 70 + Math.min(ports.length, 10), note: `${ports.length} ports · ${ports.slice(0, 6).join(' ')}${ports.length > 6 ? ' …' : ''}` }] : [], note: ports.length ? '' : 'no open ports' };
      }),
      probe('RDAP', async () => {
        const d = await j('https://rdap.org/ip/' + ip);
        const name = (d.name || '') + (d.handle ? ' · ' + d.handle : '');
        return { findings: [{ target: ip, type: 'ip', chips: ['RDAP'], conf: 60, note: name.trim() || 'allocated' }] };
      }),
      probe('ipwho.is', async () => {
        const d = await j(`https://ipwho.is/${ip}`);
        if (!d.success) throw new Error(d.message || 'lookup failed');
        return { findings: [{ target: ip, type: 'ip', chips: ['geo'], conf: 50, note: [d.city, d.country, d.connection?.isp].filter(Boolean).join(' · ') }] };
      }),
    ]);
  },

  username: async (u) => {
    const out = await Promise.all([
      probe('GitHub', async () => {
        const d = await j('https://api.github.com/users/' + u);
        return { findings: [{ target: u, type: 'username', chips: ['GitHub'], conf: 80, note: `${d.public_repos} repos · since ${d.created_at.slice(0, 4)}` }] };
      }),
      probe('GitLab', async () => {
        const d = await j('https://gitlab.com/api/v4/users?username=' + encodeURIComponent(u));
        const hit = d.find(x => x.username.toLowerCase() === u.toLowerCase()) || null;
        return { findings: hit ? [{ target: u, type: 'username', chips: ['GitLab'], conf: 60, note: hit.name || 'account' }] : [], note: hit ? '' : 'no account' };
      }),
      probe('Keybase', async () => {
        const d = await j(`https://keybase.io/_/api/1.0/user/lookup.json?username=${encodeURIComponent(u)}`);
        const them = d.them && d.them[0];
        return { findings: them ? [{ target: u, type: 'username', chips: ['Keybase'], conf: 70, note: `${Object.keys(them.proofs_summary?.all || {}).length} proofs` }] : [], note: them ? '' : 'no account' };
      }),
      probe('HackerNews', async () => {
        const d = await j(`https://hn.algolia.com/api/v1/search?query=&tags=author_${encodeURIComponent(u)}`);
        return { findings: d.nbHits ? [{ target: u, type: 'username', chips: ['HN'], conf: 55, note: `${d.nbHits} posts` }] : [], note: d.nbHits ? '' : 'no posts' };
      }),
      probe('npm', async () => {
        const d = await j(`https://registry.npmjs.org/-/v1/search?text=maintainer:${encodeURIComponent(u)}&size=3`);
        const own = (d.objects || []).filter(o => (o.package.maintainers || []).some(m => m.username === u));
        return { findings: own.length ? [{ target: u, type: 'username', chips: ['npm'], conf: 55, note: `${d.total} packages` }] : [], note: own.length ? '' : 'none' };
      }),
      probe('Bluesky', async () => {
        const d = await j(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(u)}.bsky.social`);
        return { findings: [{ target: d.handle, type: 'username', chips: ['Bluesky'], conf: 55, note: `${d.followersCount ?? 0} followers` }] };
      }),
    ]);
    return out;
  },

  phone: async (raw) => {
    const digits = raw.replace(/[^\d+]/g, '');
    const e164 = digits.startsWith('+') ? digits : digits.startsWith('0') ? '+62' + digits.slice(1) : '+' + digits;
    const cc = e164.slice(1, 3);
    return [{
      src: 'libphonenumber', state: 'partial',
      note: 'offline format only — carrier needs keyed API',
      findings: [{ target: e164, type: 'phone', chips: ['E.164'], conf: 40, note: `${e164.length - 3} digits · cc +${cc}` }],
    }];
  },
};

if (typeof document !== 'undefined') document.addEventListener('alpine:init', () => {
  Alpine.data('appState', () => ({
    query: 'ghostbyte77@gmail.com',
    type: 'email',
    loading: false,
    error: '',
    results: [],
    log: [],
    sources: [],
    okCount: 0,

    init() { this.lookup(); },

    confClass(c) { return c >= 75 ? 'good' : c >= 50 ? 'warning' : 'muted'; },

    async lookup() {
      const q = this.query.trim();
      if (!q || this.loading) return;
      this.type = detectType(q);
      if (this.type === 'unknown') { this.error = 'Not an email, domain, IP, phone or username'; this.results = []; return; }
      this.error = ''; this.loading = true; this.results = []; this.log = []; this.sources = [];
      const started = Date.now();
      try {
        const res = await P[this.type](q);
        this.sources = res.map(r => ({ name: r.src, state: r.state, note: r.note }));
        this.okCount = res.filter(r => r.state === 'ok').length;
        const flat = res.flatMap(r => r.findings);
        const byTarget = new Map();
        for (const f of flat) {
          const cur = byTarget.get(f.target);
          if (cur) {
            cur.chips = [...new Set([...cur.chips, ...f.chips])];
            cur.conf = Math.max(cur.conf, f.conf);
            cur.note = cur.note || f.note;
          } else byTarget.set(f.target, { ...f, chips: [...f.chips] });
        }
        this.results = [...byTarget.values()].sort((a, b) => b.conf - a.conf);
        const human = (r) => r.state === 'blocked' ? 'blocked by CORS — needs proxy' : r.state === 'timeout' ? 'timed out (9s)'
          : r.state === 'error' ? 'error: ' + r.note : (r.note || 'ok');
        res.forEach(r => this.log.push({ t: new Date().toLocaleTimeString('en-GB', { hour12: false }), src: r.src, msg: human(r).slice(0, 46) }));
        if (!this.results.length) this.error = 'No data returned. ' + (res.find(r => r.state === 'blocked') ? 'A source was CORS-blocked.' : '');
        this.logMs = Date.now() - started;
      } catch (e) { this.error = e.message; }
      finally { this.loading = false; }
    },
  }));
});