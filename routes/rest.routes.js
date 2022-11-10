const router = require("express").Router();
const Restaurant = require("../models/Restaurant.model");
const cloudinary = require("../middlewares/cloudinary.js");

const isAuthenticated = require("../middlewares/auth.middlewares");

// POST '/api/restaurant/create' => crear nuevo restaurante
router.post(
  "/create",
  isAuthenticated,
  cloudinary.single("restaurant-img"),
  async (req, res, next) => {
    const { name, location, cuisinType, phoneNumber } = req.body;
    let userRole = req.payload.role
    const restaurantCreate = {
      name,
      location,
      cuisinType,
      phoneNumber,
      photos: req.file?.path,
    };

    try {
        if(userRole === 'owner' || userRole === 'admin'){
            await Restaurant.create(restaurantCreate)
            res.status(201).json("Restaurant Create success");
        }else {
            res.status(401).json('validar usuario')
        }
    } catch (error) {
      next(error);
    }
  }
);
// GET '/restaurants' view all restaurants
// GET '/restaurante/:restaurantID' vista especifica de restaurante
// DELETE '/restaurante/:restaurantID' delete especific de restaurante
// PATCH '/restaurante/:restaurantID' edit especific de restaurante
module.exports = router;
