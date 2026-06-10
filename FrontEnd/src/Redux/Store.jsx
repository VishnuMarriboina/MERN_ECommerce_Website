import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./slices/CartSlice";
import authReducer from "./slices/AuthSlice";
import orderReducer from "./slices/OrderSlice";
import genericProductReducer from "./slices/GenericProductSlice";
import categorySchemaReducer from "./slices/CategorySchemaSlice";

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
