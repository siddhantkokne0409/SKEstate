import express from "express";
import { deleteUser, test, updateUserInfo } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { getListing } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test",test);

router.post('/update/:id',verifyUser,updateUserInfo);
router.delete('/delete/:id',verifyUser,deleteUser);
router.get("/listings/:id",verifyUser,getListing);


export default router;