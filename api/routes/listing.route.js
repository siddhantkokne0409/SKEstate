import express from "express";
import { createListing, deleteListing, getListing, updateListing} from "../controllers/listing.controller.js";
import {verifyUser}  from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create",verifyUser,createListing);
router.delete("/delete/:id",verifyUser,deleteListing);
router.post("/updatelisting/:id",verifyUser,updateListing);
router.get("/getListing/:id",getListing);


export default router;