const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
// const isAuthenticated = require("../middlewares/auth.middleware");

// POST '/api/auth/signup' => ruta de registro de usuario
router.post("/signup", async (req, res, next) => {
  const { email, password, password2, username, phoneNumber, role } = req.body;

  // clausula de guardia, validaciones de BE

  // completar campos validos
  if (
    username === "" ||
    email === "" ||
    password === "" ||
    password2 === "" ||
    phoneNumber === "" || 
    role === ""
  ) {
    res.status(400).json({errorMessage: "All fields need to be filled"});
    return;
  }

// password 1 === password 2
  if (password !== password2) {
    res.status(400).json({errorMessage: "Please make sure both passwords are the same"});
    return;
  }
// verificar seguridad de password

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.status(400).json({errorMessage: "The password should contain at least 6 characters, one uppercase letter and a number or special character" });
    return;
  }

  //valid email check
  const emailRegex =
    /[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^_`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (emailRegex.test(email) === false) {
    res.status(400).json({errorMessage: "The e-mail needs to be a valid direction"});
    return;
  }

  try {
    // generar password valida
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);


    
    const validEmail = await User.findOne({ email: email });
    if (validEmail !== null) {
      res.status(400).json({errorMessage: "That e-mail is already in use"});
    }

    const newUser = {
        username: username,
        email: email,
        password: hashPassword,
        phoneNumber: phoneNumber,
        role: role
    }

    await User.create(newUser)

    res.status(201).json('User registred correct!')
    
  } catch (error) {
    next(error)
  }

});

//  GET     '/restaurants'
//   POST    '/restaurants'
//   GET     '/restaurant/restaurantID'
//   DELETE  '/restaurant/restaurantID'
//   PATCH   '/restaurant/restaurantID'

module.exports = router;
