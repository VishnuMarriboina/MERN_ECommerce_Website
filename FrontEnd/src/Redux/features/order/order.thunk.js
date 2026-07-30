import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/APIKit";
import { ENDPOINTS } from "../../../utils/endpoints";

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await api.post(ENDPOINTS.orders.create, orderData);
      return { order: res.data.order };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to place order"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(ENDPOINTS.orders.myOrders);
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch orders"
      );
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(ENDPOINTS.orders.all);
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch all orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(ENDPOINTS.orders.updateStatus(orderId), { status });
      return { order: res.data.order };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update order"
      );
    }
  }
);

export const CancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.put(ENDPOINTS.orders.cancel(orderId));
      return { order: res.data.order };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to cancel order"
      );
    }
  }
);
