const mongoose = require("mongoose");

const fieldDef = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    label:       { type: String, required: true, trim: true },
    type:        { type: String, enum: ["text", "number", "select", "textarea"], default: "text" },
    required:    { type: Boolean, default: false },
    options:     { type: [String], default: [] },
    placeholder: { type: String, default: "" },
  },
  { _id: false }
);

const categorySchemaDoc = new mongoose.Schema(
  {
    categoryName:  { type: String, required: [true, "Category name is required"], trim: true },
    fields:        { type: [fieldDef], default: [] },
    variantFields: { type: [fieldDef], default: [] },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Case-insensitive uniqueness on categoryName
categorySchemaDoc.index(
  { categoryName: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const CategorySchemaModel = mongoose.model(
  "CategorySchema",
  categorySchemaDoc,
  "category-schemas"
);

module.exports = { CategorySchemaModel };
