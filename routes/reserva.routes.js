const router = require("express").Router();
const Reserva = require("../models/Reserva.model");
const isAuthenticated = require("../middlewares/auth.middlewares");


// GET '/reserva/' => vista all reserva
router.get("/", async (req, res, next) => {
  try {
    const response = await Reserva.find();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET '/reserva/:reservaId' => vista especifica de reserva
router.get("/:reservaId", isAuthenticated, async (req, res, next) => {
  const { reservaId } = req.params;
  try {
    const response = await Reserva.findById(reservaId);
    res.status(201).json(response);
  } catch (error) {
    res.status(401).json("Needs a validated user");
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
  const {
    fecha,
    hour,
    pax,
  } = req.body;

  const reservaUpdate = {
    fecha,
    hour,
    pax,
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
