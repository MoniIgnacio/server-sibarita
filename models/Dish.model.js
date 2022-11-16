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
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
  },
});

const Dish = model("Dish", dishSchema);

module.exports = Dish;
