const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");
const Dish = require("../models/Dish.model");


//GET "/api/dish/:dishId" => visualización de la carta
router.get("/:dishId", async (req, res, next) => {
  const { dishId } = req.params;

  try {
    const response = await Dish.findById(dishId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//Patch "/api/dish/:dishId" => edición de la carta
router.patch("/:dishId", isAuthenticated, async (req, res, next) => {
  let userRole = req.payload.role;
  const { dishId } = req.params;
  const { title, description, price, category } = req.body;
  const dishUpdate = { title, description, price, category };

  try {
    let dishIdDB = await Dish.findById(dishId);
    let dishOwner = dishIdDB.owner.toString();

    if (userRole === "admin" || req.payload._id === dishOwner) {
      await Dish.findByIdAndUpdate(dishId, dishUpdate);
      res.status(201).json("Plato actualizado");
    } else {
      res.status(401).json("Needs validated user");
    }
  } catch (error) {
    next(error);
  }
});

//Delete "/api/dish/:dishId" => borrado de la carta
router.delete("/:dishId", isAuthenticated, async (req, res, next) => {
  const { dishId } = req.params;
  let userRole = req.payload.role;
  try {
    let dishIdDB = await Dish.findById(dishId);
    let dishOwner = dishIdDB.owner.toString();

    if (userRole === "admin" || req.payload._id === dishOwner) {
      await Dish.findByIdAndDelete(dishId);
      res.status(200).json("Plato borrado");
    } else {
      res.status(401).json("Needs validated user");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
