import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategorySchema, fetchAllCategorySchemas, defineCategorySchema, deleteCategorySchema,
} from "./categorySchema.thunk";
import { clearSchema } from "./categorySchema.slice";

export function useCategorySchema() {
  const dispatch = useDispatch();
  const { loading, schema, allSchemas, error } = useSelector((s) => s.categorySchema);

  const loadSchema = useCallback((categoryName) => dispatch(fetchCategorySchema(categoryName)), [dispatch]);
  const loadAllSchemas = useCallback(() => dispatch(fetchAllCategorySchemas()), [dispatch]);
  const defineSchema = useCallback((payload) => dispatch(defineCategorySchema(payload)), [dispatch]);
  const removeSchema = useCallback((categoryName) => dispatch(deleteCategorySchema(categoryName)), [dispatch]);
  const clear = useCallback(() => dispatch(clearSchema()), [dispatch]);

  return {
    loading, schema, allSchemas, error,
    loadSchema, loadAllSchemas, defineSchema, removeSchema, clear,
  };
}
