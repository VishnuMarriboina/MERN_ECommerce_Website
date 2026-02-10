import { createSlice } from "@reduxjs/toolkit";
import api from "../../utils/APIKit";
// Initial State
const initialState = {
  loading: false,
  data: [],
  error: "",
};

// Slice
export const beltSlice = createSlice({
  name: "belt",
  initialState,
  reducers: {
    beltLoading: (state) => {
      state.loading = true;
      state.error = "";
    },
    beltSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    },
    beltError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default beltSlice.reducer;

const { beltLoading, beltSuccess, beltError } = beltSlice.actions;

// ✅ GET request
export const fetchBelt = () => async (dispatch) => {
  try {
    dispatch(beltLoading());
    const response = await api.get("/accessories/getBelts");
    dispatch(beltSuccess(response.data));
    // console.log("data from get api", response.data);
  } catch (error) {
    dispatch(beltError(error?.response?.data));
    // console.log("error from get api", error);
  }
};

// ✅ POST request (with payload for adding new belt)
export const addBelt = (beltData) => async (dispatch) => {
  try {
    dispatch(beltLoading());

    // console.log("belts data", beltData);
    const response = await api.post("/accessories/addNewBelts", beltData);
    dispatch(beltSuccess(response.data));
  } catch (error) {
    dispatch(beltError(error?.response?.data));
  }
};

// ✅ PUT request (with ID and updated data)
export const updateBelt = (payload) => async (dispatch) => {
  try {
    let Id = payload.id;
    let updatedData = payload;
    dispatch(beltLoading());
    const response = await api.put(
      `/accessories/update-Belt/${Id}`,
      updatedData
    );
    dispatch(beltSuccess(response.data));
  } catch (error) {
    dispatch(beltError(error?.response?.data));
  }
};

export const deleteBelt = (id) => async (dispatch) => {
  try {
    dispatch(beltLoading());
    const response = await api.delete(`/accessories/delete-Belt/${id}`);
    dispatch(beltSuccess(response.data));
  } catch (error) {
    dispatch(beltError(error?.response?.data));
  }
};

export const addVariant = (data) => async (dispatch) => {
  try {
    dispatch(beltLoading());

    const response = await api.post(
      `/accessories/${data.id}/addVariant`,
      data.variantData
    );
    console.log("response in the 97", response.response.data);
    dispatch(beltSuccess(response.data));
  } catch (error) {
    console.log("error in belt slice", error);
    console.log("error in belt slice", error?.response?.data?.message);
    dispatch(beltError(error?.response?.data?.message));
  }
};
export const updateVariant = (data) => async (dispatch) => {
  try {
    dispatch(beltLoading());

    // console.log("data", data);
    // console.log("data.variantData", data.variantData);
    // console.log("data.variantData.id", data.variantData.id);
    // console.log("data.id", data.id);

    const response = await api.put(
      `/accessories/${data.id}/update-variant/${data.variantData.id}`,
      data.variantData
    );
    dispatch(beltSuccess(response.data));
  } catch (error) {
    dispatch(beltError(error?.response?.data));
  }
};

export const deleteVariant = (id) => async (dispatch) => {
  try {
    dispatch(beltLoading());
    const response = await api.delete(
      `/accessories/${id.id}/delete-variant/${id.variantData.id}`
    );
    dispatch(beltSuccess(response.data));
  } catch (error) {
    dispatch(beltError(error?.response?.data));
  }
};
