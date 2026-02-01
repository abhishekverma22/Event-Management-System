import moment from "moment-timezone";
import { EventModel } from "../models/event.model.js";
import { sendError, sendSuccess } from "../utils/response.helper.js";
import { EventLogModel } from "../models/eventlog.model.js";

export const createEvent = async (req, res) => {
  try {
    const { participants, time_zone, start_date_time, end_date_time } =
      req.body;

    //   check start and end date and time
    if (new Date(end_date_time) <= new Date(start_date_time)) {
      return sendError(res, "End date-time must be after start date-time", 400);
    }

    const event_payload = {
      participants,
      time_zone,
      start_date_time,
      end_date_time,
    };

    const create_event = await EventModel.create(event_payload);

    return sendSuccess(res, create_event, 201);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { event_id, user_id } = req.params;
    const { participants, time_zone, start_date_time, end_date_time } =
      req.body;

    const event = await EventModel.findById(event_id);
    if (!event) {
      return sendError(res, "Event not found", 404);
    }

    const changes = {};

    /* ================= Participants ================= */
    if (participants) {
      const oldP = event.participants.map(String).sort();
      const newP = participants.map(String).sort();

      if (JSON.stringify(oldP) !== JSON.stringify(newP)) {
        changes.participants = { old: oldP, new: newP };
        event.participants = participants;
      }
    }

    /* ================= Timezone ================= */
    if (time_zone && time_zone !== event.time_zone) {
      changes.time_zone = {
        old: event.time_zone,
        new: time_zone,
      };
      event.time_zone = time_zone;
    }

    /* ================= Date & Time ================= */
    if (start_date_time || end_date_time) {
      const tz = time_zone || event.time_zone;

      const newStart = start_date_time
        ? moment.tz(start_date_time, tz).utc().toDate()
        : event.start_date_time;

      const newEnd = end_date_time
        ? moment.tz(end_date_time, tz).utc().toDate()
        : event.end_date_time;

      if (+newStart !== +event.start_date_time) {
        changes.start_date_time = {
          old: event.start_date_time,
          new: newStart,
        };
        event.start_date_time = newStart;
      }

      if (+newEnd !== +event.end_date_time) {
        changes.end_date_time = {
          old: event.end_date_time,
          new: newEnd,
        };
        event.end_date_time = newEnd;
      }

      if (event.end_date_time <= event.start_date_time) {
        return sendError(res, "End time must be after start time", 400);
      }
    }

    /* ================= No changes ================= */
    if (Object.keys(changes).length === 0) {
      return sendError(res, "No changes detected", 400);
    }

    await event.save();

    /* ================= Event Log ================= */
    await EventLogModel.create({
      event: event._id,
      updated_by: user_id,
      changes,
    });

    return sendSuccess(res, "Event updated successfully", 200, event);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
