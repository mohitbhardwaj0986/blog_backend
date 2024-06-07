import express from "express";
import { isAuthorized } from "../middleware/auth.js";
import { upload } from "../middleware/multer.middleware.js";
import { deleteBlog, getAllPost, getMyPost, getSinglePost, postBlog, privateBlogs, updateBlog } from "../controllers/blogController.js";


const router = express.Router();

router.post(
    "/postblog",isAuthorized,
    upload.fields([
      {
        name: "mainImage",
        maxCount: 1,
      },
      {
        name: "imageOne",
        maxCount: 1,
      },
      {
        name: "imageTwo",
        maxCount: 1,
      },
    ]),
    postBlog
  );

  router.get("/getallpost", getAllPost)
  router.get("/getsinglepost/:id" , isAuthorized, getSinglePost)
  router.put("/updateblog/:id" , isAuthorized, updateBlog)
  router.delete("/postdelete/:id" , isAuthorized, deleteBlog)
  router.get("/myblogs" , isAuthorized, getMyPost)
  router.get("/private/blog" , isAuthorized, privateBlogs)

export default router;