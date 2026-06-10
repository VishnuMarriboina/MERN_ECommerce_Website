import { createSlice } from "@reduxjs/toolkit";
import {
  placeOrder, fetchMyOrders, fetchAllOrders,
  updateOrderStatus, CancelOrder,
} from "../thunks/orderThunks";

const initialState = {
  orders: [],
  allOrders: [],
  loading: false,
  error: null,
  successMessage: "",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // placeOrder
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; state.successMessage = ""; })
      .addCase(placeOrder.fulfilled, (state) => { state.loading = false; state.successMessage = "Order placed successfully!"; })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // fetchMyOrders
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // fetchAllOrders
    builder
      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.loading = false; state.allOrders = action.payload; })
      .addCase(fetchAllOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // updateOrderStatus
    builder
      .addCase(updateOrderStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateOrderStatus.fulfilled, (state) => { state.loading = false; })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // CancelOrder
    builder
      .addCase(CancelOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(CancelOrder.fulfilled, (state) => { state.loading = false; })
      .addCase(CancelOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default orderSlice.reducer;

export const selectOrders = (state) => state.order.orders;
export const selectAllOrders = (state) => state.order.allOrders;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderSuccess = (state) => state.order.successMessage;

export { placeOrder, fetchMyOrders, fetchAllOrders, updateOrderStatus, CancelOrder };
