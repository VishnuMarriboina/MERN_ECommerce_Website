import { createSlice } from "@reduxjs/toolkit";

import api from "../../utils/APIKit";

const initialState = {
  orders: [], // Logged-in user's orders
  allOrders: [], // Admin orders
  loading: false,
  error: null,
  successMessage: "",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
      state.successMessage = "";
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAllOrders: (state, action) => {
      state.allOrders = action.payload;
      state.loading = false;
      state.error = null;
    },
    setOrderSuccess: (state, action) => {
      state.successMessage = action.payload;
      state.loading = false;
      state.error = null;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.successMessage = "";
    },
  },
});

export const {
  setOrderLoading,
  setOrders,
  setAllOrders,
  setOrderSuccess,
  setOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;

/* =========================================================
    ✅ Async Thunks (API Calls)
   ========================================================= */

// 🔹 Place Order
export const placeOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(setOrderLoading(true));

    const res = await api.post("/orders/create", orderData);

    dispatch(setOrderSuccess("Order placed successfully!"));

    return { success: true, order: res.data.order };
  } catch (error) {
    dispatch(
      setOrderError(error.response?.data?.error || "Failed to place order")
    );
    return { success: false };
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// 🔹 Get Logged-in User Orders
export const fetchMyOrders = () => async (dispatch) => {
  try {
    dispatch(setOrderLoading(true));

    const res = await api.get("/orders/my-orders");

    dispatch(setOrders(res.data.orders));

    // console.log("res in the fetchMyOrders", res);

    return { success: true };
  } catch (error) {
    dispatch(
      setOrderError(error.response?.data?.error || "Failed to fetch orders")
    );
    return { success: false };
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// 🔹 Get All Orders (Admin)
export const fetchAllOrders = () => async (dispatch) => {
  try {
    dispatch(setOrderLoading(true));

    // console.log("fetching all orders in the slice");
    const res = await api.get("/orders/all");
    // console.log("res in the fetchAllOrders", res);
    dispatch(setAllOrders(res.data.orders));
    // console.log("res in the fetchAllOrders", res);
    // console.log("res in the fetchAllOrders", res.data.orders);

    return { success: true };
  } catch (error) {
    dispatch(
      setOrderError(error.response?.data?.error || "Failed to fetch all orders")
    );
    return { success: false };
  } finally {
    dispatch(setOrderLoading(false));
  }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    dispatch(setOrderLoading(true));



    const res = await api.put(`/orders/update-status/${orderId}`, { status });

    return { success: true, order: res.data.order };
  } catch (error) {
    dispatch(
      setOrderError(error.response?.data?.error || "Failed to update order")
    );
    return { success: false };
  } finally {
    dispatch(setOrderLoading(false));
  }
};

export const CancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(setOrderLoading(true));
    const res = await api.put(`/orders/cancel-order/${orderId}`);
    return { success: true, order: res.data.order };
  } catch (error) {
    dispatch(
      setOrderError(error.response?.data?.error || "Failed to cancel order")
    );
    return { success: false };
  } finally {
    dispatch(setOrderLoading(false));
  }
};

/* =========================================================
    ✅ Selectors
   ========================================================= */
export const selectOrders = (state) => state.orders.orders;
export const selectAllOrders = (state) => state.orders.allOrders;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;
export const selectOrderSuccess = (state) => state.orders.successMessage;
