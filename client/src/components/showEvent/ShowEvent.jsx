import React from "react";
import ProfileFetch from "./ProfileFetch";
import "./ShowEvent.css";

const ShowEvent = () => {
  return (
    <div className="show-event-container">
      <h1>Events</h1>
      <ProfileFetch />
    </div>
  );
};

export default ShowEvent;
