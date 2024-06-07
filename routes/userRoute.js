import express from "express";
import { allAuthor, getUser, login, logout, register } from "../controllers/userController.js";
import { upload } from "../middleware/multer.middleware.js";
import { isAuthorized } from "../middleware/auth.js";
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  register
);
router.post("/login", login)
router.post("/logout",isAuthorized ,logout)
router.get("/getuser",isAuthorized ,getUser)
router.get("/allauthor" ,allAuthor)

export default router;
