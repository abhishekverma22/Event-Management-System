import express from "express";
import { createProfile } from "../controllers/profile.controller.js";

const profileRouter = express.Router();

profileRouter.post("/", createProfile);

export default profileRouter;
