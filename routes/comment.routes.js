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

// POST '/api/comment/create' => create a new comment
router.post("/create", isAuthenticated, cloudinary.single("comment-img"), async (req, res, next) => {
  const {
    comment,
    serviceScore,
    foodScore,
    ambientScore,
    restaurant,
  } = req.body;

  let userRole = req.payload.role;
  const newComment = {
    comment,
    photo: req.file?.path,
    serviceScore,
    foodScore,
    ambientScore,
    user: req.payload._id,
    // restaurant: ???,
  };
//   try {
//     if (userRole === "owner" || userRole === "admin" && ha reservado en el resta!) {
//       await Comment.create(newComment);
//       res.status(201).json("Comment create success");
//     } else {
//       res.status(401).json("validar usuario");
//     }
//   } catch (error) {
//     next(error);
//   }
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
    let commentIdStr = commentIdBd._id.toString();

    if (userRole === "admin" || req.payload._id === commentIdStr) {
      await User.findByIdAndDelete(userId);
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
    user,
    restaurant,
  } = req.body;

  const commentUpdate = {
    comment,
    photo,
    foodScore,
    ambientScore,
  };
  try {
    let commentIdBd = await Comment.findById(commentId);
    let commentIdStr = commentIdBd._id.toString();

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
