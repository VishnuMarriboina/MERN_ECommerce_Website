import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGenericProducts, regProduct, updateGenericProduct,
  deleteGenericProduct, addGenericVariant, updateGenericVariant, deleteGenericVariant,
} from "./genericProduct.thunk";
import { clearGenericError } from "./genericProduct.slice";

export function useGenericProduct() {
  const dispatch = useDispatch();
  const { loading, products, error, lastMessage } = useSelector((s) => s.genericProduct);

  const loadProducts = useCallback((category) => dispatch(fetchGenericProducts(category)), [dispatch]);
  const addProduct = useCallback((payload) => dispatch(regProduct(payload)), [dispatch]);
  const updateProduct = useCallback((payload) => dispatch(updateGenericProduct(payload)), [dispatch]);
  const deleteProduct = useCallback((id) => dispatch(deleteGenericProduct(id)), [dispatch]);
  const addVariant = useCallback((payload) => dispatch(addGenericVariant(payload)), [dispatch]);
  const updateVariant = useCallback((payload) => dispatch(updateGenericVariant(payload)), [dispatch]);
  const deleteVariant = useCallback((payload) => dispatch(deleteGenericVariant(payload)), [dispatch]);
  const clearError = useCallback(() => dispatch(clearGenericError()), [dispatch]);

  return {
    loading, products, error, lastMessage,
    loadProducts, addProduct, updateProduct, deleteProduct, addVariant, updateVariant, deleteVariant, clearError,
  };
}
