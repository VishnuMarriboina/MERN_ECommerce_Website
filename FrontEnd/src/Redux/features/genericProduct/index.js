export { default as genericProductReducer, clearGenericError } from "./genericProduct.slice";
export { useGenericProduct } from "./useGenericProduct";
export {
  fetchGenericProducts, regProduct, updateGenericProduct,
  deleteGenericProduct, addGenericVariant, updateGenericVariant, deleteGenericVariant,
} from "./genericProduct.thunk";
