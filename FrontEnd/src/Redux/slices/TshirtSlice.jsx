import { createSlice } from "@reduxjs/toolkit";
import api from "../../utils/APIKit";
// Initial State
const initialState = {
  loading: false,
  data: [],
  error: "",
  successMsg: "",
};

// Slice
export const tshirtSlice = createSlice({
  name: "tshirt",
  initialState,
  reducers: {
    tshirtLoading: (state) => {
      state.loading = true;
      state.error = "";
      state.successMsg = "";
    },
    tshirtSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
      state.successMsg = "";
    },
    tshirtError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMsg = "";
    },
  },
});

// Actions
export const { tshirtLoading, tshirtSuccess, tshirtError } =
  tshirtSlice.actions;

// Reducer
export default tshirtSlice.reducer;

// ✅ GET request
export const fetchTshirt = () => async (dispatch) => {
  try {
    // console.log("fetching tshirts in the slice");
    dispatch(tshirtLoading());
    const response = await api.get("/clothes/getTshirts");

    // console.log("Tshirts: in the slice", response.data.data);
    dispatch(tshirtSuccess(response.data.data));
  } catch (error) {
   dispatch(tshirtError(error?.response?.data));
  }
};

// add variant
export const addVariant = (data) => async (dispatch) => {
  try {
    // console.log("data in tshirt slice", data);
    dispatch(tshirtLoading());

    const response = await api.post(
      `/clothes/tshirt/${data.id}/variant`,
      data.variantData
    );
    dispatch(tshirtSuccess(response.data));
  } catch (error) {
    dispatch(tshirtError(error?.response?.data));
  }
};

export const updateVariant = (data) => async (dispatch) => {
  try {
    dispatch(tshirtLoading());
    const response = await api.put(
      `/clothes/tshirt/${data.id}/variant/${data.variantData.id}`,
      data.variantData
    );
    dispatch(tshirtSuccess(response.data));
  } catch (error) {
   dispatch(tshirtError(error?.response?.data));
  }
};
export const deleteVariant = (id) => async (dispatch) => {
  try {
    let variantId = id.variantData.id;

    dispatch(tshirtLoading());
    const response = await api.delete(
      `/clothes/tshirt/${id.id}/variant/${variantId}`
    );
    dispatch(tshirtSuccess(response.data));
  } catch (error) {
   dispatch(tshirtError(error?.response?.data));
  }
};

// ✅ GET request (with payload for adding new tshirt)
export const addTshirt = (tshirtData) => async (dispatch) => {
  try {
    dispatch(tshirtLoading());
    const response = await api.post("/clothes/addNewTshirts", tshirtData);
    dispatch(tshirtSuccess(response.data));
  } catch (error) {
   dispatch(tshirtError(error?.response?.data));
  }
};

// ✅ PUT request (with ID and updated data)
export const updateTshirt = (payload) => async (dispatch) => {
  try {
    let Id = payload.id;
    let updatedData = payload;

    dispatch(tshirtLoading());
    const response = await api.put(`/clothes/update-Tshirt/${Id}`, updatedData);
    dispatch(tshirtSuccess(response.data));
  } catch (error) {
   dispatch(tshirtError(error?.response?.data));
  }
};

export const deleteTshirt = (id) => async (dispatch) => {
  try {
    dispatch(tshirtLoading());
    const response = await api.delete(`/clothes/deletetshirt/${id}`);
    dispatch(tshirtSuccess(response.data));
  } catch (error) {
   dispatch(tshirtError(error?.response?.data));
  }
};
