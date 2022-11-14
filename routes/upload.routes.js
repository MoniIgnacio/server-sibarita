const router = require("express").Router();
const cloudinary = require("../middlewares/cloudinary.js");
const { isAuthenticated } = require("../middlewares/auth.middlewares");

// ruta para recibir imagen de FE, llevarla a cloudinary y enviar FE
router.post('/', cloudinary.single('photo'), (req,res,next) => {
    if(req.file === undefined){
        res.status(400).json('probleas subiendo imagen')
        return
    }
    console.log('url de cloudinary',req.file.path)
    res.status(200).json({img: req.file.path})

})


module.exports = router