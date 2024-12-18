const express = require("express")
const router = express.Router();
const {
    login,
    register,
    verifyUser,
    forgotPassword,
    changePassword,
    resetPassword,
    logout
} = require('../controllers/auths')
const {skipAuth, isAuthenticated} = require('../middlewares/authenticator')
// define the routes
router.get('/register', skipAuth, (req,res)=> res.render('pages/register',{error:false, msg:''})) 
router.post('/register', register)
router.get('/login', skipAuth, (req,res)=> res.render('pages/login',{error:false, msg:''}))
router.post('/login', login)
router.get("/confirm/email/:token/:user",verifyUser)
// generates and send forgot password tokens email
router.post("/forgot/password/init", forgotPassword)
// change the users password newly provided one
router.post("/password/change/:token/:issuer",changePassword)
// reset password
router.post("/password/reset", resetPassword)

router.get('/logout',isAuthenticated, logout)

module.exports = router;