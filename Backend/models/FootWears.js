const mongoose = require("mongoose");

const sandleSchema = new mongoose.Schema(
  {
    type_of_material: {
      type: String,
      required: [true, "Material type is required"],
      enum: {
        values: ["Leather", "Synthetic", "Canvas", "Mesh", "Rubber", "Foam"],
        message:
          "Material must be one of: Leather, Synthetic, Canvas, Mesh, Rubber, Foam",
      },
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    sole_type: {
      type: String,
      required: [true, "Sole type is required"],
      enum: {
        values: ["Rubber", "Foam", "Air", "PU", "TPU"],
        message: "Sole type must be one of: Rubber, Foam, Air, PU, TPU",
      },
    },

    strap_type: {
      type: String,
      required: [true, "Strap type is required"],
      enum: {
        values: ["Leather", "Synthetic", "Canvas", "Mesh", "Rubber", "Foam"],
        message:
          "Strap type must be one of: Leather, Synthetic, Canvas, Mesh, Rubber, Foam",
      },
    },

    category: {
      type: String,
      default: "Sandals", // or required if needed
    },

    variants: [
      {
        size: {
          type: String,
          required: [true, "Shoe size is required"],
          min: [5, "Size must be at least 5"],
          max: [12, "Size cannot exceed 12"],
        },

        sandal_type: {
          type: String,
          required: [true, "Sandal type is required"],
          enum: {
            values: ["Sandals", "Slippers"],
            message: "Sandal type must be one of: Sandals, Slippers",
          },
        },

        cost: {
          type: Number,
          required: [true, "Cost is required"],
          min: [1, "Cost must be at least 1"],
          max: [100000, "Cost cannot exceed 100000"],
        },

        heel_height: {
          type: String,
          required: [true, "Heel height is required"],
          enum: {
            values: ["Low", "Medium", "High"],
            message: "Heel height must be one of: Low, Medium, High",
          },
        },

        count: {
          type: Number,
          required: [true, "Count is required"],
          min: [1, "Count must be at least 1"],
          max: [100000, "Count cannot exceed 100000"],
        },
        image_url: {
          type: String,
          default: "No image found",
          match: [
            /^https?:\/\/.+|^No image found$/,
            "Image URL must be a valid URL or say 'No image found'",
          ],
        },
      },
    ],

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const shoesSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    type_of_material: {
      type: String,
      required: [true, "Material type is required"],
      enum: {
        values: ["Leather", "Synthetic", "Canvas", "Mesh", "Rubber", "Foam"],
        message:
          "Material must be one of: Leather, Synthetic, Canvas, Mesh, Rubber, Foam",
      },
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    sole_type: {
      type: String,
      required: [true, "Sole type is required"],
      enum: {
        values: ["Rubber", "Foam", "Air", "PU", "TPU"],
        message: "Sole type must be one of: Rubber, Foam, Air, PU, TPU",
      },
    },

    category: {
      type: String,
      default: "Shoes", // or required if needed
    },

    variants: [
      {
        size: {
          type: String,
          required: [true, "Shoe size is required"],

          min: [5, "Size must be at least 5"],
          max: [12, "Size cannot exceed 12"],
        },
        cost: {
          type: Number,
          required: [true, "Cost is required"],
          min: [1, "Cost must be at least 1"],
          max: [100000, "Cost cannot exceed 100000"],
        },
        count: {
          type: Number,
          required: [true, "Count is required"],
          min: [1, "Count must be at least 1"],
          max: [100000, "Count cannot exceed 100000"],
        },

        lacing_type: {
          type: String,
          required: [true, "Lacing type is required"],
          enum: {
            values: ["Lace-Up", "Slip-On", "Velcro"],
            message: "Lacing type must be one of: Lace-Up, Slip-On, Velcro",
          },
        },

        shoe_type: {
          type: String,
          required: [true, "Shoe type is required"],
          enum: {
            values: ["Sneaker", "Running Shoes", "Canvas Shoes"],
            message:
              "Shoe type must be one of: Sneaker, Running Shoes, Canvas Shoes",
          },
        },

        image_url: {
          type: String,
          default: "No image found",
          match: [
            /^https?:\/\/.+|^No image found$/,
            "Image URL must be a valid URL or say 'No image found'",
          ],
        },
      },
    ],

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Sandles = mongoose.model("Sandles", sandleSchema, "sandals");
const Shoes = mongoose.model("Shoes", shoesSchema, "shoes");
// module.exports = mongoose.model('Shoes', shoesSchema);  // an direct way
module.exports = { Sandles, Shoes };
