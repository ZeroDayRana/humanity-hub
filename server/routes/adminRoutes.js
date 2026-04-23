const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRolesMiddleware = require("../middleware/authorizeRolesMiddleware");
const userStatusMiddleware = require("../middleware/userStatusMiddleware");
const upload = require("../middleware/multerMiddleware");
const {newCampaign, updateCampaign, deleteCampaign} = require("../controllers/campaignController");
const { getAllDonations } = require("../controllers/donationController");
const { getAllUsers, makeAdmin, removeAdmin,banUser, unbanUser, suspendUser, unsuspendUser } = require("../controllers/userController");

const router = express.Router();

router.post("/campaigns", authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), upload.single("image"), newCampaign); // create campaign with image upload for admin
router.patch("/campaigns/:id", authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), updateCampaign); // update campaign for admin
router.delete("/campaigns/:id", authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), deleteCampaign); // delete campaign for admin
router.get('/donations', authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), getAllDonations); // get all donations for admin
router.get('/users', authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), getAllUsers); // get all users for admin
router.put('/users/:id/make-admin', authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), makeAdmin); // make user admin for admin
router.put('/users/:id/remove-admin', authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), removeAdmin); // remove admin role from user for admin
router.put('/users/:id/ban', authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), userStatusMiddleware, banUser); // ban user for superadmin
router.put('/users/:id/unban', authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), userStatusMiddleware, unbanUser); // unban user for superadmin
router.put('/users/:id/suspend', authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), userStatusMiddleware, suspendUser); // suspend user for superadmin
router.put('/users/:id/unsuspend', authMiddleware, authorizeRolesMiddleware("admin", "superadmin"), userStatusMiddleware, unsuspendUser); // unsuspend user for superadmin
module.exports = router
