/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for single-instance deployments. For multi-instance,
 * swap with a Redis-backed solution (e.g. @upstash/ratelimit).
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

const store = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60; // per window per IP

export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  let timestamps = store.get(ip) ?? [];
  timestamps = timestamps.filter((t) => t > windowStart);
  timestamps.push(now);

  if (timestamps.length === 1 && store.has(ip)) {
    // Was stale, now has only the current request — clean entry existed
  }

  store.set(ip, timestamps);

  // Periodic cleanup: remove IPs with no recent activity
  if (Math.random() < 0.01) {
    for (const [key, ts] of store) {
      if (ts.every((t) => t <= windowStart)) {
        store.delete(key);
      }
    }
  }

  const allowed = timestamps.length <= MAX_REQUESTS;
  const remaining = Math.max(0, MAX_REQUESTS - timestamps.length);

  return { allowed, remaining };
}
