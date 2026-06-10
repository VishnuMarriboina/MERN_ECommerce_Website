import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/APIKit";
import { ENDPOINTS } from "../../utils/endpoints";

export const fetchCategorySchema = createAsyncThunk(
  "categorySchema/fetchOne",
  async (categoryName, { rejectWithValue }) => {
    try {
      const res = await api.get(ENDPOINTS.genericProducts.categorySchema(categoryName));
      return res.data.data;
    } catch (error) {
      if (error?.response?.status === 404) return null;
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch schema");
    }
  }
);

export const fetchAllCategorySchemas = createAsyncThunk(
  "categorySchema/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(ENDPOINTS.genericProducts.categorySchemas);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch schemas");
    }
  }
);

export const defineCategorySchema = createAsyncThunk(
  "categorySchema/define",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(ENDPOINTS.genericProducts.defineCategory, payload);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteCategorySchema = createAsyncThunk(
  "categorySchema/delete",
  async (categoryName, { rejectWithValue }) => {
    try {
      const res = await api.delete(ENDPOINTS.genericProducts.deleteCategorySchema(categoryName));
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
