import { useEffect, useState } from "react";
import { TbUsers } from "react-icons/tb";
import { FaRegEdit, FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import api from "../../api/axios";
import moment from "moment-timezone";
import EditEvent from "../updateEvent/EditEvent";
import EventLogs from "./EventLogs";
import "./ProfileDetails.css";

const ProfileDetails = ({ profile, allProfiles, timezone, refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogsEvent, setViewingLogsEvent] = useState(null);

  useEffect(() => {
    if (profile?._id) fetchEvents();
  }, [profile, refreshTrigger]); 

  const fetchEvents = async () => {
    try {
      const res = await api.get(`/api/event/by-profile/${profile._id}`);
      setEvents(res.data.success ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  const formatDate = (date) =>
    timezone
      ? moment(date).tz(timezone).format("D-MMM-YYYY")
      : moment(date).format("D-MMM-YYYY");

  const formatTime = (date) =>
    timezone
      ? moment(date).tz(timezone).format("hh:mm A")
      : moment(date).format("hh:mm A");

  return (
    <div className="profile-events-container">
      <h3 style={{ marginBottom: "20px", textTransform: "capitalize" }}>
        {profile.name}'s Events
      </h3>


      {editingEvent && (
        <EditEvent
          event={editingEvent}
          currentUser={profile}
          timezone={timezone}
          onClose={() => setEditingEvent(null)}
          onUpdated={fetchEvents}
        />
      )}


      {viewingLogsEvent && (
        <EventLogs
          event={viewingLogsEvent}
          allProfiles={allProfiles}
          timezone={timezone}
          onClose={() => setViewingLogsEvent(null)}
        />
      )}

      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="participants">
              <TbUsers className="user-icon" />
              <span>{event.participants.map(p => p.name).join(", ")}</span>
            </div>

            <div className="event-dates">
              <div>
                <FaRegCalendarAlt /> <strong>Start:</strong> {formatDate(event.start_date_time)}
              </div>
              <div className="time">
                <FaRegClock /> {formatTime(event.start_date_time)}
              </div>

              <div style={{ marginTop: "6px" }}>
                <FaRegCalendarAlt /> <strong>End:</strong> {formatDate(event.end_date_time)}
              </div>
              <div className="time">
                <FaRegClock /> {formatTime(event.end_date_time)}
              </div>
            </div>

            <hr className="divider" />

            <div className="event-buttons">
              <button
                className="btn edit-btn"
                onClick={() => setEditingEvent(event)}
              >
                <FaRegEdit /> Edit
              </button>

              <button
                className="btn logs-btn"
                onClick={() => setViewingLogsEvent(event)}
              >
                <IoNewspaperOutline /> View Logs
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileDetails;
