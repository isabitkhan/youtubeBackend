import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//Secure routes
router.route("/logout").post(auth, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(auth, changeCurrentPassword);
router.route("/current-user").get(auth, getCurrentUser);
router.route("/update-account").patch(auth, updateAccountDetails);
router.route("/avatar").patch(auth, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(auth, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(auth, getUserChannelProfile);
router.route("/history").get(auth, getWatchHistory);

export default router;
