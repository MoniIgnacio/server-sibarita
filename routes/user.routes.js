const router = require("express").Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const Reserva = require("../models/Reserva.model");

// GET '/user/:userId' => vista especifica de User
router.get("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  let userRole = req.payload.role;
  try {
    let userIdBd = await User.findById(userId);
    let userIdStr = userIdBd._id.toString();

    if (userRole === "admin" || req.payload._id === userIdStr) {
      const response = await User.findById(userId);
      res.status(201).json(response);
    } else {
      res.status(401).json("Needs a validated user");
    }
  } catch (error) {
    next(error);
  }
});

// DELETE '/user/:userId'=> delete especific user
router.delete("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  let userRole = req.payload.role;
  try {
    let userIdBd = await User.findById(userId);
    let userIdStr = userIdBd._id.toString();

    if (userRole === "admin" || req.payload._id === userIdStr) {
      await User.findByIdAndDelete(userId);
      res.status(200).json("User borrado success");
    } else {
      res.status(401).json("Needs a validated user");
    }
  } catch (error) {
    next(error);
  }
});

// PATCH '/user/:userId' => edit especific user
//!Probar a añadir la edición de la password más adelante
router.patch("/:userId", isAuthenticated, async (req, res, next) => {
  let userRole = req.payload.role;
  const { userId } = req.params;
  const { email, password, password2, username, phoneNumber } = req.body;

  const userUpdate = {
    username,
    phoneNumber,
    email,
  };
  try {
    let userIdBd = await User.findById(userId);
    let userIdStr = userIdBd._id.toString();

    if (userRole === "admin" || req.payload._id === userIdStr) {
      await User.findByIdAndUpdate(userId, userUpdate);
      res.status(201).json("User actualizado success");
    } else {
      res.status(401).json("Needs validated user");
    }
  } catch (error) {
    next(error);
  }
});

// GET '/user/:userId/reserve' => vista especifica de reserva
router.get("/:userId/reserve", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const response = await Reserva.find({ whoReserved: `${userId}` });
    res.status(201).json(response);
  } catch (error) {
    res.status(401).json("Needs a validated user");
    next(error);
  }
});

module.exports = router;
