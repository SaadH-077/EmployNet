import { Card, CardContent, Typography, Button, Box } from "@mui/material";

export default function attendanceDayCard({
    minutesWorked,
    hoursWorked,
    day,
    date,
    checkInTime,
    checkOutTime,
    checkInStatus,
    attendanceMarked,
}) {
    return (
        <Card >
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ width: "4rem", textAlign:"right"}}>
                        <Typography variant="h5" gutterBottom>
                            {day}
                        </Typography>
                        <Typography variant="h7" gutterBottom>
                            {date}
                        </Typography>
                    </Box>

                    <Box sx={{ width: "12rem"}}>
                        <Typography variant="h5" color="grey" gutterBottom>
                            {hoursWorked}h {minutesWorked}m
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            display={
                                checkInStatus === "Not Checked In"
                                    ? "none"
                                    : "block"
                            }
                            gutterBottom
                        >
                            {checkInTime} -{" "}
                            {checkOutTime !== "N/A" ? checkOutTime : ""}
                        </Typography>
                    </Box>

                    <Box sx={{ width: "12rem"}}>
                        <Typography
                            variant="overline"
                            color={
                                checkInStatus === "Not Checked In"
                                    ? "red"
                                    : checkInStatus === "Checked In"
                                    ? "blue"
                                    : "green"
                            }
                        >
                            {checkInStatus}
                        </Typography>
                    </Box>

                    <Box sx={{ width: "6rem"}}>
                        <Typography
                            variant="overline"
                        >
                            {attendanceMarked}
                        </Typography>
                    </Box>

                    {/* <Button
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
                    </Button> */}
                </Box>
            </CardContent>
        </Card>
    );
}
