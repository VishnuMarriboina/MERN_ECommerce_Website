import { createSlice } from "@reduxjs/toolkit";
import api from "../../utils/APIKit";
// Initial State
const initialState = {
  loading: false,
  data: [],
  error: "",
};

export const sandalSlice = createSlice({
  name: "sandal",
  initialState,
  reducers: {
    sandalLoading: (state) => {
      state.loading = true;
      state.error = "";
    },
    sandalSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    },
    sandalError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default sandalSlice.reducer;

const { sandalLoading, sandalSuccess, sandalError } = sandalSlice.actions;

export const fetchSandal = () => async (dispatch) => {
  try {
    dispatch(sandalLoading());
    const response = await api.get("/footwear/getSandals");
    dispatch(sandalSuccess(response.data));
  } catch (error) {
    dispatch(sandalError(error?.response?.data));
  }
};

export const addSandal = (sandalData) => async (dispatch) => {
  try {
    dispatch(sandalLoading());
    const response = await api.post("/footwear/addNewSandals", sandalData);
    dispatch(sandalSuccess(response.data));
  } catch (error) {
    dispatch(sandalError(error?.response?.data));
  }
};

export const updateSandal = (payload) => async (dispatch) => {
  try {
    dispatch(sandalLoading());


    // console.log("updatedData", payload);
    // console.log("id", payload.id);
    const response = await api.put(
      `/footwear/update-Sandals/${payload.id}`,
    payload
    );
    dispatch(sandalSuccess(response.data));
  } catch (error) {
    dispatch(sandalError(error?.response?.data));
  }
};

export const addVariant = (data) => async (dispatch) => {
  try {
    dispatch(sandalLoading());
    const response = await api.post(
      `/footwear/sandals/${data.id}/addVariant`,
      data.variantData
    );
    dispatch(sandalSuccess(response.data));
  } catch (error) {
    dispatch(sandalError(error?.response?.data));
  }
};

export const updateVariant = (payload) => async (dispatch) => {
  try {


    dispatch(sandalLoading());
    const response = await api.put(
      `/footwear/sandals/${payload.id}/updateVariant/${payload.variantData.id}`,
      payload.variantData
    );
    dispatch(sandalSuccess(response.data));
  } catch (error) {
    dispatch(sandalError(error?.response?.data));
  }
};

export const deleteSandal = (id) => async (dispatch) => {
  try {
    dispatch(sandalLoading());
    const response = await api.delete(`/footwear/delete-Sandals/${id}`);
    dispatch(sandalSuccess(response.data));
  } catch (error) {
    dispatch(sandalError(error?.response?.data));
  }
};

export const deleteVariant = (id) => async (dispatch) => {
  try {
    dispatch(sandalLoading());
    const response = await api.delete(
      `/footwear/sandals/${id.id}/deleteVariant/${id.variantData.id}`
    );
    dispatch(sandalSuccess(response.data));
  } catch (error) {
    dispatch(sandalError(error?.response?.data));
  }
};
