import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { usercontext } from "../context/UserContext";
import PersonIcon from "@mui/icons-material/Person";
import Layout from "../components/layout.jsx";
import {
    Box,
    Card,
    Button,
    Typography,
    Avatar,
    Tab,
    Tabs,
    Paper,
    Grid,
    CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a custom theme
const darkBlueTheme = createTheme({
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

const ManagerInformationView = () => {
    const { user } = useContext(usercontext);
    const [userInfo, setUserInfo] = React.useState({});
    const [value, setValue] = useState(0);

    // Getting the employee team ID from the user context
    const teamID = user.teamId;

    // Fetching the manager information using the team ID
    useEffect(() => {
        const fetchManagerInfo = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/manager/manager-info-team/${teamID}`,
                    { withCredentials: true }
                );
                setUserInfo(response.data.message);
                console.log(
                    "Logging Manager Info to Console: ",
                    response.data.message
                );
            } catch (error) {
                console.error("Error fetching manager info:", error);
            }
        };

        if (teamID) {
            fetchManagerInfo();
        }
    }, [teamID]);

    const PersonalTabContent = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" align="center">
                    Manager Information
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Email:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.Email
                        ? userInfo.Email
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>First Name:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.FirstName
                        ? userInfo.FirstName
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Last Name:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.LastName
                        ? userInfo.LastName
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Address:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.Address
                        ? userInfo.Address
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>City:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.City
                        ? userInfo.City
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Gender:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.Gender
                        ? userInfo.Gender
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Date of Birth:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.DateOfBirth
                        ? new Date(userInfo.DateOfBirth).toLocaleDateString(
                              "en-US"
                          )
                        : "N/A"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Phone Number:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.PhoneNumber
                        ? userInfo.PhoneNumber
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Role:</strong>{" "}
                    {userInfo.Visibility &&
                        userInfo.Visibility.Role &&
                        (userInfo.Role === "employee" ? "Employee" : "Manager")}
                </Typography>
            </CardContent>
        </Card>
    );

    const renderTabContent = (index) => {
        switch (index) {
            case 0:
                return <PersonalTabContent />;
            default:
                return null;
        }
    };

    return (
        <Layout pageTitle="Manager's Information">
            {/* <ThemeProvider theme={darkBlueTheme}> */}
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
                                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Centers the children horizontally
                    }}
                >
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                            <Card>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{ width: 100, height: 100, mb: 2 }}
                                        src="https://tse3.mm.bing.net/th?id=OIP.NVgDAkBBANO4lnKq3Xqg1wHaHa&pid=Api&P=0&h=220"
                                    />
                                    <Typography variant="h5" gutterBottom>
                                        {userInfo.FirstName} {userInfo.LastName}
                                    </Typography>
                                    <Tabs
                                        value={value}
                                        aria-label="Manager information tabs"
                                        sx={{
                                            mb: 1,
                                            "& .MuiTabs-indicator": {
                                                backgroundColor:
                                                    "rgba(6,129,175,0.93)",
                                            },
                                        }}
                                    >
                                        <Tab
                                            icon={
                                                <PersonIcon
                                                    sx={{
                                                        color: darkBlueTheme
                                                            .palette.primary
                                                            .main,
                                                    }}
                                                />
                                            }
                                            // label="Manager Information"
                                            sx={{
                                                color: "blue",
                                                "&:hover": { color: "#0e6890" },
                                                "&.Mui-selected": {
                                                    color: "#0e6890",
                                                }, // This changes the color of the selected tab
                                            }}
                                        />
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            {renderTabContent(value)}
                        </Grid>
                    </Grid>
                </Box>
            {/* </ThemeProvider> */}
        </Layout>
    );
};

export default ManagerInformationView;
