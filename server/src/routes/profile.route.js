import express from "express";
import { createProfile, getProfiles } from "../controllers/profile.controller.js";

const profileRouter = express.Router();

profileRouter.post("/create-profile", createProfile);
profileRouter.get("/get-profile", getProfiles)

export default profileRouter;
