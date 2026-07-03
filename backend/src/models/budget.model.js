const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "default_user",
    },
    monthlyLimit: {
      type: Number,
      required: true,
      default: 100,
    },
  },
  { timestamps: true },
);

const budgetModel = mongoose.model("Budget", budgetSchema);

module.exports = budgetModel;
