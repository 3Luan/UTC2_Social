const mongoose = require("mongoose");

const documentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const documentCategoryModel = mongoose.model(
  "documentCategories",
  documentCategorySchema
);

module.exports = documentCategoryModel;
