import React from "react";
import SelectProfile from "../profileSelect/SelectProfile";
import "./Heading.css";

const Heading = () => {
  return (
    <header>
      <div id="left">
        <h1>Event Management</h1>
        <p>Create and manage events across multiple timezone</p>
      </div>
      <div id="right">
        <SelectProfile  width="300px"/>
      </div>
    </header>
  );
};

export default Heading;
