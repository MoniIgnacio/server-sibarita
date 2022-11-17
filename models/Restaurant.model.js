const { Schema, model } = require("mongoose");

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
    enum: [
      "Italiana",
      "Española",
      "Japonesa",
      "China",
      "Americana",
      "Tailandesa",
      "Fusión",
      "Griega",
      "Marroquí",
      "Turca",
      "India",
      "Parrilla",
      "Vegetariana",
      "Vegana",
      "Pesquetariana",
      "Asiática",
      "Mexicana",
      "Argentina"

    ],
    default: "Argentina",
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Restaurant = model("Restaurant", restaurantSchema);

module.exports = Restaurant;
