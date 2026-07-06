const DEFAULT_TIMEOUT_MS = 5000;

// fetch wrapper that aborts the request after timeoutMs instead of hanging forever
// when a downstream service is slow or unreachable.
const fetchWithTimeout = async (url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

module.exports = { fetchWithTimeout, DEFAULT_TIMEOUT_MS };
