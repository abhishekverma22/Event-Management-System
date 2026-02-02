import React, { useState } from "react";
import moment from "moment-timezone";
import "./CreateEvent.css";
import SelectProfile from "../profileSelect/SelectProfile";
import TimezoneSelect from "./TimezoneSelect";
import api from "../../api/axios.js";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProfiles } from "../../redux/store/profileSlice.js";

const CreateEvent = ({ onEventCreated }) => {
  const dispatch = useDispatch();
  const selectedProfiles = useSelector(
    (state) => state.profile.selectedProfiles,
  );

  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("09:00");

  const isValidDateTimeRange = () => {
    const now = new Date();

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    // End must be after start
    if (end <= start) {
      alert("End date & time must be after start date & time");
      return false;
    }

    // If start date is today, time must not be in past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDay = new Date(startDate);
    startDay.setHours(0, 0, 0, 0);

    if (startDay.getTime() === today.getTime() && start < now) {
      alert("Start time cannot be in the past");
      return false;
    }

    return true;
  };

  const handleCreateEvent = async () => {
    if (
      !selectedProfiles.length ||
      !selectedTimezone ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime
    ) {
      alert("All fields are required");
      return;
    }

    // Extract only profile IDs
    const participants = selectedProfiles.map((p) => p._id);

    const start_date_time = moment
      .tz(`${startDate} ${startTime}`, selectedTimezone)
      .toISOString();

    const end_date_time = moment
      .tz(`${endDate} ${endTime}`, selectedTimezone)
      .toISOString();

    const payload = {
      participants,
      time_zone: selectedTimezone,
      start_date_time,
      end_date_time,
    };

    try {
      const res = await api.post("api/event/create-event", payload);
      alert("Event created successfully ✅");
      setSelectedTimezone("");
      setStartDate("");
      setStartTime("09:00");
      setEndDate("");
      setEndTime("09:00");
      dispatch(setSelectedProfiles([]));

      // Trigger callback to refresh events list
      if (onEventCreated) onEventCreated();

      console.log(res.data);
    } catch (error) {
      console.error(error, "error.......");

      alert("Failed to create event ❌");
    }
  };
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="create-event-panel">
      <h2>Create Event</h2>

      <div className="form-group">
        <label>Profiles</label>
        <SelectProfile width="100%" onChange={(ids) => setParticipants(ids)} />
      </div>

      <div className="form-group">
        <label>Timezone</label>
        <TimezoneSelect
          value={selectedTimezone}
          onChange={(tz) => setSelectedTimezone(tz)}
        />
      </div>

      <div className="form-group datetime-group">
        <div className="datetime-wrapper">
          <label>Start Date & Time</label>
          <div className="datetime-input full-width">
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        <div className="datetime-wrapper">
          <label>End Date & Time</label>
          <div className="datetime-input full-width">
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="create-event-btn" onClick={handleCreateEvent}>
        + Create Event
      </button>
    </div>
  );
};

export default CreateEvent;
