const mongoose = require("mongoose");

const beltsSchema = new mongoose.Schema(
  {
    type_of_material: {
      type: String,
      required: [true, "Material type is required"],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    width: {
      type: String,
      required: [true, "Width is required"],
      match: [
        /^\d+(\.\d+)?\s?(inches|cm)?$/,
        "Width must be a valid measurement (e.g., '1.25 inches')",
      ],
    },
    buckle_type: {
      type: String,
      required: [true, "Buckle type is required"],
      enum: {
        values: ["Brass", "Steel", "Alloy", "Plastic", "Zinc"],
        message:
          "Buckle type must be one of: Brass, Steel, Alloy, Plastic, Zinc",
      },
    },

    category: {
      type: String,
      default: "Belts", // or required if needed
    },

    variants: [
      {
        size: {
          type: String,
          required: [true, "Size is required"],
          enum: ["26", "28", "30", "32", "34", "36"],
        },
        cost: {
          type: Number,
          required: [true, "Cost is required"],
          min: [0, "Cost cannot be negative"],
        },

        color: {
          type: String,
          required: [true, "Color is required"],
          trim: true,
        },

        image_url: {
          type: String,
          default: "No image found",
          match: [
            /^https?:\/\/.+|^No image found$/,
            "Image URL must be a valid URL or say 'No image found'",
          ],
        },
        count: {
          type: Number,
          required: [true, "Count is required"],
          min: [0, "Count cannot be negative"],
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

const watchesSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    watch_type: {
      type: String,
      required: [true, "Watch type is required"],
      enum: {
        values: ["Analog", "Digital", "Smart"],
        message: "Watch type must be Analog, Digital, or Smart",
      },
    },

    movement: {
      type: String,
      required: [true, "Movement type is required"],
      enum: {
        values: ["Quartz", "Automatic", "Mechanical", "Solar"],
        message: "Movement must be Quartz, Automatic, Mechanical, or Solar",
      },
    },
    water_resistance: {
      type: String,
      required: [true, "Water resistance info is required"],
      match: [
        /^\d+m$/,
        "Water resistance must be a number followed by 'm' (e.g., 50m)",
      ],
    },

    category: {
      type: String,
      default: "Watches", // or required if needed
    },

    variants: [
      {
        image_url: {
          type: String,
          default: "No image found",
          match: [
            /^https?:\/\/.+|^No image found$/,
            "Image URL must be a valid URL or say 'No image found'",
          ],
        },

        strap_material: {
          type: String,
          required: [true, "Strap material is required"],
          enum: {
            values: [
              "Leather",
              "Metal",
              "Rubber",
              "Silicone",
              "Nylon",
              "Plastic",
            ],
            message: "Strap material must be a valid type",
          },
        },

        cost: {
          type: Number,
          required: [true, "Cost is required"],
          min: [0, "Cost cannot be negative"],
        },
        count: {
          type: Number,
          required: [true, "Count is required"],
          min: [0, "Count cannot be negative"],
        },

        size: {
          type: String,
          required: [true, "Size is required"],
          trim: true, // e.g., "42mm"

          enum: ["42mm", "40mm", "44mm", "38mm", "46mm"],
        },

        dial_color: {
          type: String,
          required: [true, "Color is required"],
          trim: true,
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

const Watches = mongoose.model("Watches", watchesSchema, "watches");
const Belts = mongoose.model("Belts", beltsSchema, "belts");

module.exports = { Belts, Watches };
