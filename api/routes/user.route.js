import express from "express";
import { test, updateUserInfo } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test",test);

router.post('/update/:id',verifyUser,updateUserInfo);

export default router;