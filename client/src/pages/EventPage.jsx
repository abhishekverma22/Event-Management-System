import React from "react";
import "./EventPage.css";
import Heading from "../components/Heading/Heading";
import CreateEvent from "../components/createEvent/CreateEvent";
import ShowEvent from "../components/showEvent/ShowEvent";

const EventPage = () => {
  return (
    <main>

      <header>
        <Heading />
      </header>

      <div className="event-container">
        <section>
          <CreateEvent/>
        </section>
        <section>
          <ShowEvent/>
        </section>
      </div>
    </main>
  );
};

export default EventPage;
