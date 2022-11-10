const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  photo: String,
  serviceScore: {
    type: Number,
    required: true,
  },
  foodScore: {
    type: Number,
    required: true,
  },
  ambientScore: {
    type: Number,
    required: true,
  },
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  restaurant: [
    {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  ],
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
