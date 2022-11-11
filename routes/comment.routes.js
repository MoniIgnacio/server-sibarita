const router = require("express").Router();
const Comment = require("../models/Comment.model");
const {isAuthenticated} = require("../middlewares/auth.middlewares");
const cloudinary = require("../middlewares/cloudinary.js");


// GET '/comment/' => vista all comment
router.get("/", async (req, res, next) => {
  try {
    const response = await Comment.find();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});



// GET '/comment/:commentId' => vista especifica de Comment
router.get("/:commentId", async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const response = await Comment.findById(commentId);
    res.status(201).json(response);
  } catch (error) {
    res.status(401).json("Needs a validated user");
    next(error);
  }
});

// DELETE '/comment/:commentId'=> delete especific comment
router.delete("/:commentId", isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  let userRole = req.payload.role;
  try {
    let commentIdBd = await Comment.findById(commentId);
    let commentIdStr = commentIdBd.user.toString();

    if (userRole === "admin" || req.payload._id === commentIdStr) {
      await Comment.findByIdAndDelete(commentId);
      res.status(200).json("Comment borrado success");
    } else {
      res.status(401).json("Needs a validated user");
    }
  } catch (error) {
    next(error);
  }
});

// PATCH '/comment/:commentId' => edit especific comment
router.patch("/:commentId", isAuthenticated, async (req, res, next) => {
  let userRole = req.payload.role;
  const { commentId } = req.params;
  const {
    comment,
    photo,
    serviceScore,
    foodScore,
    ambientScore,
  } = req.body;

  const commentUpdate = {
    comment,
    photo,
    foodScore,
    ambientScore,
    serviceScore
  };
  try {
    let commentIdBd = await Comment.findById(commentId);
    let commentIdStr = commentIdBd.user.toString();

    if (userRole === "admin" || req.payload._id === commentIdStr) {
      await Comment.findByIdAndUpdate(commentId, commentUpdate);
      res.status(201).json("Comment actualizado success");
    } else {
      res.status(401).json("Needs validated user");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
