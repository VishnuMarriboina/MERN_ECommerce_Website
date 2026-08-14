import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartReducer } from "./features/cart";
import { authReducer } from "./features/auth";
import { orderReducer } from "./features/order";
import { genericProductReducer } from "./features/genericProduct";
import { categorySchemaReducer } from "./features/categorySchema";

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  order: orderReducer,
  genericProduct: genericProductReducer,
  categorySchema: categorySchemaReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
