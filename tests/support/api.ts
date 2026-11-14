import { APIRequestContext, expect, request } from '@playwright/test';

export type Credentials = {
  username: string;
  password: string;
};

const defaultPassword = process.env.WC_TEST_PASSWORD ?? '';

export const credentials = {
  buyer1: {
    username: process.env.WC_BUYER1 ?? 'buyer1',
    password: process.env.WC_BUYER1_PASSWORD ?? defaultPassword,
  },
  buyer2: {
    username: process.env.WC_BUYER2 ?? 'buyer2',
    password: process.env.WC_BUYER2_PASSWORD ?? defaultPassword,
  },
  buyer3: {
    username: process.env.WC_BUYER3 ?? 'buyer3',
    password: process.env.WC_BUYER3_PASSWORD ?? defaultPassword,
  },
  seller1: {
    username: process.env.WC_SELLER1 ?? 'seller1',
    password: process.env.WC_SELLER1_PASSWORD ?? defaultPassword,
  },
  seller2: {
    username: process.env.WC_SELLER2 ?? 'seller2',
    password: process.env.WC_SELLER2_PASSWORD ?? defaultPassword,
  },
  seller3: {
    username: process.env.WC_SELLER3 ?? 'seller3',
    password: process.env.WC_SELLER3_PASSWORD ?? defaultPassword,
  },
  operator: {
    username: process.env.WC_OPERATOR ?? 'operator',
    password: process.env.WC_OPERATOR_PASSWORD ?? defaultPassword,
  },
} satisfies Record<string, Credentials>;

export function appURL(path: string): string {
  const base = (process.env.WC_BASE_URL ?? 'http://localhost:3000/').replace(/\/?$/, '/');
  return new URL(path.replace(/^\//, ''), base).toString();
}

export async function login(
  api: APIRequestContext,
  user: Credentials,
): Promise<{ token: string; body: unknown }> {
  const response = await api.post(appURL('api/login'), { data: user });
  expect(response.status(), `Login failed for ${user.username}`).toBe(200);
  const body: unknown = await response.json();
  const token = findToken(body);
  if (!token) throw new Error('Login response did not include a bearer token');
  return { token, body };
}

export async function authenticatedApi(user: Credentials): Promise<{
  api: APIRequestContext;
  token: string;
  dispose: () => Promise<void>;
}> {
  const api = await request.newContext();
  try {
    const { token } = await login(api, user);
    return { api, token, dispose: () => api.dispose() };
  } catch (error) {
    await api.dispose();
    throw error;
  }
}

export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function findToken(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  for (const key of ['access_token', 'token']) {
    if (typeof record[key] === 'string') return record[key];
  }
  for (const nested of Object.values(record)) {
    const token = findToken(nested);
    if (token) return token;
  }
  return undefined;
}

export function listFrom(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') {
    throw new Error('Expected an array or paginated collection response');
  }
  const record = value as Record<string, unknown>;
  for (const key of ['items', 'results', 'products', 'orders', 'invoices', 'data']) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  throw new Error('Collection response did not contain a recognized array field');
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} to run this test`);
  return value;
}
