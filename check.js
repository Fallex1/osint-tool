// runnable self-check: node check.js
const assert = require('node:assert');
const { detectType } = require('./app.js');
const cases = {
  'ghostbyte77@gmail.com': 'email', 'api.novacraft.dev': 'domain', 'example.com': 'domain',
  '1.1.1.1': 'ip', '+62 812 3456 7890': 'phone', '+628123456789': 'phone',
  'ghostbyte_77': 'username', 'torvalds': 'username', 'not a query': 'unknown', '': 'unknown',
};
for (const [q, want] of Object.entries(cases)) assert.equal(detectType(q), want, `${q} → ${detectType(q)}, want ${want}`);
console.log('detectType ok:', Object.keys(cases).length, 'cases');
