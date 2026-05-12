// Redux/Store.jsx
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage for web
import beltReducer from "./slices/BeltSlice";
import watchReducer from "./slices/WatchSlice";
import sandalReducer from "./slices/SandalSlice";
import tshirtReducer from "./slices/TshirtSlice";
import shirtReducer from "./slices/ShirtSlice";
import shoeReducer from "./slices/ShoeSlice";
import cartReducer from "./slices/CartSlice";
import authReducer from "./slices/AuthSlice";
import orderReducer from "./slices/OrderSlice";
// ✅ Combine all slices
const rootReducer = combineReducers({
  belt: beltReducer,
  watch: watchReducer,
  sandal: sandalReducer,
  tshirt: tshirtReducer,
  shirt: shirtReducer,
  shoe: shoeReducer,
  cart: cartReducer,
  auth: authReducer,
  order: orderReducer,
});

// ✅ Redux Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"], // Persist only the cart and auth slice
};

// ✅ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist needs this off
    }),
});

// ✅ Create persistor
export const persistor = persistStore(store);
