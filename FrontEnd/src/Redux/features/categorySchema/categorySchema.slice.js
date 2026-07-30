import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategorySchema,
  fetchAllCategorySchemas,
  defineCategorySchema,
  deleteCategorySchema,
} from "./categorySchema.thunk";

const initialState = {
  loading:    false,
  schema:     null,   // active category's schema (or null if undefined)
  allSchemas: [],
  error:      null,
};

const categorySchemaSlice = createSlice({
  name: "categorySchema",
  initialState,
  reducers: {
    clearSchema: (state) => { state.schema = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorySchema.pending,  (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategorySchema.fulfilled, (state, action) => {
        state.loading = false;
        state.schema  = action.payload; // null when 404
      })
      .addCase(fetchCategorySchema.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
        state.schema  = null;
      })

      .addCase(fetchAllCategorySchemas.fulfilled, (state, action) => {
        state.allSchemas = action.payload;
      })

      .addCase(defineCategorySchema.pending,  (state) => { state.loading = true; state.error = null; })
      .addCase(defineCategorySchema.fulfilled, (state, action) => {
        state.loading = false;
        state.schema  = action.payload;
        // update allSchemas list
        const idx = state.allSchemas.findIndex(
          (s) => s.categoryName?.toLowerCase() === action.payload?.categoryName?.toLowerCase()
        );
        if (idx >= 0) state.allSchemas[idx] = action.payload;
        else state.allSchemas.push(action.payload);
      })
      .addCase(defineCategorySchema.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      .addCase(deleteCategorySchema.fulfilled, (state) => {
        state.schema = null;
      });
  },
});

export const { clearSchema } = categorySchemaSlice.actions;
export default categorySchemaSlice.reducer;
