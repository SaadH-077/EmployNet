import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
    TextField,
    TextareaAutosize,
    Button,
    useTheme,
    CircularProgress,
    Alert,
    AlertTitle,
} from "@mui/material";
import { usercontext } from "../context/UserContext";
import { useContext } from "react";
import axios from "axios";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import Layout from "../components/layout";

const RequestLeave = () => {
    const { user, setUser } = useContext(usercontext);
    const [leaveSuccess, setLeaveSuccess] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayInvalidDateError, setDisplayInvalidDateError] = useState(false);


    const handleLeaveRequest = async (event) => {
        setIsLoading(true);
        event.preventDefault();

        const formData = Object.fromEntries(new FormData(event.target));

        console.log("Form data", formData);
        console.log("Start Date", formData.startDate);
        console.log("date type", typeof formData.startDate);

        //i need to bring the dates into the form that i stored in the attendance table i,e 4/10/2024'
        const startDate = new Date(formData.startDate); // Parse start date string into Date object
        const endDate = new Date(formData.endDate); // Parse end date string into Date object
        console.log("start date", startDate);
        console.log("end date", endDate);
        
        const dateList = []; // Array to store the list of dates

        // Making sure that the user cannot request leave for a date that has already passed
        let today = new Date();
        console.log("today", today)
        today.setHours(0,0,0,0);

        if ((startDate < today) || (endDate < startDate)) {
            setIsLoading(false);
            setDisplayInvalidDateError(true);
            return;
        }

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            // Check if the current day is not Saturday (6) or Sunday (0)
            if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
                // Format the current date as "MM/DD/YYYY"
                const formattedDate = `${
                    currentDate.getMonth() + 1
                }/${currentDate.getDate()}/${currentDate.getFullYear()}`;

                // Add the formatted date to the list
                dateList.push(formattedDate);
            }

            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        console.log("Date list", dateList);

        // Send the leave request to the server
        let requestBody = {
            employeeID: user._id,
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: formData.reason,
            dateList: dateList,
        };

        try {

            const response = await axios.post(
                "https://employnet.onrender.com/api/leave/request-leave",
                requestBody,
                { withCredentials: true }
            );
            setLeaveSuccess(true);
            

            console.log("leave req response", response);
        } catch (error) {
            console.error("error connecting to server", error);
        }
        setIsLoading(false);
    };

    return (
        <Layout pageTitle="Request Leave">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 4,
                }}
            >
                <Container component="main" sx={{ mt: 2, mb: 4 }}>
                    <Card sx={{ mx: "auto", p: 2, maxWidth: 500 }}>
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <EventNoteIcon
                                sx={{
                                    fontSize: 60,
                                    color: "#0e6890",
                                    marginBottom: 2,
                                }}
                            />
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{ marginBottom: 3 }}
                            >
                                Request Leave
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleLeaveRequest}
                                noValidate
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                }}
                            >
                                <TextField
                                    name="startDate"
                                    label="Start Date"
                                    type="date"
                                    required
                                    fullWidth
                                    sx={{ mb: 3 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    name="endDate"
                                    label="End Date"
                                    type="date"
                                    required
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    name="reason"
                                    label="Reason for Leave"
                                    multiline
                                    rows={4}
                                    required
                                    fullWidth
                                    sx={{ mb: 3 }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        backgroundColor: "rgba(6,129,175,0.93)",
                                        "&:hover": {
                                            backgroundColor: "0e6890",
                                        },
                                    }}
                                >
                                    Submit Request
                                </Button>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignContent: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {isLoading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                alignSelf: "center",
                                                marginTop: 3,
                                            }}
                                        />
                                    )}
                                </Box>
                                {leaveSuccess && (
                                    <Alert
                                        onClose={() => setLeaveSuccess(false)}
                                        icon={
                                            <CheckCircleIcon fontSize="inherit" />
                                        }
                                        severity="info"
                                        sx={{ width: "100%", marginTop: 2 }}
                                    >
                                        <AlertTitle>Request sent</AlertTitle>
                                        Please view your
                                        notifications for detailed information on the status.
                                    </Alert>
                                )}
                                {displayInvalidDateError && (
                                    <Alert
                                        onClose={() => setDisplayInvalidDateError(false)}
                                        severity="error"
                                        sx={{ width: "100%", marginTop: 2 }}
                                    >
                                        <AlertTitle>Invalid date</AlertTitle>
                                        Please select a valid date range.
                                    </Alert>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Layout>
    );
};

export default RequestLeave;
