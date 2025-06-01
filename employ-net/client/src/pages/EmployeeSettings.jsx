import React from "react";
import Typography from "@mui/joy/Typography";
import { useState, useEffect, useContext } from "react";
import { usercontext } from "../context/UserContext.jsx";
import axios from "axios";
import { Switch, FormControlLabel, Button } from "@mui/material";
import SideNavBar from "../components/SideNavBar.jsx";
import TopBar from "../components/TopBar.jsx";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Layout from "../components/layout.jsx";

const VisibilitySettingsPage = () => {
    const { user } = useContext(usercontext);
    const [visibility, setVisibility] = useState({
        Email: true,
        FirstName: true,
        LastName: true,
        Address: true,
        City: true,
        Gender: true,
        DateOfBirth: true,
        PhoneNumber: true,
        PaidLeaves: true,
        RemainingLeaves: true,
        UnpaidLeaves: true,
        Role: true,
    });

    const employeeId = user._id;

    useEffect(() => {
        const fetchVisibilitySettings = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/emp/employee-info/${employeeId}/visibility`,
                    { withCredentials: true }
                );
                setVisibility(response.data.visibility);
            } catch (error) {
                console.error("Error fetching visibility settings:", error);
            }
        };

        fetchVisibilitySettings();
    }, [employeeId]);

    const handleVisibilityChange = (fieldName) => {
        setVisibility((prevVisibility) => ({
            ...prevVisibility,
            [fieldName]: !prevVisibility[fieldName],
        }));
    };

    const saveVisibilitySettings = async () => {
        try {
            await axios.put(
                `https://employnet.onrender.com/api/emp/employee-info/${employeeId}/visibility`,
                { visibility },
                { withCredentials: true }
            );
            console.log("Visibility settings for employee saved successfully!");
        } catch (error) {
            console.error("Error saving visibility settings:", error);
        }
    };

    return (
        <Layout pageTitle="Visibility Settings">
            <Box sx={{ display: "flex" }}>
                <Box
                    sx={{
                        width: {xs: "90%", md: "60%"},
                        margin: "auto",
                        paddingBottom: "120px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Card
                            sx={{
                                // width: "28rem",
                                padding: 5,
                                border: "2px solid #808080",
                            }}
                        >
                            <Box display="flex" justifyContent="center">
                                <VisibilityIcon
                                    sx={{ fontSize: 40, color: "rgba(6,129,175,0.93)" }}
                                />{" "}
                                {/* Purple visibility icon */}
                            </Box>
                            <Typography
                                variant="h5"
                                align="center"
                                gutterBottom
                                sx={{
                                    color: "#000000",
                                    fontWeight: "bold",
                                    fontFamily: "Arial",
                                }}
                            >
                                Visibility Settings
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Here you can adjust you personal information's
                                visibility to other members of your team
                            </Typography>

                            {Object.keys(visibility).map((fieldName) => (
                                <FormControlLabel
                                    key={fieldName}
                                    control={
                                        <Switch
                                            checked={visibility[fieldName]}
                                            onChange={() =>
                                                handleVisibilityChange(
                                                    fieldName
                                                )
                                            }
                                            // The color prop is not enough for a custom color, we need to use sx for that
                                            sx={{
                                                "& .MuiSwitch-switchBase.Mui-checked":
                                                    {
                                                        color: "rgba(6,129,175,0.93)", // Thumb color when checked
                                                    },
                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                    {
                                                        backgroundColor:
                                                            "rgba(6,129,175,0.93)", // Track color when checked
                                                    },
                                            }}
                                        />
                                    }
                                    label={fieldName}
                                    sx={{
                                        display: "flex",
                                        width: "100%",
                                        marginBottom: "10px",
                                    }}
                                />
                            ))}
                            <Button
                                onClick={saveVisibilitySettings}
                                variant="contained"
                                sx={{
                                    width: "100%",
                                    marginTop: "20px",
                                    bgcolor: "rgba(6,129,175,0.93)",
                                    "&:hover": {
                                        bgcolor: "#0e6890",
                                    },
                                }}
                            >
                                Save
                            </Button>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default VisibilitySettingsPage;
