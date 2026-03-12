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

const WINDOW_MS = 60_000;   // 1 minute
const MAX_REQUESTS = 60;    // per window per IP
const MAX_STORE_SIZE = 10_000; // cap entries to prevent unbounded memory growth
const CLEANUP_INTERVAL_MS = 5 * 60_000; // cleanup every 5 minutes

// Periodic cleanup — runs on a timer instead of probabilistic per-request
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function scheduleCleanup() {
  if (cleanupTimer !== null) return;
  cleanupTimer = setInterval(() => {
    const windowStart = Date.now() - WINDOW_MS;
    for (const [key, ts] of store) {
      if (ts.every((t) => t <= windowStart)) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);
  // Don't block Node.js process from exiting
  if (cleanupTimer.unref) cleanupTimer.unref();
}

export function rateLimit(ip: string): RateLimitResult {
  scheduleCleanup();

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  let timestamps = store.get(ip) ?? [];
  timestamps = timestamps.filter((t) => t > windowStart);
  timestamps.push(now);

  // If store is at capacity and this is a new IP, evict oldest entry
  if (!store.has(ip) && store.size >= MAX_STORE_SIZE) {
    const firstKey = store.keys().next().value;
    if (firstKey !== undefined) store.delete(firstKey);
  }

  store.set(ip, timestamps);

  const allowed = timestamps.length <= MAX_REQUESTS;
  const remaining = Math.max(0, MAX_REQUESTS - timestamps.length);

  return { allowed, remaining };
}
