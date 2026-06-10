import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/APIKit";
import { ENDPOINTS } from "../../utils/endpoints";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, variantId, productModel, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.post(ENDPOINTS.cart.add, { productId, variantId, productModel, quantity });
      return res.data.cart.items;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || "Add to cart failed");
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(ENDPOINTS.cart.get);
      return res.data.items || [];
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || "Failed to fetch cart");
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ cartItemId, productModel, quantity }, { getState, rejectWithValue }) => {
    try {
      const res = await api.put(ENDPOINTS.cart.updateQty, { cartItemId, productModel, quantity });
      const updatedItems = res?.data?.cart?.items || res?.data?.items || [];
      const { cartItems } = getState().cart;
      return cartItems.map((item) => {
        const updated = updatedItems.find((u) => u._id === item._id);
        return updated ? { ...item, quantity: updated.quantity } : item;
      });
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || "Failed to update quantity");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ cartItemId }, { getState, rejectWithValue }) => {
    try {
      await api.delete(ENDPOINTS.cart.remove, { data: { cartItemId } });
      const { cartItems } = getState().cart;
      return cartItems.filter((item) => item._id !== cartItemId);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || "Failed to remove item");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete(ENDPOINTS.cart.clear);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || "Failed to clear cart");
    }
  }
);

export const buyAllCartItemsAsync = createAsyncThunk(
  "cart/buyAll",
  async (paymentData, { rejectWithValue }) => {
    try {
      const res = await api.post(ENDPOINTS.cart.buyAll, paymentData);
      const { message, order } = res.data;
      return { success: true, order, message };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to process purchase"
      );
    }
  }
);
