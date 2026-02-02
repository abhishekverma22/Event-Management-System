import express from "express";
import { createEvent, getEventsByProfile, updateEvent } from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.post("/create-event", createEvent);
eventRouter.get("/by-profile/:profile_id", getEventsByProfile)
eventRouter.put("/:event_id", updateEvent)

export default eventRouter;
