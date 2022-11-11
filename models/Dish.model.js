const { Schema, model } = require("mongoose");

const dishSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["entrante", "principal", "postre"],
    default: "principal",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Dish = model("Dish", dishSchema);

module.exports = Dish;
