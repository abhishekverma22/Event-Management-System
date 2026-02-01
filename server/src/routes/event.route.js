import express from "express";
import { createEvent, updateEvent } from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.post("/create-event", createEvent);
eventRouter.put("/:event_id/user/:user_id", updateEvent)

export default eventRouter;
