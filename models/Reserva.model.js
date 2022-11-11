const { Schema, model } = require("mongoose");

const reservaSchema = new Schema({
  fecha: {
    required: true,
    type: Date,
  },
  hour: {
    required: true,
    type: Date,
  },
  pax: {
    required: true,
    type: Number,
    trim: true,
  },
  hasConsumed: {
    type: Boolean,
    deafult: false,
  },
  restaurant: [
    {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  ],
  whoReserved: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Reserva = model("Reserva", reservaSchema);

module.exports = Reserva;
