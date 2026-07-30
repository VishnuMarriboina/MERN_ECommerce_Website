import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGenericProducts,
  regProduct,
  updateGenericProduct,
  deleteGenericProduct,
  addGenericVariant,
  updateGenericVariant,
  deleteGenericVariant,
} from "./genericProduct.thunk";

const initialState = {
  loading: false,
  products: [],
  error: null,
  lastMessage: "",
};

const genericProductSlice = createSlice({
  name: "genericProduct",
  initialState,
  reducers: {
    clearGenericError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Fetch: updates the products list
    builder
      .addCase(fetchGenericProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenericProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchGenericProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Mutations: track loading/error only — component refetches after success
    [regProduct, updateGenericProduct, deleteGenericProduct, addGenericVariant, updateGenericVariant, deleteGenericVariant].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.lastMessage = action.payload?.message || "";
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export const { clearGenericError } = genericProductSlice.actions;
export default genericProductSlice.reducer;
