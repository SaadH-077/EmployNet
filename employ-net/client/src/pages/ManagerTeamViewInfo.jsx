import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Tab,
    Tabs,
    Grid,
    Paper,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import axios from "axios";
import Layout from "../components/layout.jsx";
import ViewEmployeeBenefitsAsManager from "../components/viewEmployeeBenefitsAsManager.jsx";
import EmployeeAdjustmentsAsManager from "../components/employeeAdjustmentsAsManager.jsx";
import EmployeeAttendanceViewAsManager from "../components/employeeAttendanceViewAsManager.jsx";
import ViewEmployeeLeavesAsManager from "../components/viewEmployeeLeavesAsManager.jsx";

const EmployeeViewInfo = () => {
    const [userInfo, setUserInfo] = useState({});
    const [value, setValue] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/emp/employee-info/${id}`,
                    { withCredentials: true }
                );
                setUserInfo(response.data.message);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        if (id) {
            fetchUserInfo();
        }
    }, [id]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const PersonalInfoTab = () => (
        <Card>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Employee Information
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
                        ? userInfo.DateOfBirth
                            ? new Date(userInfo.DateOfBirth).toLocaleDateString(
                                  "en-US",
                                  { timeZone: "Asia/Karachi" }
                              )
                            : "N/A"
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Phone Number:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.PhoneNumber
                        ? userInfo.PhoneNumber
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Alotted Paid Leaves:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.PaidLeaves
                        ? userInfo.PaidLeaves
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Allotted Unpaid Leaves:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.UnpaidLeaves
                        ? userInfo.UnpaidLeaves
                        : "Hidden"}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <strong>Remaining Leaves:</strong>{" "}
                    {userInfo.Visibility && userInfo.Visibility.RemainingLeaves
                        ? userInfo.RemainingLeaves
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

    const JobInfoTab = () => (
        <Card>
            <Box mt={2}>
                <ViewEmployeeBenefitsAsManager employeeId={id} />
            </Box>
        </Card>
    );

    const AdjustmentTab = () => (
        <Card>
            <Box mt={2}>
                <EmployeeAdjustmentsAsManager employeeId={id} />
            </Box>
        </Card>
    );

    const AttendanceTab = () => (
        <Card>
            <Box mt={2}>
                <EmployeeAttendanceViewAsManager paramEmployeeId={id} />
            </Box>
        </Card>
    );

    const LeavesTab = () => (
        <Card>
            <Box mt={2}>
                <ViewEmployeeLeavesAsManager employeeId={id} />
            </Box>
        </Card>
    );

    return (
        <Layout pageTitle="Employee Information">
            <Box
                component={Paper}
                elevation={12}
                square
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: "100%", // Ensure it takes the full width of its parent
                    maxWidth: "90vw", // Ensure it doesn't exceed the width of the viewport
                    // overflowX: 'hidden', // Hide horizontal overflow
                }}
            >
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="Employee information tabs"
                            variant="scrollable" // Enable scrollable tabs
                            scrollButtons="auto" // Show scroll buttons automatically when needed
                            allowScrollButtonsMobile // Allow scroll buttons on mobile devices
                        >
                            <Tab
                                id="personal"
                                icon={<PersonIcon />}
                                label="Personal"
                            />
                            <Tab
                                id="job"
                                icon={<WorkIcon />}
                                label="Job/Benefits"
                            />
                            <Tab
                                id="salary"
                                icon={<AttachMoneyIcon />}
                                label="Salary/Benefits Adjustment"
                            />
                            <Tab
                                id="attendance"
                                icon={<AccessTimeIcon />}
                                label="Attendance Information"
                            />
                            <Tab
                                id="leaves"
                                icon={<TimeToLeaveIcon />}
                                label="Leaves Schedule"
                            />
                        </Tabs>
                    </Grid>
                    <Grid item xs={12}>
                        {value === 0 ? (
                            <PersonalInfoTab />
                        ) : value === 1 ? (
                            <JobInfoTab />
                        ) : value === 2 ? (
                            <AdjustmentTab />
                        ) : value === 3 ? (
                            <AttendanceTab />
                        ) : (
                            <LeavesTab />
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default EmployeeViewInfo;
