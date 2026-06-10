import { useState, useEffect } from "react";
import api from "../../utils/APIKit";
import { ENDPOINTS } from "../../utils/endpoints";

export function useProductsByCategory(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!category) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.get(ENDPOINTS.genericProducts.getByCategory(category))
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.message || "Failed to load products");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [category]);

  return { products, loading, error };
}
