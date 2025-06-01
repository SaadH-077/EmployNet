import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { Box, Typography, Grid, Paper, useTheme, Button } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout.jsx";
import { usercontext } from "../context/UserContext.jsx";

const ViewRoomBookings = () => {
    const { user } = useContext(usercontext);
    const [bookings, setBookings] = useState([]);
    const theme = useTheme();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await Axios.get(
                    "https://employnet.onrender.com/api/bookings/view-bookings",
                    { withCredentials: true }
                );
                const selfBookings = response.data.bookings.filter(
                    (booking) => {
                        // Filter bookings to only show the ones for logged in user
                        return user._id === booking.employeeId;
                    }
                );
                // sory by booking.bookingDate
                try {
                    selfBookings.sort((a, b) => {
                        return new Date(a.bookingDate) - new Date(b.bookingDate);
                    });
                } catch (error) {
                    console.error("Failed to sort bookings; displaying without ordering", error);
                }
                console.log("Bookings retrieved:", selfBookings);  
                setBookings(selfBookings);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            }
        };
        fetchBookings();
    }, []);

    const handleMakeBooking = () => {
        navigate("/room-bookings");
    };

    return (
        <Layout pageTitle="Meeting Room Bookings">
            <Box sx={{ display: "flex" }}>
                <Box sx={{ flexGrow: 1, p: 1, justifyContent: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb:5 }}>
                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            onClick={handleMakeBooking}
                            sx={{
                                mt: 2,
                                bgcolor: "rgba(6,129,175,0.93)", // Purple button
                                color: "#FFFFFF", // White text
                                "&:hover": {
                                    bgcolor: "#0e6890", // Dark purple on hover
                                },
                                padding: "10px 40px", // Increase padding to increase size
                                fontSize: "20px", // Increase font size
                            }}
                        >
                            Make Booking
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mb: 3,
                        }}
                    >
                        <Typography variant="h3" sx={{ color: "Black", fontWeight:"300" }}>
                            My Bookings
                        </Typography>
                        <EventNoteIcon
                            sx={{ color: "#0e6890", fontSize: 60, ml: 2 }}
                        />
                    </Box>
                    <Grid container spacing={1}>
                        {bookings.map((booking, index) => (
                            <Grid item xs={12} key={index}>
                                <Paper
                                    elevation={6}
                                    sx={{
                                        padding: 1,
                                        //Please use a light pastel colour of Purple
                                        backgroundColor: "rgba(6,129,175,0.93)",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h6">
                                                {/* Room: {booking.roomName} */}
                                                {booking.roomName}
                                            </Typography>
                                            <Typography>
                                                {/* Date:{" "} */}
                                                {new Date(
                                                    booking.bookingDate
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    timeZone: "Asia/Karachi",
                                                })}
                                            </Typography>
                                            {/* <Typography>
                                                Slot: {booking.slot.name}
                                            </Typography>
                                            <Typography>
                                                Start Time:{" "}
                                                {booking.slot.startTime}
                                            </Typography>
                                            <Typography>
                                                End Time: {booking.slot.endTime}
                                            </Typography> */}
                                            <Typography>
                                                {booking.slot.startTime} -{" "}
                                                {booking.slot.endTime}
                                            </Typography>
                                        </Box>
                                        <MeetingRoomIcon
                                            sx={{
                                                color: "white",
                                                fontSize: 80,
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Layout>
    );
};

export default ViewRoomBookings;
