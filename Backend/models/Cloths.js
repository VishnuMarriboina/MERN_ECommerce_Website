const mongoose = require("mongoose");

const shirtsSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },

    type_of_material: {
      type: String,
      required: [true, "Material type is required"],
      trim: true,
    },

    collar_type: {
      type: String,
      required: true,
      enum: ["Spread", "Point", "Button-Down", "Mandarin"],
    },

    sleeve_type: {
      type: String,
      required: true,
      enum: ["Short Sleeve", "Long Sleeve", "Sleeveless"],
    },

    category: {
      type: String,
      default: "Shirts",
    },

    // ⭐ NEW → Store all variant combinations here
    variants: [
      {
        size: {
          type: String,
          required: true,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        color: {
          type: String,
          required: true,
        },
        fit: {
          type: String,
          required: true,
          enum: ["Regular", "Slim", "Loose"],
        },
        cost: {
          type: Number,
          required: true,
          min: 0,
        },
        count: {
          type: Number,
          required: true,
          min: 0,
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

const tshirtsSchema = new mongoose.Schema(
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
    neck_type: {
      type: String,
      required: [true, "Neck type is required"],
      enum: {
        values: ["Round Neck", "V-Neck", "Polo Neck", "Crew Neck"],
        message:
          "Neck type must be Round Neck, V-Neck, Polo Neck, or Crew Neck",
      },
    },
    sleeve_type: {
      type: String,
      required: [true, "Sleeve type is required"],
      enum: {
        values: ["Short Sleeve", "Long Sleeve", "Sleeveless"],
        message: "Sleeve type must be Short Sleeve, Long Sleeve, or Sleeveless",
      },
    },

    design: {
      type: String,
      required: [true, "Design is required"],
      enum: {
        values: ["Plain", "Printed", "Striped", "Graphic"],
        message: "Design must be Plain, Printed, Striped, or Graphic",
      },
    },
    category: {
      type: String,
      default: "Tshirts", // or required if needed
    },
    variants: [
      {
        size: {
          type: String,
          required: true,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        color: {
          type: String,
          required: true,
        },
        fit: {
          type: String,
          required: true,
          enum: ["Regular", "Slim", "Loose"],
        },
        cost: {
          type: Number,
          required: true,
          min: 0,
        },
        count: {
          type: Number,
          required: true,
          min: 0,
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
  { timestamps: true }
);

const Shirts = mongoose.model("Shirts", shirtsSchema, "shirts");
const Tshirts = mongoose.model("Tshirts", tshirtsSchema, "t-shirts");

module.exports = { Shirts, Tshirts };

// doc concepts
// mongoose.model(<ModelName>, <Schema>, <CollectionName>);   // to create an model
