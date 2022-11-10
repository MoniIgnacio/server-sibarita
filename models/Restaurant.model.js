const { Schema, model, default: mongoose } = require("mongoose");

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  photos: [String],
  cuisinType: {
    type: String,
    required: true,
    enum: ["italian", "spanish", "japanese", "chinese"],
    default: "spanish",
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  carta: [
    {
      type: Schema.Types.ObjectId,
      ref: "Carta",
    },
  ],
});

const Restaurant = model("Restaurant", restaurantSchema);

module.exports = Restaurant;
