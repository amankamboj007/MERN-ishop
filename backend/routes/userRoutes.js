const router = require("express").Router()
const { registerUser, login, logout, forgotPassword, resetPassword, myProfile, updatePassword } = require("../controller/user.controller")
const { isUserAuthenticated } = require("../middleware/auth")


router.post("/register", registerUser)
router.post("/login", login)
router.get("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.put("/password/reset/:token", resetPassword)
router.get("/me", isUserAuthenticated, myProfile)
router.put("/changePassword", isUserAuthenticated, updatePassword)

module.exports = router;