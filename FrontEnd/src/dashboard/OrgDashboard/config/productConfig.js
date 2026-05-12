// Product configuration with Redux actions and schema fields
// ------------------------ SHIRTS ------------------------
import {
  fetchShirt,
  addShirt,
  updateShirt,
  deleteShirt,
  addVariant as addShirtVariant,
  updateVariant as updateShirtVariant,
  deleteVariant as deleteShirtVariant,
} from "../../../Redux/slices/ShirtSlice";

// ------------------------ TSHIRTS ------------------------
import {
  fetchTshirt,
  addTshirt,
  updateTshirt,
  deleteTshirt,
  addVariant as addTshirtVariant,
  updateVariant as updateTshirtVariant,
  deleteVariant as deleteTshirtVariant,
} from "../../../Redux/slices/TshirtSlice";

// ------------------------ SHOES ------------------------
import {
  fetchShoe,
  addShoe,
  updateShoe,
  deleteShoe,
  addVariant as addShoeVariant,
  updateVariant as updateShoeVariant,
  deleteVariant as deleteShoeVariant,
} from "../../../Redux/slices/ShoeSlice";

// ------------------------ SANDALS ------------------------
import {
  fetchSandal,
  addSandal,
  updateSandal,
  deleteSandal,
  addVariant as addSandalVariant,
  updateVariant as updateSandalVariant,
  deleteVariant as deleteSandalVariant,
} from "../../../Redux/slices/SandalSlice";

// ------------------------ BELTS ------------------------
import {
  fetchBelt,
  addBelt,
  updateBelt,
  deleteBelt,
  addVariant as addBeltVariant,
  updateVariant as updateBeltVariant,
  deleteVariant as deleteBeltVariant,
} from "../../../Redux/slices/BeltSlice";

// ------------------------ WATCHES ------------------------
import {
  fetchWatch,
  addWatch,
  updateWatch,
  deleteWatch,
  addVariant as addWatchVariant,
  updateVariant as updateWatchVariant,
  deleteVariant as deleteWatchVariant,
} from "../../../Redux/slices/WatchSlice";

