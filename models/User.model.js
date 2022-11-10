const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    password2: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["client", "owner", "admin"],
      default: "client",
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    restaurant: [
      {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
    reserva: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reserva",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
