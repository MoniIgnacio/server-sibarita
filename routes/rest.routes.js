const router = require("express").Router();
const Restaurant = require("../models/Restaurant.model");
const Reserva = require("../models/Reserva.model");
const Dish = require("../models/Dish.model");
const cloudinary = require("../middlewares/cloudinary.js");

const {isAuthenticated} = require("../middlewares/auth.middlewares");

//! Acordarse para revisar los path del cloudinary
// POST '/api/restaurant/create' => crear nuevo restaurante
router.post(
  "/create",
  isAuthenticated,
  cloudinary.single("restaurant-img"),
  async (req, res, next) => {
    const { name, location, cuisinType, phoneNumber } = req.body;
    let userRole = req.payload.role;
    let userOnlineId = req.payload._id;
    const restaurantCreate = {
      name,
      location,
      cuisinType,
      phoneNumber,
      photos: req.file?.path,
      owner: userOnlineId,
    };

    try {
      if (userRole === "owner" || userRole === "admin") {
        await Restaurant.create(restaurantCreate);
        res.status(201).json("Restaurant Create success");
      } else {
        res.status(401).json("validar usuario");
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET '/restaurant' => get info from the restaurants
router.get("/", async (req, res, next) => {
  try {
    const response = await Restaurant.find().select("name");
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET '/restaurant/:restId' => vista especifica de restaurante
router.get("/:restId", async (req, res, next) => {
  const { restId } = req.params;
  //   console.log(restId)
  try {
    const response = await Restaurant.findById(restId);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE '/restaurant/:restId'=> delete especific de restaurante
router.delete("/:restId", isAuthenticated, async (req, res, next) => {
  const { restId } = req.params;
  let userRole = req.payload.role;
  try {
    let restaurantID = await Restaurant.findById(restId);

    let restaurantIdOwner = restaurantID.owner.toString();
    if (userRole === "admin" || req.payload._id === restaurantIdOwner) {
      await Restaurant.findByIdAndDelete(restId);
      res.status(200).json("Restaurante borrado");
    } else {
      res.status(401).json("Needs a validated user");
    }
  } catch (error) {
    next(error);
  }
});

// PATCH '/restaurant/:restId' => edit especific de restaurante
router.patch(
  "/:restId",
  isAuthenticated,
  cloudinary.single("restaurant-img"),
  async (req, res, next) => {
    let userRole = req.payload.role;
    const { restId } = req.params;
    const { name, location, cuisinType, phoneNumber } = req.body;
    const restUpdate = {
      name,
      location,
      cuisinType,
      phoneNumber,
      photos: req.file?.path,
    };
    try {
      let restaurantID = await Restaurant.findById(restId);

      let restaurantOwnerId = restaurantID.owner.toString();

      if (userRole === "admin" || req.payload._id === restaurantOwnerId) {
        await Restaurant.findByIdAndUpdate(restId, restUpdate);
        res.status(201).json("Restaurante actualizado");
      } else {
        res.status(401).json("Needs validated user");
      }
    } catch (error) {
      next(error);
    }
  }
);

// POST '/restaurant/:restId/reserva' => create a new reserva
router.post("/:restId/reserva", isAuthenticated, async (req, res, next) => {
  const { restId } = req.params;

  const { fecha, hour, pax, hasConsumed } = req.body;
// ! Mirar la Date en como se guarda el formato !
  const newReserve = {
    fecha,
    hour,
    pax,
    hasConsumed,
    restaurant: restId,
    whoReserved: req.payload._id,
  };
  try {
    await Reserva.create(newReserve);
    res.status(201).json("Reserva create success");
  } catch (error) {
    res.status(401).json("validar usuario");
    next(error);
  }
});

//POST "/api/restaurant/:restId/dish" => crear una nueva carta
router.post("/:restId/dish", isAuthenticated, async (req, res, next) => {
  const { title, description, price, category } = req.body;
  const {restId} = req.params
  let userRole = req.payload.role;
  let userOnlineId = req.payload._id;

  const dishCreate = {
    title,
    description,
    price,
    category,
    restaurant: restId 
  };

  try {

    let restaurantID = await Restaurant.findById(restId);

    let restaurantOwnerId = restaurantID.owner.toString();

    if (userRole === "admin" || userOnlineId === restaurantOwnerId) {
      await Dish.create(dishCreate);
      res.status(201).json("Dish created successfully");
    } else {
      res.status(401).json("Necesita un usuario validado");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
