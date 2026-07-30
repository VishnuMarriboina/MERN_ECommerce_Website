import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/APIKit";
import { ENDPOINTS } from "../../../utils/endpoints";

export const fetchGenericProducts = createAsyncThunk(
  "genericProduct/fetch",
  async (category, { rejectWithValue }) => {
    try {
      const res = await api.get(ENDPOINTS.genericProducts.getByCategory(category));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const regProduct = createAsyncThunk(
  "genericProduct/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(ENDPOINTS.genericProducts.register, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateGenericProduct = createAsyncThunk(
  "genericProduct/update",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.put(ENDPOINTS.genericProducts.update(payload.id), payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteGenericProduct = createAsyncThunk(
  "genericProduct/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(ENDPOINTS.genericProducts.delete(id));
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateGenericVariant = createAsyncThunk(
  "genericProduct/updateVariant",
  async ({ id, variantId, variantData }, { rejectWithValue }) => {
    try {
      const res = await api.put(ENDPOINTS.genericProducts.updateVariant(id, variantId), variantData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const addGenericVariant = createAsyncThunk(
  "genericProduct/addVariant",
  async ({ id, variantData }, { rejectWithValue }) => {
    try {
      const res = await api.post(ENDPOINTS.genericProducts.addVariant(id), variantData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteGenericVariant = createAsyncThunk(
  "genericProduct/deleteVariant",
  async ({ id, variantId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(ENDPOINTS.genericProducts.deleteVariant(id, variantId));
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
