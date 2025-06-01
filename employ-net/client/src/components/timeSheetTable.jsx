import React from "react";
import {
    Paper,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
    LinearProgress,
} from "@mui/material";
import ClockIcon from "@mui/icons-material/AccessTime"; // Just an example icon

const TimeSheetTable = () => {
    // Example timesheetData structure:
    // {
    //   days: [{ date: 'Mon, May 23', hours: '8h 00m' }, ...],
    //   clockedInTime: '7h 14m',
    //   weekHours: '15h 14m',
    //   payPeriodHours: '15h 14m',
    // }

    const timesheetData = {
        days: [
            { date: "Mon, May 23", hours: "8h 00m" },
            { date: "Tue, May 24", hours: "7h 14m" },
            { date: "Wed, May 25", hours: "0h 00m" },
            { date: "Thu, May 26", hours: "0h 00m" },
            { date: "Fri, May 27", hours: "0h 00m" },
            { date: "Sat, May 28", hours: "0h 00m" },
            { date: "Sun, May 29", hours: "0h 00m" },
        ],
        clockedInTime: "7h 14m",
        weekHours: "15h 14m",
        payPeriodHours: "15h 14m",
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ marginBottom: 2 }}>
                <Table size="small">
                    <TableBody>
                        {timesheetData.days.map((day) => (
                            <TableRow key={day.date}>
                                <TableCell component="th" scope="row">
                                    {day.date}
                                </TableCell>
                                <TableCell align="right">{day.hours}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Clocked In
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <ClockIcon color="action" />
                        <Typography variant="h4">
                            {timesheetData.clockedInTime}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                bgcolor: "rgba(6,129,175,0.93)",
                                "&:hover": {
                                    bgcolor: "purple",
                                },
                            }}
                        >
                            Clock Out
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        This Week
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h5">
                            {timesheetData.weekHours}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={60}
                            sx={{ 
                                width: "100%", 
                                '& .MuiLinearProgress-bar': { bgcolor: 'rgba(6,129,175,0.93)' } 
                            }}
                        />{" "}
                        {/* Use actual percentage here */}
                    </Box>
                </CardContent>
            </Card>

            {/* ... similarly for "This Pay Period" ... */}
        </Box>
    );
};

export default TimeSheetTable;
