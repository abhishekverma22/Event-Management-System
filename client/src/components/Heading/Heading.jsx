import React from "react";
import SelectProfile from "../profileSelect/SelectProfile";
import "./Heading.css";
import { useState } from "react";
const Heading = () => {
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  const handleProfileChange = (profiles) => {
    console.log("Selected profiles:", profiles);
    setSelectedProfiles(profiles);
  };

  return (
    <header>
      <div id="left">
        <h1>Event Management</h1>
        <p>Create and manage events across multiple timezone</p>
      </div>
      <div id="right">
        <SelectProfile onChange={handleProfileChange} />
      </div>
    </header>
  );
};

export default Heading;
