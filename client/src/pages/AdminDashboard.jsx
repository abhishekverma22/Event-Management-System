import React from "react";
import CreateUser from "../components/createUser/CreateUser";
import CreateEvent from "../components/createEvent/CreateEvent";
import ShowEvent from "../components/showEvent/ShowEvent";
import Heading from "../components/Heading/Heading";

const AdminDashboard = () => {
    return (
        <main>
            <header>
                <Heading />
            </header>
            <div className="event-container" style={{ display: "block" }}>
                <section style={{ marginBottom: "2rem" }}>
                    <CreateUser />
                </section>

                <div className="dashboard-layout">
                    {/* Create Event */}
                    <section className="dashboard-column">
                        <CreateEvent />
                    </section>

                    {/* Show Event */}
                    <section className="dashboard-column">
                        <ShowEvent />
                    </section>
                </div>

            </div>
        </main>
    );
};

export default AdminDashboard;
