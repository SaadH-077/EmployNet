import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { usercontext } from "../context/UserContext";

import {
    TextField,
    Button,
    Typography,
    MenuItem,
    Card,
    CardContent,
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    Alert,
    AlertTitle,
} from "@mui/material";

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Layout from "../components/layout.jsx";

const RoomBookings = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [updatedSlots, setUpdatedSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Define isLoading state
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [selectedRoomName, setSelectedRoomName] = useState("");
    const { user } = useContext(usercontext);
    const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);
    const [displayFailureAlert, setDisplayFailureAlert] = useState(false);
    const [displayMissingInfoAlert, setDisplayMissingInfoAlert] =
        useState(false);
    const [displayPastDateAlert, setDisplayPastDateAlert] = useState(false);
    
    const employeeID = user._id;

    // Fetch rooms when the component mounts
    useEffect(() => {
        const fetchRooms = async () => {
            // Make a GET request to your backend API endpoint for rooms
            try {
                const response = await Axios.get(
                    "https://employnet.onrender.com/api/bookings/get-rooms",
                    { withCredentials: true }
                );

                if (response.data.success) {
                    // const data = response.data.rooms;
                    setRooms(response.data.rooms); // Set the rooms in state
                    setIsLoading(false); // Set isLoading to false after fetching data
                }
            } catch (error) {
                console.error("Could not fetch rooms:", error);
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (selectedRoom && bookingDate) {
                try {
                    const response = await Axios.get(
                        `https://employnet.onrender.com/api/bookings/get-available-slots/${selectedRoom}/${bookingDate}`,
                        { withCredentials: true }
                    );
                    if (response.data.success) {
                        setAvailableSlots(response.data.availableSlots);
                    }
                } catch (error) {
                    console.error("Could not fetch available slots:", error);
                }
            }
        };
        fetchAvailableSlots();
    }, [selectedRoom, bookingDate, updatedSlots]);

    useEffect(() => {
        // This effect should run whenever availableSlots changes to keep updatedSlots... well, updated.
        setUpdatedSlots(availableSlots);
    }, [availableSlots]);

    // handleRoomChange function
    const handleRoomChange = (event) => {
        const roomID = event.target.value;
        setSelectedRoom(event.target.value);

        // Find the room object to get the room name
        const roomObj = rooms.find((room) => room._id === roomID);
        setSelectedRoomName(roomObj ? roomObj.roomName : "");
    };

    // handleDateChange function
    const handleDateChange = (event) => {
        setBookingDate(event.target.value);
    };

    // handleSlotChange function
    const handleSlotChange = (event) => {
        setSelectedSlot(event.target.value);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (selectedRoom && bookingDate && selectedSlot) {
            try {
                const slotData = updatedSlots.find(
                    (slot) => slot.name === selectedSlot
                );
                console.log(slotData);
                if (!slotData) {
                    alert(
                        "Invalid slot selection. Slot is Already Booked. Please select another slot."
                    );
                    setIsLoading(false);
                    return;
                }
                // Checking if the user chooses a date in the past and alerting them
                const today = new Date();
                today.setHours(0,0,0,0);
                const selectedDate = new Date(bookingDate);
                console.log("Selected date", selectedDate);
                if (selectedDate < today) {
                    setIsLoading(false);
                    setDisplayPastDateAlert(true);
                    return;
                }

                const response = await Axios.post(
                    "https://employnet.onrender.com/api/bookings/make-booking",
                    {
                        employeeId: employeeID, // Replace with actual employee ID
                        roomId: selectedRoom,
                        roomName: selectedRoomName,
                        bookingDate,
                        slot: {
                            name: slotData.name, // Send the slot name
                            // Do not send the 'booked' property; let the backend handle it
                        },
                    },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    setDisplaySuccessAlert(true);

                    const newUpdatedSlots = updatedSlots.filter(
                        (slot) => slot.name !== selectedSlot
                    );
                    setUpdatedSlots(newUpdatedSlots);
                    setIsLoading(false);
                    setBookingSuccess(true);

                    // Notification Logic
                    let model_roll =
                        user.Role === "employee" ? "Employee" : "Manager";

                    const notification = {
                        user: user._id,
                        type: "standard",
                        role: model_roll,
                        content: `Your booking for ${selectedRoomName} on ${bookingDate} from ${slotData.startTime} to ${slotData.endTime} has been confirmed.`,
                    };

                    const notif_response = await Axios.post(
                        "https://employnet.onrender.com/api/notifications/send-notification",
                        notification,
                        { withCredentials: true }
                    );
                }
            } catch (error) {
                console.error("Error creating booking:", error);
                setIsLoading(false);
                setDisplayFailureAlert(true);
            }
        } else {
            setIsLoading(false);
            setDisplayMissingInfoAlert(true);
        }
    };

    return (
        <Layout pageTitle="Book a Meeting Room">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 4,
                }}
            >
                <Card
                    sx={{
                        // minWidth: 600,
                        // maxWidth: 700,
                        minHeight: 400,
                        maxHeight: 600,
                        width: {xs: "80vw", md: "50%"},
                        boxShadow: 3,
                        borderRadius: 3,
                        p: 4,
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <MeetingRoomIcon
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
                            Book a Meeting Room
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleBookingSubmit}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                            }}
                        >
                            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                                <InputLabel id="room-select-label">
                                    Select Room
                                </InputLabel>
                                <Select
                                    labelId="room-select-label"
                                    id="room-select"
                                    value={selectedRoom}
                                    label="Select Room"
                                    onChange={handleRoomChange}
                                >
                                    {rooms.map((room) => (
                                        <MenuItem
                                            key={room._id}
                                            value={room._id}
                                        >
                                            {room.roomName} (Capacity:{" "}
                                            {room.capacity})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Booking Date"
                                type="date"
                                fullWidth
                                onChange={handleDateChange}
                                value={bookingDate}
                                sx={{ marginBottom: 3 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                                <InputLabel id="slot-select-label">
                                    Available Slots
                                </InputLabel>
                                <Select
                                    labelId="slot-select-label"
                                    id="slot-select"
                                    value={selectedSlot}
                                    label="Available Slots"
                                    onChange={handleSlotChange}
                                >
                                    {availableSlots.map((slot) => (
                                        <MenuItem
                                            key={slot.name}
                                            value={slot.name}
                                        >
                                            {slot.startTime} - {slot.endTime}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    backgroundColor: "rgba(6,129,175,0.93)",
                                    "&:hover": { backgroundColor: "#0e6890" },
                                }}
                            >
                                Book Room
                            </Button>
                            <Box sx={{ mt: 4 }}>
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
                                <Box>
                                    {displaySuccessAlert && (
                                        <Alert
                                            severity="success"
                                            onClose={() =>
                                                setDisplaySuccessAlert(false)
                                            }
                                        >
                                            <AlertTitle>Success</AlertTitle>
                                            Your booking was created
                                            successfully.
                                        </Alert>
                                    )}
                                    {displayFailureAlert && (
                                        <Alert
                                            severity="error"
                                            onClose={() =>
                                                setDisplayFailureAlert(false)
                                            }
                                        >
                                            <AlertTitle>Error</AlertTitle>
                                            Failed to create booking.
                                        </Alert>
                                    )}
                                    {displayMissingInfoAlert && (
                                        <Alert
                                            severity="error"
                                            onClose={() =>
                                                setDisplayMissingInfoAlert(
                                                    false
                                                )
                                            }
                                        >
                                            <AlertTitle>Error</AlertTitle>
                                            Please select a room, date, and time
                                            slot.
                                        </Alert>
                                    )}
                                    {displayPastDateAlert && (
                                        <Alert
                                            severity="error"
                                            onClose={() =>
                                                setDisplayPastDateAlert(false)
                                            }
                                        >
                                            <AlertTitle>Error</AlertTitle>
                                            Please select a current or future date for the booking.
                                        </Alert>
                                    )}
                                </Box>
                                
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
};
export default RoomBookings;
