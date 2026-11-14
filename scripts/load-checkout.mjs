import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { setTimeout as delay } from 'node:timers/promises';

const enabled = process.env.WC_ENABLE_LOAD_TEST === '1';
if (!enabled) {
  throw new Error('Refusing to send checkout traffic. Set WC_ENABLE_LOAD_TEST=1 after reviewing the impact.');
}

const baseURL = (process.env.WC_BASE_URL ?? 'http://localhost:3000/').replace(/\/?$/, '/');
const fixturePath = process.env.WC_LOAD_FIXTURES;
if (!fixturePath) throw new Error('Set WC_LOAD_FIXTURES to a JSON file with 30 unique buyer checkouts.');

const fixtures = JSON.parse(await readFile(fixturePath, 'utf8'));
if (!Array.isArray(fixtures) || fixtures.length !== 30) {
  throw new Error('The load fixture must contain exactly 30 checkout entries.');
}

const users = new Set(fixtures.map((entry) => entry.username));
if (users.size !== 30) throw new Error('Load test requires 30 unique buyer accounts.');

const slotCounts = new Map();
for (const fixture of fixtures) {
  if (!fixture.username || !fixture.password || !fixture.slot_date || !fixture.slot_start) {
    throw new Error('Each fixture needs username, password, slot_date, and slot_start.');
  }
  if (!Array.isArray(fixture.items) || fixture.items.length === 0) {
    throw new Error(`${fixture.username} needs at least one pre-seeded cart line.`);
  }
  const slot = `${fixture.slot_date}/${fixture.slot_start}`;
  slotCounts.set(slot, (slotCounts.get(slot) ?? 0) + 1);
}
for (const [slot, count] of slotCounts) {
  if (count > 5) throw new Error(`${slot} has ${count} orders; slot capacity is 5.`);
}

const url = (path) => new URL(path.replace(/^\//, ''), baseURL).toString();
const metricsResponse = await fetch(url('api/metrics'));
if (!metricsResponse.ok) throw new Error(`Metrics endpoint failed: HTTP ${metricsResponse.status}`);
const metricsBefore = await metricsResponse.json();

// Keep setup traffic separate from the measured burst.
const setupRequest = async (path, options) => {
  await delay(50);
  return fetch(url(path), options);
};

const tokens = new Map();
for (const fixture of fixtures) {
  const response = await setupRequest('api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: fixture.username, password: fixture.password }),
  });
  if (!response.ok) throw new Error(`Login failed for ${fixture.username}: HTTP ${response.status}`);
  const body = await response.json();
  const token = body.access_token ?? body.token;
  if (typeof token !== 'string') throw new Error(`No bearer token returned for ${fixture.username}`);
  tokens.set(fixture.username, token);
}

for (const fixture of fixtures) {
  const response = await setupRequest('api/cart', {
    headers: { Authorization: `Bearer ${tokens.get(fixture.username)}` },
  });
  if (!response.ok) throw new Error(`Cart read failed for ${fixture.username}: HTTP ${response.status}`);
  const cart = await response.json();
  const productIds = new Set();
  const collectProductIds = (value) => {
    if (Array.isArray(value)) {
      value.forEach(collectProductIds);
    } else if (value && typeof value === 'object') {
      for (const [key, nested] of Object.entries(value)) {
        if (key === 'product_id' && (typeof nested === 'number' || typeof nested === 'string')) {
          productIds.add(String(nested));
        } else {
          collectProductIds(nested);
        }
      }
    }
  };
  collectProductIds(cart);
  for (const item of fixture.items) {
    if (!productIds.has(String(item.product_id))) {
      throw new Error(`Expected product ${item.product_id} is not present in ${fixture.username}'s cart.`);
    }
  }
}

await delay(1000);

const checkouts = await Promise.all(fixtures.map(async (fixture) => {
  const started = performance.now();
  const response = await fetch(url('api/orders'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.get(fixture.username)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      slot_date: fixture.slot_date,
      slot_start: fixture.slot_start,
    }),
  });
  return {
    username: fixture.username,
    status: response.status,
    durationMs: performance.now() - started,
    body: await response.text(),
  };
}));

const metricsAfterResponse = await fetch(url('api/metrics'));
if (!metricsAfterResponse.ok) throw new Error(`Final metrics failed: HTTP ${metricsAfterResponse.status}`);
const metricsAfter = await metricsAfterResponse.json();
const sorted = checkouts.map((item) => item.durationMs).sort((a, b) => a - b);
const p95 = sorted[Math.ceil(sorted.length * 0.95) - 1];
const failures = checkouts.filter((item) => item.status < 200 || item.status >= 300);
const result = {
  count: checkouts.length,
  p95Ms: Math.round(p95),
  maxMs: Math.round(sorted.at(-1)),
  httpFailures: failures.length,
  metricsBefore,
  metricsAfter,
  checkouts: checkouts.map(({ username, status, durationMs }) => ({
    username,
    status,
    durationMs: Math.round(durationMs),
  })),
};
console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
if (p95 > 3000) process.exitCode = 1;
