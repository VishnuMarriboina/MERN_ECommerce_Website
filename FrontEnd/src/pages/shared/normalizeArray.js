export function normalizeArray(data, primaryKey) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    return data[primaryKey] || data.data || data.items || data.results || [];
  }
  return [];
}
