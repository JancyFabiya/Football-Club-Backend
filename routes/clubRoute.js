const express = require("express");
const {
    getAllclub,
    addClub,
    updateClub,
    deleteClub,
    getClubDetails,
    getAdminclub,
} = require("../controllers/clubController");
const { isAuthenticatedUser, authorizesdRoles } = require("../middleware/auth");



const router = express.Router();

router.route("/club").get(getAllclub);
router.route("/admin/club").get(isAuthenticatedUser, authorizesdRoles("admin"), getAdminclub);
router.route("/admin/club/new").post(isAuthenticatedUser, authorizesdRoles("admin"), addClub);
router.route("/admin/club/remove/:id").delete(isAuthenticatedUser, authorizesdRoles("admin"), deleteClub);

router
    .route("/admin/club/:id")
    .put(isAuthenticatedUser, authorizesdRoles("admin"), updateClub)

router.route("/club/:id").get(getClubDetails);



module.exports = router;

