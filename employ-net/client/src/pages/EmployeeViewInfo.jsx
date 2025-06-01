import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    Tab,
    Tabs,
    Grid,
    Paper,
    Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Layout from "../components/layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/UserContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import WorkIcon from "@mui/icons-material/Work"; // Import job-related icon

// This component displays user information retrieved from the backend API.
// It utilizes React Bootstrap components for styling and useContext hook for accessing user context.
// The useEffect hook is used to fetch user information from the API upon component mounting or when the employeeID changes.
// User information including email, name, address, gender, date of birth, phone number, leaves, and role are displayed.
// Additionally, there's a button provided to redirect users to the update information page.
// The layout is organized with a NavBar component at the top and a Card component in the center to display user information.

// Create a custom theme
const darkPurpleTheme = createTheme({
    palette: {
        mode: "dark", // Enable dark mode
        primary: {
            main: "rgba(6,129,175,0.93)", 
        },
        secondary: {
            main: "#FFFFFF", // White for secondary color
        },
        background: {
            default: "rgba(6,129,175,0.93)", 
            paper: "#000000",
        },
        text: {
            primary: "#FFFFFF", // White text for better readability
            secondary: "#EEEEEE",
        },
    },
    // You can also extend the theme with custom typography, components, etc.
});

const EmployeeViewInfo = () => {
    const navigate = useNavigate();
    const { user } = useContext(usercontext);
    const [userInfo, setUserInfo] = useState({});
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/emp/employee-info/${user._id}`,
                    { withCredentials: true }
                );
                setUserInfo(response.data.message);
                console.log(
                    "Logging User Info to Console: ",
                    response.data.message
                );
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        if (user._id) {
            fetchUserInfo();
        }
    }, [user._id]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const redirectToUpdate = () => {
        navigate("/employee-update");
    };

    // Render function for the personal tab
    const PersonalTabContent = () => (
        <Card>
            <CardContent>
                {/* Populate with personal information */}
                <Typography variant="h6" align="center">
                    Personal Information
                </Typography>
                {/* Add the rest of the personal info here */}
                <p>
                    <strong>Email:</strong> {userInfo.Email}
                </p>
                <p>
                    <strong>First Name:</strong> {userInfo.FirstName}
                </p>
                <p>
                    <strong>Last Name:</strong> {userInfo.LastName}
                </p>
                <p>
                    <strong>Address:</strong> {userInfo.Address}
                </p>
                <p>
                    <strong>City:</strong> {userInfo.City}
                </p>
                <p>
                    <strong>Gender:</strong> {userInfo.Gender}
                </p>
                <p>
                    {" "}
                    <strong>Date of Birth:</strong>{" "}
                    {userInfo.DateOfBirth
                        ? new Date(userInfo.DateOfBirth).toLocaleDateString("en-US",  { timeZone: 'Asia/Karachi' })
                        : "N/A"}
                </p>{" "}
                <p>
                    <strong>Phone Number:</strong> {userInfo.PhoneNumber}
                </p>
            </CardContent>
        </Card>
    );

    // Render function for the job tab
    const JobTabContent = () => (
        <Card>
            <CardContent>
                {/* Populate with job information */}
                <Typography variant="h6" align="center">
                    Job Information
                </Typography>
                {/* Add the rest of the job info here */}
                <p>
                    <strong>Paid Leaves:</strong> {userInfo.PaidLeaves}
                </p>
                <p>
                    <strong>Unpaid Leaves:</strong> {userInfo.UnpaidLeaves}
                </p>
                <p>
                    <strong>Total Remaining Leaves:</strong>{" "}
                    {userInfo.RemainingLeaves}
                </p>
                <p>
                    <strong>Role:</strong>{" "}
                    {userInfo.Role === "employee" ? "Employee" : "Manager"}
                </p>
            </CardContent>
        </Card>
    );

    // Function to render the tab content based on the selected tab index
    const renderTabContent = (index) => {
        switch (index) {
            case 0:
                return <PersonalTabContent />;
            case 1:
                return <JobTabContent />;
            default:
                return null; // or some default content
        }
    };

    return (
        <Layout pageTitle="Employee Personal Information">
            <Box sx={{ display: "flex" }}>
                <Box
                    component={Paper}
                    elevation={12}
                    square
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                    }}
                >
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Avatar
                                            sx={{ width: 100, height: 100 }}
                                            src="https://tse3.mm.bing.net/th?id=OIP.NVgDAkBBANO4lnKq3Xqg1wHaHa&pid=Api&P=0&h=220"
                                        />
                                        <Box sx={{ ml: 2 }}>
                                            <Typography variant="h5">
                                                {userInfo.FirstName}{" "}
                                                {userInfo.LastName}
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                <strong>Role: </strong>{userInfo.Role === "manager" ? "Manager" : "Employee"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                aria-label="Employee information tabs"
                                variant="fullWidth"
                                sx={{
                                    mb: 1,
                                    "& .MuiTabs-indicator": {
                                        backgroundColor: "rgba(6,129,175,0.93)",
                                    },
                                }}
                            >
                                <Tab
                                    icon={
                                        <PersonIcon
                                            sx={{
                                                color: darkPurpleTheme.palette
                                                    .primary.main,
                                            }}
                                        />
                                    }
                                    label="Personal"
                                    sx={{
                                        color: "rgba(6,129,175,0.93)",
                                        "&:hover": { color: "#0e6890" },
                                        "&.Mui-selected": { color: "#0e6890" }, // This changes the color of the selected tab
                                    }}
                                />
                                <Tab
                                    icon={
                                        <WorkIcon
                                            sx={{
                                                color: darkPurpleTheme.palette
                                                    .primary.main,
                                            }}
                                        />
                                    }
                                    label="Job"
                                    sx={{
                                        color: "rgba(6,129,175,0.93)",
                                        "&:hover": { color: "#0e6890" },
                                        "&.Mui-selected": { color: "#0e6890" }, // This changes the color of the selected tab
                                    }}
                                />
                            </Tabs>
                        </Grid>
                        {/* This Grid item will contain the content of the selected tab */}
                        <Grid item xs={12}>
                            {renderTabContent(value)}
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={redirectToUpdate}
                            sx={{
                                bgcolor: "rgba(6,129,175,0.93)",
                                "&:hover": {
                                    bgcolor: "#0e6890",
                                },
                            }}
                        >
                            Update Information
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default EmployeeViewInfo;
