import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { usercontext } from "../context/UserContext";
import axios from "axios";

import SideNavBar from "../components/SideNavBar";
import TopBar from "../components/TopBar";
import TeamMemberCard from "../components/teamMemberCard";
import Layout from "../components/layout";

export default function ManagerTeamView() {
    const [teamName, setTeamName] = React.useState("");
    const [teamMembers, setTeamMembers] = React.useState([]);
    const { user } = React.useContext(usercontext);

    // Fetch team name and team members
    useEffect(() => {
        // Define an async function inside of useEffect
        const fetchData = async () => {
            try {
                // Wait for the axios call to resolve
                const response = await axios.get(
                    `https://employnet.onrender.com/api/teams/manager-team/${user._id}`,
                    { withCredentials: true }
                );
                console.log(response.data); // Log the response data

                setTeamName(response.data.message.teamName);
                setTeamMembers(response.data.message.teamMembers);
            } catch (error) {
                console.error("Error during fetching team:", error);
            }
        };

        fetchData(); // Call the async function
    }, [user?._id]);

    const teamEls = teamMembers.map((emp, idx) => {
        return <TeamMemberCard key={idx} user={emp} />;
    });

    return (
        <Layout pageTitle="Manager Team View">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box>
                    <Box sx={{ padding: 5, textAlign: "center" }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h3">My Team</Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                            {teamEls}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}
