import { createSlice } from "@reduxjs/toolkit";

import api from "../../utils/APIKit";

// Initial State
const initialState = {
  loading: false,
  data: [],
  error: "",
};
export const watchSlice = createSlice({
  name: "watch",
  initialState,
  reducers: {
    watchLoading: (state) => {
      state.loading = true;
      state.error = "";
    },
    watchSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    },
    watchError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { watchLoading, watchSuccess, watchError } = watchSlice.actions;

export default watchSlice.reducer;

export const fetchWatch = () => async (dispatch) => {
  dispatch(watchLoading());
  try {

    // console.log("fetching watches called in the slice 39");
    const response = await api.get("/accessories/getWatches");
    dispatch(watchSuccess(response.data));
  } catch (error) {
    dispatch(watchError(error?.response?.data));
  }
};

export const addWatch = (watchData) => async (dispatch) => {
  dispatch(watchLoading());
  try {
    const response = await api.post("/accessories/addNewWatches", watchData);
    dispatch(watchSuccess(response.data));
  } catch (error) {
    dispatch(watchError(error?.response?.data));
  }
};

export const updateWatch = (payload) => async (dispatch) => {
  dispatch(watchLoading());
  try {
    let id = payload.id;
    let updatedData = payload;

    const response = await api.put(
      `/accessories/watch/update-Watch/${id}`,
      updatedData
    );
    dispatch(watchSuccess(response.data));
  } catch (error) {
    dispatch(watchError(error?.response?.data));
  }
};

export const deleteWatch = (id) => async (dispatch) => {
  dispatch(watchLoading());
  try {
    const response = await api.delete(`/accessories/watch/delete-Watch/${id}`);
    dispatch(watchSuccess(response.data));
  } catch (error) {
    dispatch(watchError(error?.response?.data));
  }
};

export const addVariant = (data) => async (dispatch) => {
  try {
    dispatch(watchLoading());

    const response = await api.post(
      `/accessories/watch/${data.id}/addVariant`,
      data.variantData
    );
    dispatch(watchSuccess(response.data));
  } catch (error) {
    dispatch(watchError(error?.response?.data));
  }
};

export const updateVariant = (data) => async (dispatch) => {
  try {
    dispatch(watchLoading());

    // console.log("data in watch slice", data);
    // console.log("id", data.id);

    // console.log("variantData", data.variantData);
    // console.log("variantData.id", data.variantData.id);
    const response = await api.put(
      `/accessories/watch/${data.id}/updateVariant/${data.variantData.id}`,
      data.variantData
    );
    dispatch(watchSuccess(response.data));
  } catch (error) {
    dispatch(watchError(error?.response?.data));
  }
};

export const deleteVariant = (id) => async (dispatch) => {
  try {
    dispatch(watchLoading());
    const response = await api.delete(
      `/accessories/watch/${id.id}/deleteVariant/${id.variantData.id}`
    );
    dispatch(watchSuccess(response.data));
  } catch (error) {
    dispatch(watchError(error?.response?.data));
  }
};