export const productConfig = {
  // ======================= SHIRTS =======================

  Shirts: {
    reduxKey: "shirt",
    fetchAction: fetchShirt,
    addProductAction: addShirt,
    updateProductAction: updateShirt,
    deleteProductAction: deleteShirt,
    addVariantAction: addShirtVariant,
    updateVariantAction: updateShirtVariant,
    deleteVariantAction: deleteShirtVariant,

    dataExtractor: (data) => {
      let extracted = [];
      if (Array.isArray(data)) extracted = data;
      if (Array.isArray(data?.data)) extracted = data.data;
      if (Array.isArray(data?.data?.data)) extracted = data.data.data;
      if (data?.shirts) extracted = data.shirts;
      if (data?.items) extracted = data.items;

      const result = [...(extracted || [])];
      result.loading = data?.loading ?? false;
      result.error = data?.error ?? null;
      result.message = data?.data?.message ?? "";

      return result;
    },

    fields: [
      {
        name: "brand",
        label: "Brand",
        type: "text",
        required: true,
      },
      {
        name: "type_of_material",
        label: "Material",
        type: "text",
        required: true,
      },
      {
        name: "collar_type",
        label: "Collar Type",
        type: "select",
        options: ["Spread", "Point", "Button-Down", "Mandarin"],
        required: true,
      },
      {
        name: "sleeve_type",
        label: "Sleeve Type",
        type: "select",
        required: true,

        options: ["Short Sleeve", "Long Sleeve", "Sleeveless"],
      },
    ],

    variantFields: [
      {
        name: "size",
        label: "Size",
        type: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      {
        name: "fit",
        label: "Fit",
        type: "select",
        options: ["Regular", "Slim", "Loose"],
      },
      { name: "color", label: "Color", type: "text", editable: true },
      { name: "cost", label: "Cost", type: "number", editable: true },
      { name: "count", label: "Count", type: "number", editable: true },
      { name: "image_url", label: "Image URL", type: "text", editable: true },
    ],
  },

  // ====================== T-SHIRTS ======================

  "T-Shirts": {
    reduxKey: "tshirt",
    fetchAction: fetchTshirt,
    addProductAction: addTshirt,
    updateProductAction: updateTshirt,
    deleteProductAction: deleteTshirt,

    addVariantAction: addTshirtVariant,
    updateVariantAction: updateTshirtVariant,
    deleteVariantAction: deleteTshirtVariant,

    dataExtractor: (data) => {
      console.log("data in tshirts", data);

      let extracted = [];
      if (Array.isArray(data)) extracted = data;
      if (Array.isArray(data?.data)) extracted = data.data;
      if (Array.isArray(data?.data?.data)) extracted = data.data.data;
      if (data?.tshirts) extracted = data.tshirts;
      if (data?.items) extracted = data.items;

      const result = [...(extracted || [])];
      result.loading = data?.loading ?? false;
      result.error = data?.error ?? null;
      result.message = data?.data?.message ?? "";

      return result;
    },

    fields: [
      {
        name: "brand",
        label: "Brand",
        type: "text",
        required: true,
      },
      {
        name: "type_of_material",
        label: "Material",
        type: "text",
        required: true,
      },
      {
        name: "neck_type",
        label: "Neck Type",
        type: "select",
        options: ["Round Neck", "V-Neck", "Polo Neck", "Crew Neck"],
        required: true,
      },
      {
        name: "sleeve_type",
        label: "Sleeve Type",
        type: "select",
        options: ["Short Sleeve", "Long Sleeve", "Sleeveless"],
        required: true,
      },
      {
        name: "design",
        label: "Design",
        type: "select",
        required: true,
        options: ["Plain", "Printed", "Striped", "Graphic"],
      },
    ],

    variantFields: [
      {
        name: "size",
        label: "Size",
        type: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      {
        name: "fit",
        label: "Fit",
        type: "select",
        options: ["Regular", "Slim", "Loose"],
      },
      { name: "color", label: "Color", type: "text", editable: true },
      { name: "cost", label: "Cost", type: "number", editable: true },
      { name: "count", label: "Count", type: "number", editable: true },
      { name: "image_url", label: "Image URL", type: "text", editable: true },
    ],
  },

  // ======================= SANDALS ======================

  Sandals: {
    reduxKey: "sandal",
    fetchAction: fetchSandal,
    addProductAction: addSandal,
    updateProductAction: updateSandal,
    deleteProductAction: deleteSandal,
    addVariantAction: addSandalVariant,
    updateVariantAction: updateSandalVariant,
    deleteVariantAction: deleteSandalVariant,

    dataExtractor: (data) => {
      let extracted = [];
      if (Array.isArray(data)) extracted = data;
      if (Array.isArray(data?.data)) extracted = data.data;
      if (Array.isArray(data?.data?.data)) extracted = data.data.data;
      if (data?.sandals) extracted = data.sandals;
      if (data?.items) extracted = data.items;

      const result = [...(extracted || [])];

      result.loading = data?.loading ?? false;
      result.error = data?.error ?? null;
      result.message = data?.data?.message ?? "";

      return result;
    },

    fields: [
      { name: "brand", label: "Brand", type: "text", editable: true },
      {
        name: "type_of_material",
        label: "Material",
        type: "select",
        options: ["Leather", "Synthetic", "Canvas", "Mesh", "Rubber", "Foam"],
      },
      {
        name: "sole_type",
        label: "Sole Type",
        type: "select",
        options: ["Rubber", "Foam", "Air", "PU", "TPU"],
      },
      {
        name: "strap_type",
        label: "Strap Type",
        type: "select",
        options: ["Leather", "Synthetic", "Canvas", "Mesh", "Rubber"],
      },
      { name: "color", label: "Color", type: "text" },
    ],

    variantFields: [
      {
        name: "size",
        label: "Size",
        type: "select",
        options: ["6", "7", "8", "9", "10", "11", "12"],
        editable: true,
      },
      {
        name: "sandal_type",
        label: "Sandal Type",
        type: "select",
        options: ["Sandals", "Slippers"],
      },

      {
        name: "heel_height",
        label: "Heel Height",
        type: "select",
        options: ["Low", "Medium", "High"],
      },
      { name: "cost", label: "Cost", type: "number", editable: true },
      { name: "count", label: "Count", type: "number", editable: true },
      { name: "image_url", label: "Image URL", type: "text", editable: true },
    ],
  },

  // ======================== SHOES ========================

  Shoes: {
    reduxKey: "shoe",
    fetchAction: fetchShoe,
    addProductAction: addShoe,
    updateProductAction: updateShoe,
    deleteProductAction: deleteShoe,
    addVariantAction: addShoeVariant,
    updateVariantAction: updateShoeVariant,
    deleteVariantAction: deleteShoeVariant,
    dataExtractor: (data) => {
      let extracted = [];
      if (Array.isArray(data)) extracted = data;
      if (Array.isArray(data?.data)) extracted = data.data;
      if (Array.isArray(data?.data?.data)) extracted = data.data.data;
      if (data?.shoe) extracted = data.shoe;
      if (data?.items) extracted = data.items;

      const result = [...(extracted || [])];

      result.loading = data?.loading ?? false;
      result.error = data?.error ?? null;
      result.message = data?.data?.message ?? "";

      return result;
    },

    fields: [
      { name: "brand", label: "Brand", type: "text" },
      {
        name: "type_of_material",
        label: "Material",
        type: "select",
        options: ["Leather", "Synthetic", "Canvas", "Mesh", "Rubber", "Foam"],
      },
      {
        name: "sole_type",
        label: "Sole Type",
        type: "select",
        options: ["Rubber", "Foam", "Air", "PU", "TPU"],
      },
      { name: "color", label: "Color", type: "text" },
    ],

    variantFields: [
      {
        name: "size",
        label: "Size",
        type: "select",
        options: ["6", "7", "8", "9", "10", "11", "12"],
        editable: true,
      },
      {
        name: "lacing_type",
        label: "Lacing Type",
        type: "select",
        options: ["Lace-Up", "Slip-On", "Velcro"],
      },

      {
        name: "shoe_type",
        label: "Shoe Type",
        type: "select",
        options: ["Sneaker", "Running Shoes", "Canvas Shoes"],
      },
      { name: "cost", label: "Cost", type: "number", editable: true },
      { name: "count", label: "Count", type: "number", editable: true },
      { name: "image_url", label: "Image URL", type: "text", editable: true },
    ],
  },

  // ========================= BELTS =======================

  Belts: {
    reduxKey: "belt",
    fetchAction: fetchBelt,
    addProductAction: addBelt,
    updateProductAction: updateBelt,
    deleteProductAction: deleteBelt,
    addVariantAction: addBeltVariant,
    updateVariantAction: updateBeltVariant,
    deleteVariantAction: deleteBeltVariant,

    dataExtractor: (data) => {
      let extracted = [];
      if (Array.isArray(data)) extracted = data;
      if (Array.isArray(data?.data)) extracted = data.data;
      if (Array.isArray(data?.data?.data)) extracted = data.data.data;
      if (data?.belts) extracted = data.belts;
      if (data?.items) extracted = data.items;

      const result = [...(extracted || [])];
      result.loading = data?.loading ?? false;
      result.error = data?.error ?? null;
      result.message = data?.data?.message ?? "";

      return result;
    },

    fields: [
      { name: "brand", label: "Brand", type: "text" },
      {
        name: "type_of_material",
        label: "Material",
        type: "text",
      },

      { name: "width", label: "Width", type: "text" },
      {
        name: "buckle_type",
        label: "Buckle Type",
        type: "select",
        options: ["Brass", "Steel", "Alloy", "Plastic", "Zinc"],
      },
    ],

    variantFields: [
      {
        name: "size",
        label: "Size",
        type: "select",
        options: ["26", "28", "30", "32", "34", "36"],
      },
      { name: "color", label: "Color", type: "text", editable: true },
      { name: "cost", label: "Cost", type: "number", editable: true },
      { name: "count", label: "Count", type: "number", editable: true },
      { name: "image_url", label: "Image URL", type: "text", editable: true },
    ],
  },

  // ======================== WATCHES ======================

  Watches: {
    reduxKey: "watch",
    fetchAction: fetchWatch,
    addProductAction: addWatch,
    updateProductAction: updateWatch,
    deleteProductAction: deleteWatch,
    addVariantAction: addWatchVariant,
    updateVariantAction: updateWatchVariant,
    deleteVariantAction: deleteWatchVariant,

    dataExtractor: (data) => {
      let extracted = [];
      console.log("data", data);

      if (Array.isArray(data)) extracted = data;
      if (Array.isArray(data?.data)) extracted = data.data;
      if (Array.isArray(data?.data?.data)) extracted = data.data.data;
      if (data?.watch) extracted = data.watch;
      if (data?.items) extracted = data.items;

      const result = [...(extracted || [])];

      result.loading = data?.loading ?? false;
      result.error = data?.error ?? null;
      result.message = data?.data?.message ?? "";

      return result;
    },

    fields: [
      { name: "brand", label: "Brand", type: "text" },
      {
        name: "watch_type",
        label: "Watch Type",
        type: "select",
        options: ["Analog", "Digital", "Smart"],
      },

      {
        name: "movement",
        label: "Movement",
        type: "select",
        options: ["Quartz", "Automatic", "Mechanical", "Solar"],
      },
      {
        name: "water_resistance",
        label: "Water Resistance",
        type: "text",
        placeholder: "Enter water resistance in meters like 50m",
      },
    ],

    variantFields: [
      {
        name: "size",
        label: "Size",
        type: "select",
        options: ["42mm", "40mm", "44mm", "38mm", "46mm"],
      },
      {
        name: "strap_material",
        label: "Strap Material",
        type: "select",
        options: ["Leather", "Metal", "Rubber", "Silicone", "Nylon", "Plastic"],
      },
      { name: "dial_color", label: "Dial Color", type: "text", editable: true },
      { name: "cost", label: "Cost", type: "number", editable: true },
      { name: "count", label: "Count", type: "number", editable: true },
      { name: "image_url", label: "Image URL", type: "text", editable: true },
    ],
  },
};

export const categories = Object.keys(productConfig);
