import React, { useEffect, useState } from "react";
import axios from "axios";
import { usercontext } from "../context/UserContext.jsx";
import { useContext } from "react";
import { subDays } from "date-fns";
import { Typography, Box, Grid } from "@mui/material";

import Layout from "../components/layout.jsx";
import HoursWorkedGauge from "../components/hoursWorkedGauge.jsx";
import CheckInButton from "../components/checkInButton.jsx";
import AttendanceDayCard from "../components/attendanceDayCard.jsx";
import AttendanceBarChart from "../components/attendanceBarChart.jsx";

// This component displays the attendance of the logged-in user for the current month.
// It utilizes the useContext hook to access user context and axios for making https requests.
// The getAttendance function fetches the attendance data for the user from the backend API.
// The useEffect hook ensures that the attendance data is fetched when the component mounts or when the employeeID changes.
// The layout includes a NavBar component at the top and displays the number of days present for the current month.
// If the data is still loading, a loading message is displayed.
// Any errors during the API call are logged in the console for debugging purposes.

const ViewAttendance = () => {
    const { user, setUser } = useContext(usercontext);
    const [daysPresent, setDaysPresent] = useState(null);
    const [currMinutes, setCurrMinutes] = useState(0);
    const [maxDayMinutes, setMaxDayMinutes] = useState(0);
    const [detailsOnDate, setDetailsOnDate] = useState([]);
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const toggleRefresh = () => {
        setDetailsOnDate([]);
        setTriggerRefresh((old) => !old);
    };


    const employeeID = user._id;

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

            if (detailsOnDate.length > 0) { // Update the hours worked for today in detailsOnDate state (so charts and cards get updated)
                setDetailsOnDate((list) => {
                    const today = list[0];
                    today.hoursWorked = Math.floor(response.data.minutes_passed / 60);
                    today.minutesWorked = Math.floor(response.data.minutes_passed % 60);
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
                data.minutes_worked = !Number.isNaN(elapsedMinutes) ? elapsedMinutes : 0;
            }
            

            // console.log("Data for onDATEDETRAILS:", data)
            const detailsObject = {
                date: new Date(date).toLocaleDateString("en-US", {
                    // year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: 'Asia/Karachi'
                }),
                day: new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    timeZone: 'Asia/Karachi'
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
        return () => {clearInterval(intervalId)};
    }, [triggerRefresh]); // Add dependencies if needed

    // const worked = [450, 350, 230, 401, 320];
    // const remaining = worked.map((w) => 480 - w);
    // const dates = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    // Map data for the bar chart
    // const barChartData = detailsOnDate.map((detail) => {
    //     const totalMinutes = maxDayMinutes; // Assume 8 hours * 60 minutes as the total available minutes per day
    //     return {
    //         workedMinutes: detail.hoursWorked * 60 + detail.minutesWorked,
    //         remainingMinutes: Math.max(
    //             totalMinutes - (detail.hoursWorked * 60 + detail.minutesWorked),
    //             0
    //         ),
    //         date: detail.day,
    //     };
    // });

    console.log("TODAY:", detailsOnDate);

    return (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center", // Centers the content vertically
                        }}
                    >

                        <Typography variant="h6" sx={{fontWeight: "500"}}>
                            Time Worked Today
                        </Typography>

                        <Box >
                            <HoursWorkedGauge
                                currMinutes={currMinutes}
                                maxMinutes={maxDayMinutes}
                                heightOverride={165}
                            />
                        </Box>

                        <Box sx={{ mt: 0.6 }}>
                            <CheckInButton triggerRefresh={toggleRefresh} />

                        </Box>
                    </Box>

                
    );
};

export default ViewAttendance;
