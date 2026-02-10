// cartSlice.jsx
import { createSlice } from "@reduxjs/toolkit";
import api from "../../utils/APIKit";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  purchaseSuccess: false,
  results: {},
  orders: [], // Logged-in user's orders
  allOrders: [], // Admin orders
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.error = null;
    },
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCartError: (state, action) => {
      state.error = action.payload;
    },
    clearCartState: (state) => {
      state.cartItems = [];
      state.results = {};
      state.purchaseSuccess = false;
      state.error = null;
    },
    setPurchaseSuccess: (state, action) => {
      state.purchaseSuccess = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setRemainingCart: (state, action) => {
      state.cartItems = action.payload;
    },
  },
});

export const {
  setCartItems,
  setCartLoading,
  setCartError,
  clearCartState,
  setPurchaseSuccess,
  setResults,
  setRemainingCart,
} = cartSlice.actions;

export default cartSlice.reducer;

/* ----------------- API Thunks -------------------- */

// ✅ Add to Cart
export const addToCart = (productId, variantId, productModel, quantity = 1) => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));

      // console.log("in the cart slice");
      // console.log(
      //   "productId",
      //   productId,
      //   "productModel",
      //   productModel,
      //   "quantity",
      //   quantity
      // );

      const res = await api.post("/cart/add", {
        productId,
        variantId,
        productModel,
        quantity,
      });

      // console.log("res", res);

      dispatch(setCartItems(res.data.cart.items));
      return { success: true };
    } catch (error) {
      dispatch(
        setCartError(error?.response?.data?.error || "Add to cart failed")
      );
      return { success: false };
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// ✅ Get Cart
export const getCart = () => {
  return async (dispatch) => {
    // console.log("in the getcart slice action 100");
    try {
      dispatch(setCartLoading(true));

      const res = await api.get("/cart");
      // console.log("res in the getCart slice line 107", res);
      dispatch(setCartItems(res.data.items || []));
    } catch (error) {
      dispatch(
        setCartError(error?.response?.data?.error || "Failed to fetch cart")
      );
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// ✅ Update Quantity
export const updateCartQuantityold = (
  cartItemId = productId,
  productModel,
  quantity
) => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));
      const res = await api.put("/cart/update-qty", {
        cartItemId,
        productModel,
        quantity,
      });

      dispatch(setCartItems(res.data.items));
    } catch (error) {
      dispatch(
        setCartError(
          error?.response?.data?.error || "Failed to update quantity"
        )
      );
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const updateCartQuantity = (cartItemId, productModel, quantity) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));

      console.log("cartItemId", cartItemId);
      console.log("quantity", quantity);
      console.log("productModel", productModel);
      // console.log("variantId", variantId);

      const res = await api.put("/cart/update-qty", {
        cartItemId,
        productModel,
        quantity,
      });

      const updatedItems = res?.data?.cart?.items || res?.data?.items || [];

      // 🔥 Merge new quantities with existing product details
      const { cartItems } = getState().cart;

      const merged = cartItems.map((item) => {
        const updated = updatedItems.find((u) => u._id === item._id);
        return updated ? { ...item, quantity: updated.quantity } : item;
      });

      // console.log("merged", merged);

      dispatch(setCartItems(merged));
    } catch (error) {
      // console.log("error in the updatecartquantity", error);
      dispatch(
        setCartError(
          error?.response?.data?.error || "Failed to update quantity"
        )
      );
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// ✅ Remove From Cart
export const removeFromCart = (productId, productModel) => {
  return async (dispatch, getState) => {
    // console.log("🗑️ In removeFromCart slice action");
    try {
      dispatch(setCartLoading(true));

      const res = await api.delete("/cart/remove", {
        data: { productId, productModel },
      });

      const updatedItems = res?.data?.cart?.items || res?.data?.items || [];

      // ✅ Merge existing product details back into updated list
      const { cartItems } = getState().cart;

      const merged = updatedItems.map((u) => {
        const existing = cartItems.find((c) => c._id === u._id);
        return existing
          ? { ...existing, ...u } // keep productDetails
          : u;
      });

      // console.log("✅ merged removeFromCart:", merged);

      dispatch(setCartItems(merged));
    } catch (error) {
      console.error("❌ removeFromCart Error:", error);
      dispatch(
        setCartError(error?.response?.data?.error || "Failed to remove item")
      );
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// ✅ Clear Cart
export const clearCart = () => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));

      await api.delete("/cart/clear");

      dispatch(clearCartState());
    } catch (error) {
      dispatch(
        setCartError(error?.response?.data?.error || "Failed to clear cart")
      );
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// ✅ BUY ALL ITEMS (Single API call)
export const buyAllCartItemsAsyncold = (paymentType) => {
  return async (dispatch) => {
    try {
      // console.log("paymentType", paymentType);
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));

      const res = await api.post(`/cart/buy-all`, paymentType);

      // console.log("res in the buyAllCartItems", res);

      dispatch(setResults(res.data.results));

      const allSuccess = Object.values(res.data.results).every(
        (r) => r.success === true
      );
      dispatch(setPurchaseSuccess(allSuccess));

      // Update remaining items in cart (failed only)
      dispatch(setRemainingCart(res.data.remainingItems || []));
      return {
        success: true,
        remainingItems: res.data.remainingItems,
        results: res.data.results,
      };
    } catch (error) {
      dispatch(
        setCartError(
          error?.response?.data?.error || "Failed to process purchase"
        )
      );
      return { success: false };
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const buyAllCartItemsAsync = (paymentData) => {
  return async (dispatch) => {
    try {
      // console.log("paymentData sent to backend:", paymentData);

      dispatch(setCartLoading(true));
      dispatch(setCartError(null));

      const res = await api.post(`/cart/buy-all`, paymentData);

      // console.log("res in buyAllCartItems:", res);

      const { order, results, remainingItems, message } = res.data;

      // console.log("order:", order);
      // console.log("results:", results);
      // console.log("remainingItems:", remainingItems);
      // console.log("message:", message);

      // Save results to redux
      if (results) {
        dispatch(setResults(results));
      }

      // Determine success: true only if all items succeeded
      const allSuccess =
        results && Object.values(results).every((r) => r.success === true);

      // console.log("allSuccess:", allSuccess);

      dispatch(setPurchaseSuccess(allSuccess)); // ✅ set true or false

      // Update cart with remaining items
      dispatch(setRemainingCart(remainingItems || []));

      return {
        success: allSuccess, // ✅ FIX HERE
        order,
        results,
        remainingItems,
        message,
      };
    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to process purchase";

      dispatch(setCartError(errMsg));

      return { success: false, error: errMsg };
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};
