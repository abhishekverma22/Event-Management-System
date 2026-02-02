import moment from "moment-timezone";
import { EventModel } from "../models/event.model.js";
import { sendError, sendSuccess } from "../utils/response.helper.js";
import { EventLogModel } from "../models/eventLog.model.js";
import { ProfileModel } from "../models/profile.model.js";

export const createEvent = async (req, res) => {
  try {
    const { participants, time_zone, start_date_time, end_date_time } =
      req.body;

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

export const getEventsByProfile = async (req, res) => {
  try {
    const { profile_id } = req.params;
    const { time_zone } = req.query;

    // Check permissions: Admin or Owner
    if (req.profile.role !== "admin" && req.profile._id.toString() !== profile_id) {
       // Allow admins to view any profile events
       // But if user A tries to view user B's events, deny.
       return sendError(res, "Unauthorized request", 403);
    }

    const events = await EventModel.find({
      participants: profile_id,
    }).sort({ start_date_time: 1 });

    if (!events.length) {
      return sendSuccess(res, "No events found for this user", 200, []);
    }
    const allProfileIds = events.flatMap((e) => e.participants);
    const profiles = await ProfileModel.find({ _id: { $in: allProfileIds } });

    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p._id] = p.name;
    });

    const formattedEvents = events.map((event) => {
      const obj = event.toObject();

      if (time_zone) {
        obj.start_date_time = moment
          .utc(obj.start_date_time)
          .tz(time_zone)
          .format();
        obj.end_date_time = moment
          .utc(obj.end_date_time)
          .tz(time_zone)
          .format();
      }

      obj.participants = obj.participants.map((pId) => ({
        _id: pId,
        name: profileMap[pId] || "Unknown",
      }));

      return obj;
    });

    return sendSuccess(res, "Events fetched successfully", 200, formattedEvents);
  } catch (error) {
    console.error(error);
    return sendError(res, error.message, 500);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { participants, time_zone, start_date_time, end_date_time } =
      req.body;

    const event = await EventModel.findById(event_id);
    if (!event) return sendError(res, "Event not found", 404);

    // Permission check
    const isAdmin = req.profile.role === "admin";
    const isParticipant = event.participants.some(p => p.toString() === req.profile._id.toString());

    if (!isAdmin && !isParticipant) {
        return sendError(res, "You do not have permission to edit this event", 403);
    }

    const changes = {};

    /* Participants */
    if (participants) {
      const oldP = event.participants.map(String).sort();
      const newP = participants.map(String).sort();

      if (JSON.stringify(oldP) !== JSON.stringify(newP)) {
        changes.participants = { old: oldP, new: newP };
        event.participants = participants;
      }
    }

    /* Timezone */
    if (time_zone && time_zone !== event.time_zone) {
      changes.time_zone = { old: event.time_zone, new: time_zone };
      event.time_zone = time_zone;
    }

    /* Date & Time */
    if (start_date_time || end_date_time) {
      const tz = time_zone || event.time_zone;

      const newStart = start_date_time
        ? moment.tz(start_date_time, tz).utc().toDate()
        : event.start_date_time;

      const newEnd = end_date_time
        ? moment.tz(end_date_time, tz).utc().toDate()
        : event.end_date_time;

      if (+newStart !== +event.start_date_time) {
        changes.start_date_time = { old: event.start_date_time, new: newStart };
        event.start_date_time = newStart;
      }

      if (+newEnd !== +event.end_date_time) {
        changes.end_date_time = { old: event.end_date_time, new: newEnd };
        event.end_date_time = newEnd;
      }

      if (event.end_date_time <= event.start_date_time) {
        return sendError(res, "End time must be after start time", 400);
      }
    }

    if (Object.keys(changes).length === 0) {
      return sendSuccess(res, "No changes detected", 200, event);
    }

    await event.save();

    await EventLogModel.create({
      event: event._id,
      updated_by: req.profile._id,
      changes,
    });

    return sendSuccess(res, "Event updated successfully", 200, event);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getEventLogs = async (req, res) => {
  try {
    const { event_id } = req.params;
    const logs = await EventLogModel.find({ event: event_id })
      .populate("updated_by", "name")
      .sort({ createdAt: -1 });

    return sendSuccess(res, "Logs fetched successfully", 200, logs);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
