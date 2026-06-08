import express from "express";

import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  coursesDetails,
  buyCourse,
} from "../controllers/course.controller.js";
import { User } from "../models/user.model.js";
import user from "../Middlewares/user.mid.js";
import { adminMiddleware } from "../Middlewares/admin.mid.js"; 



const router = express.Router();

router.post("/create",adminMiddleware, createCourse);
router.put("/update/:id", adminMiddleware, updateCourse);
router.delete("/delete/:id", adminMiddleware, deleteCourse);
router.get("/buy/:courseId", user, buyCourse);
router.get("/", getAllCourses);
router.get("/:id", coursesDetails);


export default router;
