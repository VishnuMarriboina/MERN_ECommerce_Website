import { createSlice } from "@reduxjs/toolkit";

import api from "../../utils/APIKit";

// Initial State
const initialState = {
  loading: false,
  data: [],
  error: "",
};

// Slice
export const shoeSlice = createSlice({
  name: "shoe",
  initialState,
  reducers: {
    shoeLoading: (state) => {
      state.loading = true;
      state.error = "";
    },
    shoeSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    },
    shoeError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Actions
export const { shoeLoading, shoeSuccess, shoeError } = shoeSlice.actions;

// Reducer
export default shoeSlice.reducer;

// ✅ GET request
export const fetchShoe = () => async (dispatch) => {
  try {
    dispatch(shoeLoading());
    const response = await api.get("/footwear/getShoes");
    dispatch(shoeSuccess(response.data));
  } catch (error) {
    // dispatch(shoeError(error.message));
    dispatch(shoeError(error?.response?.data?.message));
  }
};

// ✅ POST request (with payload for adding new shoe)
export const addShoe = (shoeData) => async (dispatch) => {
  try {
    dispatch(shoeLoading());
    const response = await api.post("/footwear/addNewShoes", shoeData);
    dispatch(shoeSuccess(response.data));
  } catch (error) {
    // dispatch(shoeError(error.message));
    dispatch(shoeError(error?.response?.data?.message));
  }
};

// ✅ PUT request (with ID and updated data)
export const updateShoe = (payload) => async (dispatch) => {
  try {
    // console.log("payload",payload)

    dispatch(shoeLoading());
    const response = await api.put(
      `/footwear/update-Shoes/${payload.id}`,
      payload
    );
    dispatch(shoeSuccess(response.data));
  } catch (error) {
    // dispatch(shoeError(error.message));
    dispatch(shoeError(error?.response?.data?.message));
  }
};

export const deleteShoe = (id) => async (dispatch) => {
  try {
    dispatch(shoeLoading());

    const response = await api.delete(`/footwear/delete-Shoes/${id}`);
    dispatch(shoeSuccess(response.data));
  } catch (error) {
    // dispatch(shoeError(error.message));
    dispatch(shoeError(error?.response?.data?.message));
  }
};

export const addVariant = (data) => async (dispatch) => {
  try {
    dispatch(shoeLoading());
    const response = await api.post(
      `/footwear/shoes/${data.id}/addVariant`,
      data.variantData
    );

    // console.log("response in the 97", response.data);
    dispatch(shoeSuccess(response.data));
  } catch (error) {
    dispatch(shoeError(error?.response?.data?.message));
  }
};

export const updateVariant = (payload) => async (dispatch) => {
  try {
    dispatch(shoeLoading());
    const response = await api.put(
      `/footwear/shoes/${payload.id}/updateVariant/${payload.variantData.id}`,
      payload.variantData
    );
    dispatch(shoeSuccess(response.data));
  } catch (error) {
    // dispatch(shoeError(error?.response?.data));
    dispatch(shoeError(error?.response?.data?.message));
  }
};

export const deleteVariant = (id) => async (dispatch) => {
  try {
    dispatch(shoeLoading());
    const response = await api.delete(
      `/footwear/shoes/${id.id}/deleteVariant/${id.variantData.id}`
    );
    dispatch(shoeSuccess(response.data));
  } catch (error) {
    dispatch(shoeError(error?.response?.data?.message));
  }
};
