const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["CREATED", "UPDATED", "DELETED"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;
