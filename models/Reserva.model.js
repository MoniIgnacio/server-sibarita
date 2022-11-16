const { Schema, model } = require("mongoose");

const reservaSchema = new Schema({
  fecha: {
    required: true,
    type: Date,
  },
  hour: {
    required: true,
    type: String,
  },
  pax: {
    required: true,
    type: Number,
    trim: true,
  },
  hasConsumed: {
    type: Boolean,
    default: false,
  },
  restaurant: 
    {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  whoReserved: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});

const Reserva = model("Reserva", reservaSchema);

module.exports = Reserva;
