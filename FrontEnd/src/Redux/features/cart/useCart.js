import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart, getCart, updateCartQuantity,
  removeFromCart, clearCart, buyAllCartItemsAsync,
} from "./cart.thunk";

export function useCart() {
  const dispatch = useDispatch();
  const { cartItems, loading, error, purchaseSuccess, results } = useSelector((s) => s.cart);

  const loadCart = useCallback(() => dispatch(getCart()), [dispatch]);
  const addItem = useCallback((payload) => dispatch(addToCart(payload)), [dispatch]);
  const changeQuantity = useCallback((payload) => dispatch(updateCartQuantity(payload)), [dispatch]);
  const removeItem = useCallback((payload) => dispatch(removeFromCart(payload)), [dispatch]);
  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);
  const buyAll = useCallback((paymentData) => dispatch(buyAllCartItemsAsync(paymentData)), [dispatch]);

  return {
    cartItems, loading, error, purchaseSuccess, results,
    loadCart, addItem, changeQuantity, removeItem, clear, buyAll,
  };
}
