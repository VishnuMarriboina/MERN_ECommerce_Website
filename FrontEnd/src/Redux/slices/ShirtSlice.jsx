import { createSlice } from "@reduxjs/toolkit";
import api from "../../utils/APIKit";

const initialState = {
  loading: false,
  data: [],
  error: "",
  successMsg: "",
  errorMsg: "",
};

export const shirtSlice = createSlice({
  name: "shirt",
  initialState,
  reducers: {
    shirtLoading: (state) => {
      state.loading = true;
      state.errorMsg = "";
      state.successMsg = "";
      // state.data = [];
    },
    shirtSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
      state.successMsg = "";
    },
    shirtError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMsg = "";
    },
    shirtBuySuccess: (state, action) => {
      state.loading = false;
      state.successMsg = action.payload;
      state.errorMsg = "";
    },
    resetShirtSuccess: (state) => {
      state.successMsg = "";
      state.error = "";
    },
  },
});

export const {
  shirtLoading,
  shirtSuccess,
  shirtError,
  shirtBuySuccess,
  resetShirtSuccess,
} = shirtSlice.actions;

export default shirtSlice.reducer;

// ✅ GET request

export const fetchShirt = () => async (dispatch) => {
  try {
    dispatch(shirtLoading());

    const response = await api.get("/clothes/getShirts");

    // console.log("Shirts res in 65:", response.data);
    dispatch(shirtSuccess(response.data));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("Unauthorized! Please log in again.");
    } else {
      // console.error("Error fetching shirts:", error);
      dispatch(shirtError(error?.response?.data));
    }
  }
};

export const addShirt = (values) => async (dispatch) => {
  try {
    // console.log("shirtData------------", values);

    dispatch(shirtLoading());
    const response = await api.post("/clothes/addNewShirts", values);
    dispatch(shirtSuccess(response.data));
    // console.log("data from post api in slice", response.data);
  } catch (error) {
    dispatch(shirtError(error?.response?.data));
  }
};

export const updateShirt = (payload) => async (dispatch) => {
  try {
    dispatch(shirtLoading());
    const response = await api.put(
      `/clothes/update-Shirt/${payload.id}`,
      payload
    );
    dispatch(shirtSuccess(response.data));
  } catch (error) {
    dispatch(shirtError(error?.response?.data));
  }
};

export const addVariant = (data) => async (dispatch) => {
  try {
    dispatch(shirtLoading());
    const response = await api.post(
      `/clothes/${data.id}/add-variant`,
      data.variantData
    );
    dispatch(shirtSuccess(response.data));
  } catch (error) {
    dispatch(shirtError(error?.response?.data));
  }
};
export const updateVariant = (data) => async (dispatch) => {
  try {
    // console.log("updatedData", data);
    // console.log("id", data.id);
    // console.log("variantData", data.variantData);
    // console.log("id", id);
    dispatch(shirtLoading());
    const response = await api.put(
      `/clothes/${data.id}/update-variant/${data.variantData.id}`,
      data.variantData
    );

    // console.log("response", response.data);
    dispatch(shirtSuccess(response.data));
  } catch (error) {
    dispatch(shirtError(error?.response?.data));
  }
};

export const deleteShirt = (id) => async (dispatch) => {
  try {
    dispatch(shirtLoading());
    const response = await api.delete(`/clothes/delete-Shirt/${id}`);
    dispatch(shirtSuccess(response.data));
  } catch (error) {
    dispatch(shirtError(error?.response?.data));
  }
};

export const deleteVariant = (id) => async (dispatch) => {
  try {
    // console.log("id", id.id);
    // console.log("id", id.variantData.id);

    let shirtId = id.id;
    let variantId = id.variantData.id;

    dispatch(shirtLoading());
    const response = await api.delete(
      `/clothes/${shirtId}/delete-variant/${variantId}`
    );
    dispatch(shirtSuccess(response.data));
  } catch (error) {
    dispatch(shirtError(error?.response?.data));
  }
};
