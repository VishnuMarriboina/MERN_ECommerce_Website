class RoundRobin {
  constructor(urls) {
    this.urls = urls;
    this.index = 0;
  }

  next() {
    const url = this.urls[this.index];
    this.index = (this.index + 1) % this.urls.length;
    return url;
  }
}

// envValue: comma-separated URL string, e.g. "http://localhost:3002,http://localhost:3012"
const createBalancer = (envValue) => {
  const urls = (envValue || "").split(",").map((u) => u.trim()).filter(Boolean);
  if (urls.length === 0) throw new Error(`Load balancer: no URLs configured (got "${envValue}")`);
  if (urls.length === 1) return { next: () => urls[0] };
  return new RoundRobin(urls);
};

module.exports = { createBalancer };
