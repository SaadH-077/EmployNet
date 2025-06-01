import React from "react";
import {
    Typography,
    Grid,
    Select,
    MenuItem,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Button,
} from "@mui/material";
import axios from "axios";
import Layout from "../components/layout";

const ViewApprovedLeaves = ({employeeId}) => {
    // Define state variables
    const [selectedMonth, setSelectedMonth] = React.useState(4);
    const [selectedYear, setSelectedYear] = React.useState(2024);
    const [leaveEntries, setLeaveEntries] = React.useState([]);

    console.log("EMP ID:", employeeId)

    // Function to handle form submission
    const handleSubmit = async () => {
        try {
            const req_info = {
                employeeID: employeeId,
                month: selectedMonth,
                year: selectedYear,
            };
            // Make API call to fetch leave entries based on selected month and year
            const response = await axios.post(
                `https://employnet.onrender.com/api/leave/get-month-leaves`,
                req_info,
                { withCredentials: true }
            );
            console.log("Response from view leaves api", response.data);
            if (response.data.success) {
                // Update leave entries with data from the API response
                setLeaveEntries(response.data.leaves);
            }
        } catch (error) {
            console.error("Error fetching leave entries:", error);
        }
    };

    handleSubmit();

    return (
            <Box>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h4">Approved Leaves</Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {/* Month dropdown options */}

                            <MenuItem value={1}>January</MenuItem>
                            <MenuItem value={2}>February</MenuItem>
                            <MenuItem value={3}>March</MenuItem>
                            <MenuItem value={4}>April</MenuItem>
                            <MenuItem value={5}>May</MenuItem>
                            <MenuItem value={6}>June</MenuItem>
                            <MenuItem value={7}>July</MenuItem>
                            <MenuItem value={8}>August</MenuItem>
                            <MenuItem value={9}>September</MenuItem>
                            <MenuItem value={10}>October</MenuItem>
                            <MenuItem value={11}>November</MenuItem>
                            <MenuItem value={12}>December</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <MenuItem value={2023}>2022</MenuItem>
                            <MenuItem value={2023}>2023</MenuItem>
                            <MenuItem value={2024}>2024</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: "rgba(6,129,175,0.93)",
                                "&:hover": { backgroundColor: "purple" },
                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>

                {/* Leave Entries */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaveEntries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        No leaves for selected month and year
                                    </TableCell>
                                </TableRow>
                            ) : (
                                // Render leave entries
                                leaveEntries.map((entry, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{entry.date}</TableCell>
                                        <TableCell>
                                            {entry.attendanceStatus}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
    );
};

export default ViewApprovedLeaves;
