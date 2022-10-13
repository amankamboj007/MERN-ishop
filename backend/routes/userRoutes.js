const router = require("express").Router()
const { registerUser, login, logout, forgotPassword, resetPassword, myProfile, updatePassword, updateProfile, getAllUsers, getUser, userUpdate, deleteUser } = require("../controller/user.controller")
const { isUserAuthenticated, authorizeRole } = require("../middleware/auth")


router.post("/register", registerUser)
router.post("/login", login)
router.get("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.put("/password/reset/:token", resetPassword)
router.get("/me", isUserAuthenticated, myProfile)
router.put("/changePassword", isUserAuthenticated, updatePassword)
router.put("/me/update", isUserAuthenticated, updateProfile)

router.get("/admin/getAllUsers", isUserAuthenticated, authorizeRole("admin"), getAllUsers)
router.get("/admin/user/:id", isUserAuthenticated, authorizeRole("admin"), getUser)
router.put("/admin/user/:id", isUserAuthenticated, authorizeRole("admin"), userUpdate)
router.put("/admin/user-delete/:id", isUserAuthenticated, authorizeRole("admin"), deleteUser)


module.exports = router;