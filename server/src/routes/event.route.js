import express from "express";
import { createEvent, getEventsByProfile, updateEvent, getEventLogs } from "../controllers/event.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const eventRouter = express.Router();

eventRouter.post("/create-event", verifyJWT, createEvent);
eventRouter.get("/by-profile/:profile_id", verifyJWT, getEventsByProfile)
eventRouter.put("/:event_id", verifyJWT, updateEvent)
eventRouter.get("/logs/:event_id", verifyJWT, getEventLogs);

export default eventRouter;
