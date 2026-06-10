import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart, getCart, updateCartQuantity,
  removeFromCart, clearCart, buyAllCartItemsAsync,
} from "../thunks/cartThunks";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  purchaseSuccess: false,
  results: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // addToCart
    builder
      .addCase(addToCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => { state.loading = false; state.cartItems = action.payload; })
      .addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // getCart
    builder
      .addCase(getCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getCart.fulfilled, (state, action) => { state.loading = false; state.cartItems = action.payload; })
      .addCase(getCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // updateCartQuantity
    builder
      .addCase(updateCartQuantity.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCartQuantity.fulfilled, (state, action) => { state.loading = false; state.cartItems = action.payload; })
      .addCase(updateCartQuantity.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // removeFromCart
    builder
      .addCase(removeFromCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.loading = false; state.cartItems = action.payload; })
      .addCase(removeFromCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // clearCart
    builder
      .addCase(clearCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        state.results = {};
        state.purchaseSuccess = false;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // buyAllCartItemsAsync
    builder
      .addCase(buyAllCartItemsAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(buyAllCartItemsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results || {};
        state.purchaseSuccess = action.payload.success;
        state.cartItems = action.payload.remainingItems || [];
      })
      .addCase(buyAllCartItemsAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default cartSlice.reducer;

export {
  addToCart, getCart, updateCartQuantity,
  removeFromCart, clearCart, buyAllCartItemsAsync,
};
