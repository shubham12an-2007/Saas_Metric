const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Entertainment",
        "Infrastructure",
        "Productivity",
        "Finance",
        "Other",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Paused", "Expired"],
      default: "Active",
    },

    nextBilling: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
