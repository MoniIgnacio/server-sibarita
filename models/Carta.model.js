const { Schema, model } = require("mongoose");

const cartaSchema = new Schema({
  sectionTitle: {
    type: String,
    required: true,
    trim: true,
  },
  dish: [
    {
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
    },
  ],
});

const Carta = model("Carta", cartaSchema);

module.exports = Carta;
