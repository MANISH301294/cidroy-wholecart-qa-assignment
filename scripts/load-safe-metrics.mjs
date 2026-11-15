import { performance } from 'node:perf_hooks';
import { setTimeout as delay } from 'node:timers/promises';

if (process.env.WC_ENABLE_METRICS_SAMPLE !== '1') {
  throw new Error('Refusing to send a metrics sample. Set WC_ENABLE_METRICS_SAMPLE=1 after reviewing the impact.');
}

const baseURL = (process.env.WC_BASE_URL ?? 'http://13.200.185.1/c/manish-dba39f/').replace(/\/?$/, '/');
const sampleCount = Number(process.env.WC_METRICS_SAMPLE_COUNT ?? 135);
const intervalMs = 20;
if (!Number.isInteger(sampleCount) || sampleCount < 1) {
  throw new Error('WC_METRICS_SAMPLE_COUNT must be a positive integer.');
}

const metricsURL = new URL('api/metrics', baseURL);
const readMetrics = async () => {
  const response = await fetch(metricsURL);
  if (!response.ok) throw new Error(`/api/metrics returned HTTP ${response.status}`);
  return response.json();
};

const metricsBefore = await readMetrics();
const starts = [];
const latenciesMs = [];
const statuses = [];
const requests = [];
let nextStartAt = performance.now();
for (let i = 0; i < sampleCount; i += 1) {
  while (nextStartAt > performance.now()) {
    await delay(nextStartAt - performance.now());
  }
  const started = performance.now();
  starts.push(started);
  requests.push((async () => {
    const response = await fetch(metricsURL);
    statuses.push(response.status);
    await response.arrayBuffer();
    latenciesMs.push(performance.now() - started);
  })());
  nextStartAt = started + intervalMs;
}
await Promise.all(requests);
const metricsAfter = await readMetrics();

let peakStartsPerRollingSecond = 0;
for (let i = 0, j = 0; i < starts.length; i += 1) {
  while (starts[i] - starts[j] >= 1000) j += 1;
  peakStartsPerRollingSecond = Math.max(peakStartsPerRollingSecond, i - j + 1);
}
const sorted = [...latenciesMs].sort((a, b) => a - b);
const p95Index = Math.ceil(sorted.length * 0.95) - 1;
const result = {
  endpoint: '/api/metrics',
  requestCount: sampleCount,
  pacing: `request starts spaced by at least ${intervalMs} ms`,
  peakClientStartsPerRollingSecond: peakStartsPerRollingSecond,
  statuses: Object.fromEntries([...new Set(statuses)].map((status) => [status, statuses.filter((item) => item === status).length])),
  p95Ms: Math.round(sorted[p95Index] * 10) / 10,
  maxMs: Math.round(sorted.at(-1) * 10) / 10,
  metricsBefore,
  metricsAfter,
};
console.log(JSON.stringify(result, null, 2));
if (peakStartsPerRollingSecond > 50 || statuses.some((status) => status !== 200)) process.exitCode = 1;
