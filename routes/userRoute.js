const express = require("express")
const { registerUser, verifyRegisterOtp, loginUser, 
    getAllManager,
    addManager,
    updateManager,
    deleteManager,
    getManagerDetails,
    getAdminManager,
    addPlayer,
    getAllPlayer,
    getPlayerDetails,
    getAdminPlayer,
    updatePlayer,
    deletePlayer,
    logout} = require("../controllers/userController")





const { isAuthenticatedUser, authorizesdRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/verify").post(isAuthenticatedUser, verifyRegisterOtp);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);



//Manager
router.route("/manager/:clubName").get(getAllManager);
router.route("/admin/manager").get(isAuthenticatedUser, authorizesdRoles("admin"), getAdminManager);
router.route("/admin/manager/new").post(isAuthenticatedUser, authorizesdRoles("admin"), addManager);
router.route("/admin/manager/remove/:id").delete(isAuthenticatedUser, authorizesdRoles("admin"), deleteManager);

router
    .route("/admin/manager/:id")
    .put(isAuthenticatedUser, authorizesdRoles("admin"), updateManager)

router.route("/manager/detail/:id").get(getManagerDetails);

//Player

router.route("/player/:clubName").get(getAllPlayer);
router.route("/admin/player").get(isAuthenticatedUser, authorizesdRoles("admin"), getAdminPlayer);
router.route("/admin/player/new").post(isAuthenticatedUser, authorizesdRoles("admin"), addPlayer);
router.route("/admin/player/remove/:id").delete(isAuthenticatedUser, authorizesdRoles("admin"), deletePlayer);

router
    .route("/admin/player/:id")
    .put(isAuthenticatedUser, authorizesdRoles("admin"), updatePlayer)

router.route("/player/detail/:id").get(getPlayerDetails);

module.exports = router;