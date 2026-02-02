import React, { useState } from "react";
import ProfileDetails from "../components/showEvent/ProfileDetails";
import Heading from "../components/Heading/Heading";
import { useAuth } from "../context/AuthContext";
import TimezoneSelect from "../components/showEvent/timeZone/TimezoneSelect";
import CreateEvent from "../components/createEvent/CreateEvent";

const UserDashboard = () => {
    const { user } = useAuth();
    const [timezone, setTimezone] = useState("");
    const [refreshEvents, setRefreshEvents] = useState(0);

    const handleEventCreated = () => {
        setRefreshEvents(prev => prev + 1);
    };

    return (
        <main>
            <header>
                <Heading />
            </header>
            <div className="event-container" style={{ display: "block" }}>

                <section style={{ marginBottom: "2rem", backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "10px" }}>
                    <h3>Timezone Settings</h3>
                    <div style={{ margin: "10px 0" }}>
                        <label style={{ marginRight: "10px" }}>Preferred Timezone: </label>
                        <TimezoneSelect value={timezone} onChange={setTimezone} />
                    </div>
                </section>

                <div className="dashboard-layout">
                    <section className="dashboard-column">
                        <CreateEvent onEventCreated={handleEventCreated} />
                    </section>

                    <section className="dashboard-column">
                        {user && (
                            <ProfileDetails
                                profile={user}
                                allProfiles={[user]}
                                timezone={timezone}
                                refreshTrigger={refreshEvents}
                            />
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default UserDashboard;
