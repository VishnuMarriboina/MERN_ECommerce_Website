const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

// entry shape: { data: any, expiresAt: number }
const store = new Map();

// Purge expired entries every minute so the Map doesn't grow unbounded
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}, 60_000).unref(); // .unref() so this timer never keeps the process alive alone

const userCache = {
  get(userId) {
    const entry = store.get(userId);
    if (!entry) return null;
    if (Date.now() >= entry.expiresAt) {
      store.delete(userId);
      return null;
    }
    return entry.data;
  },

  set(userId, data, ttlMs = DEFAULT_TTL_MS) {
    store.set(userId, { data, expiresAt: Date.now() + ttlMs });
  },

  // Call this whenever a user's profile is updated so stale data is never served
  invalidate(userId) {
    store.delete(userId);
  },

  size() {
    return store.size;
  },
};

module.exports = userCache;
