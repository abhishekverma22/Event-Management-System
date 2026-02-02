import express from "express";
import { createProfile, getProfiles, loginProfile, logoutProfile } from "../controllers/profile.controller.js";

import { verifyJWT, verifyAdmin } from "../middleware/auth.middleware.js";

const profileRouter = express.Router();

profileRouter.post("/create-profile", verifyJWT, verifyAdmin, createProfile);
profileRouter.post("/login", loginProfile);
profileRouter.post("/logout", logoutProfile);
profileRouter.get("/get-profile", getProfiles)

export default profileRouter;
