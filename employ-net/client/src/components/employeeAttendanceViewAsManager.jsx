import React, { useEffect, useState } from "react";
import axios from "axios";
import { subDays } from "date-fns";
import { Typography, Box, Grid } from "@mui/material";

import HoursWorkedGauge from "./hoursWorkedGauge.jsx";
import AttendanceDayCard from "./attendanceDayCard.jsx";
import AttendanceBarChart from "./attendanceBarChart.jsx";

// This component displays the attendance of the logged-in user for the current month.
// It utilizes the useContext hook to access user context and axios for making https requests.
// The getAttendance function fetches the attendance data for the user from the backend API.
// The useEffect hook ensures that the attendance data is fetched when the component mounts or when the employeeID changes.
// The layout includes a NavBar component at the top and displays the number of days present for the current month.
// If the data is still loading, a loading message is displayed.
// Any errors during the API call are logged in the console for debugging purposes.

export default function EmployeeAttendanceViewAsManager ({ paramEmployeeId }) {
    const [daysPresent, setDaysPresent] = useState(null);
    const [currMinutes, setCurrMinutes] = useState(0);
    const [maxDayMinutes, setMaxDayMinutes] = useState(0);
    const [detailsOnDate, setDetailsOnDate] = useState([]);

    console.log("param emp id", paramEmployeeId)
    const employeeID = paramEmployeeId;

    function createTimeDate(timeString) {
        // Use a default date, such as today's date
        const today = new Date().toDateString();

        // Combine the default date with the time string
        const dateTimeString = `${today} ${timeString}`;

        // Create the Date object
        const date = new Date(dateTimeString);

        return date;
    }

    // extract in HH:MM AM/PM format from checkInTime and checkOutTime
    function extractTime(timeString) {
        // This regular expression matches both single and double digit hours
        const match = timeString.match(/(\d{1,2}:\d{2})/);
        return match
            ? match[0] + " " + timeString.slice(-2, timeString.length)
            : null;
    }

    const getAttendance = async () => {
        try {
            const response = await axios.get(
                `https://employnet.onrender.com/api/attendance/view-attendance/${employeeID}`,
                { withCredentials: true }
            );
            // console.log("Response from viewAttendance api:", response.data);
            setDaysPresent(response.data.days_present);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const getMinutesWorkedToday = async () => {
        try {
            const response = await axios.get(
                `https://employnet.onrender.com/api/attendance/current-minutes-worked/${employeeID}`,
                { withCredentials: true }
            );

            setCurrMinutes(response.data.minutes_passed);
            setMaxDayMinutes(response.data.minutes_threshold);
            if (detailsOnDate.length > 0) {
                // Update the hours worked for today in detailsOnDate state (so charts and cards get updated)
                setDetailsOnDate((list) => {
                    const today = list[0];
                    today.hoursWorked = Math.floor(
                        response.data.minutes_passed / 60
                    );
                    today.minutesWorked = Math.floor(
                        response.data.minutes_passed % 60
                    );
                    return [today, ...list.slice(1)];
                });
            }
        } catch (error) {
            console.error("Error fetching minutes worked today:", error);
        }
    };

    const getDetailsOnDate = async (date) => {
        try {
            console.log("Fetching details for date:", date);

            const req_info = {
                employeeID: employeeID,
                date: date,
            };

            const response = await axios.post(
                `https://employnet.onrender.com/api/attendance/given-date-info`,
                req_info,
                { withCredentials: true }
            );

            console.log("Response from given-date-info api:", response.data);

            const data = response.data;

            if (
                data.checkInTime !== "N/A" &&
                data.checkOutTime === "N/A" &&
                new Date(date).getDate() === new Date().getDate()
            ) {
                // // calculate elapsed time since data.checkInTime and store that in data.minutes_worked
                const checkInTime = new Date(createTimeDate(data.checkInTime));
                const currentTime = new Date();

                //     const timeDifference =
                //     currentDate.getTime() - checkInTime.getTime(); // Calculate the difference in milliseconds
                // minutes_passed = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes

                const elapsedMinutes = Math.floor(
                    (currentTime - checkInTime) / 60000
                );
                data.minutes_worked = !Number.isNaN(elapsedMinutes)
                    ? elapsedMinutes
                    : 0;
            }

            // console.log("Data for onDATEDETRAILS:", data)
            const detailsObject = {
                date: new Date(date).toLocaleDateString("en-US", {
                    // year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "Asia/Karachi"
                }),
                day: new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    timeZone: "Asia/Karachi"
                }),
                hoursWorked: Math.floor(data.minutes_worked / 60),
                minutesWorked: Math.floor(data.minutes_worked % 60),
                checkInTime: extractTime(data.checkInTime),
                checkOutTime: extractTime(data.checkOutTime),
                checkInStatus: data.statusMessage,
                attendanceMarked: data.attendanceStatus,
            };

            setDetailsOnDate((list) => [...list, detailsObject]);
        } catch (error) {
            console.error("Error fetching detailsOnDate:", error);
        }
    };

    useEffect(() => {
        getAttendance();
        getMinutesWorkedToday();

        const loadDetailsSequentially = async () => {
            let today = new Date();
            let results = [];

            // Create an array of dates
            for (let i = 0; i < 5; i++) {
                const date = subDays(today, i);
                results.push(date);
            }

            // Map through sorted dates and fetch details
            for (let date of results) {
                await getDetailsOnDate(date);
            }
        };

        loadDetailsSequentially();

        // Run getMinsWorkedToday every minute for the gauge to update in real time.
        const intervalId = setInterval(getMinutesWorkedToday, 60000); // 60000 ms = 1 minute
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Add dependencies if needed

    console.log("detailsOnDateObject:", detailsOnDate);

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center", // Centers the content vertically
                            mb: 2,
                        }}
                    >
                        <Typography variant="h4" sx={{ mt: 2 }}>
                            Today
                        </Typography>
                        <Typography variant="h7">Time Worked</Typography>

                        <Box sx={{ mt: 2 }}>
                            <HoursWorkedGauge
                                currMinutes={currMinutes}
                                maxMinutes={maxDayMinutes}
                            />
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center", // Centers the content vertically
                            mb: 2,
                        }}
                    >
                        <Typography variant="h4" sx={{ mt: 2 }}>
                            This Week
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                            {detailsOnDate.length > 0 ? ( // Check if data is ready
                                <AttendanceBarChart
                                    workedMinutes={detailsOnDate.map(
                                        (detail) =>
                                            detail.hoursWorked * 60 +
                                            detail.minutesWorked
                                    )}
                                    remainingMinutes={detailsOnDate.map(
                                        (detail) =>
                                            Math.max(
                                                maxDayMinutes -
                                                    (detail.hoursWorked * 60 +
                                                        detail.minutesWorked),
                                                0
                                            )
                                    )}
                                    dates={detailsOnDate.map(
                                        (detail) => detail.day
                                    )}
                                />
                            ) : (
                                <Typography>No data yet...</Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Grid container>
                <Typography variant="h4" sx={{ m: 3 }}>
                    Attendance Details
                </Typography>
                {detailsOnDate.map((details, index) => (
                    <Grid item xs={12} key={index}>
                        <AttendanceDayCard key={index} {...details} />
                    </Grid>
                ))}
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Attendance for this Month:{" "}
                        {daysPresent !== null ? daysPresent : "Loading..."}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};