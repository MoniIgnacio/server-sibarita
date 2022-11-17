const router = require("express").Router();
const Reserva = require("../models/Reserva.model");
const Restaurant = require("../models/Restaurant.model");
const Comment = require("../models/Comment.model")
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const cloudinary = require("../middlewares/cloudinary.js");

// GET '/reserva/' => vista all reserva
router.get("/", async (req, res, next) => {
  try {
    const response = await Reserva.find().populate("whoReserved");
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});



// DELETE '/reserva/:reservaId'=> delete especific reserva
router.delete("/:reservaId", isAuthenticated, async (req, res, next) => {
  const { reservaId } = req.params;
  let userRole = req.payload.role;
  try {
    let reservaIdBd = await Reserva.findById(reservaId);
    let reservaIdStr = reservaIdBd.whoReserved.toString();

    if (userRole === "admin" || req.payload._id === reservaIdStr) {
      await Reserva.findByIdAndDelete(reservaId);
      res.status(200).json("Reserva borrada success");
    } else {
      res.status(401).json("Needs a validated user");
    }
  } catch (error) {
    next(error);
  }
});

// PATCH '/reserva/:reservaId' => edit especific reserva
router.patch("/:reservaId", isAuthenticated, async (req, res, next) => {
  let userRole = req.payload.role;
  const { reservaId } = req.params;
  const { fecha, hour, pax, hasConsumed } = req.body;

  const clientUpdate = {
    fecha,
    hour,
    pax,
  };

  const ownerUpdate = {
    hasConsumed,
  };

  try {
    let reservaIdBd = await Reserva.findById(reservaId);
    let ownerRestId = await Restaurant.findById(reservaIdBd.restaurant);
    let ownerRealId = ownerRestId.owner.toString();
    let reservaIdStr = reservaIdBd.whoReserved.toString();

    if (userRole === "admin" || req.payload._id === reservaIdStr) {
      await Reserva.findByIdAndUpdate(reservaId, clientUpdate);
      res.status(201).json("Reserva actualizada success");
    } else if (userRole === "admin" || req.payload._id === ownerRealId) {
      await Reserva.findByIdAndUpdate(reservaId, ownerUpdate);
    } else {
      res.status(401).json("Needs validated user");
    }
  } catch (error) {
    next(error);
  }
});

// POST '/api/reserva/:reservaId/comment' => create a new comment
router.post(
  "/:reservaId/comment",
  isAuthenticated,
  cloudinary.single("comment-img"),
  async (req, res, next) => {
    const { reservaId } = req.params;
    const { comment, serviceScore, foodScore, ambientScore } =
      req.body;

    let userRole = req.payload.role;
   
    try {
      let reservaIdBd = await Reserva.findById(reservaId);
      let restaurantId = reservaIdBd.restaurant.toString();
      const newComment = {
        comment,
        photo: req.file?.path,
        serviceScore,
        foodScore,
        ambientScore,
        user: req.payload._id,
        restaurant: restaurantId,
      };
      if (userRole === "owner" || userRole === "admin" || reservaIdBd.hasConsumed === true) {
        await Comment.create(newComment);
        res.status(201).json("Comment create success");
      } else {
        res.status(401).json("validar usuario");
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
