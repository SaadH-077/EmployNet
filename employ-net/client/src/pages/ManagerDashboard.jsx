import React, { useContext, useEffect, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
    CssBaseline,
    Box,
    Toolbar,
    Typography,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/UserContext";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import CardActionArea from "@mui/material/CardActionArea";
import { Card, CardContent } from "@mui/material";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    BlobProvider,
} from "@react-pdf/renderer";
import axios from "axios";
import logo from "../components/logo.js";
import Layout from "../components/layout.jsx";

// This file represents the Employee Dashboard Page, displaying user-specific statistics such as remaining leaves,
// join date, and days at the company. It utilizes React Bootstrap for styling, useContext hook for accessing user context,
// and useNavigate hook for navigation. The component also logs the number of days the user has been at the company.

const theme = createTheme({
    palette: {
        primary: {
            main: "rgba(6,129,175,0.93)",
            dark: "#0E6890",
            light: "#e1bee7",
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: "#0e6890",
                    color: "white",
                },
                body: {
                    backgroundColor: "#FFFFFF",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(6,129,175,0.93)",
                    "&:hover": {
                        backgroundColor: "#0E6890",
                    },
                },
            },
        },
    },
});

const WelcomeCard = styled(Card)(({ theme }) => ({
    backgroundColor: "#FFFFFF", // White background color
    color: theme.palette.primary.dark, // Dark blue text color
    border: `2px solid ${theme.palette.primary.dark}`, // Dark blue outline
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center",
}));

// To be Adjusted once manager Provides the Data
const performanceData = [
    { month: "Jan", score: 8 },
    { month: "Feb", score: 7.5 },
    { month: "Mar", score: 9 },
    { month: "Apr", score: 7 },
    { month: "May", score: 8.5 },
    { month: "Jun", score: 9 },
    { month: "Jul", score: 8 },
    { month: "Aug", score: 7.5 },
    { month: "Sep", score: 9 },
    { month: "Oct", score: 7 },
    { month: "Nov", score: 8.5 },
    { month: "Dec", score: 9.5 },
];

const PerformanceLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
        </LineChart>
    </ResponsiveContainer>
);

const QuickActionButton = ({ title, onClick }) => {
    return (
        <Card
            sx={{
                width: { xs: "70vw", md: "30%" }, // Set width of the card
                // minWidth: 368,
                backgroundColor: "rgba(6,129,175,0.93)",
                "&:hover": { backgroundColor: "#0e6890" }, // Even darker purple on hover
                m: 1,
                color: "white", // Ensuring text color is white for better readability
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <Typography
                        sx={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "500",
                            fontFamily: "roboto",
                        }}
                        variant="body2"
                        gutterBottom
                    >
                        {title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

const ManagerDashboardPage = () => {
    let navigate = useNavigate();
    const { user, setUser } = useContext(usercontext);
    console.log("User:", user);

    useEffect(() => {
        const getUpdatedUser = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/manager/manager-info/${user._id}`,
                    { withCredentials: true }
                );
                console.log("Response from api:", response.data);
                setUser(response.data.message);
            } catch (error) {
                console.error("Error during fetching user:", error);
            }
        };
        getUpdatedUser();
    }, []);

    const navigateToLeaveRequest = () => {
        navigate("/view-leave-requests");
        console.log("Navigate to Leave Request");
    };

    const navigateToUpdateProfile = () => {
        navigate("/manager-update");
        console.log("Navigate to Update Profile");
    };

    // Adding the useState hooks for the payslip
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [payslipContent, setPayslipContent] = useState(null);

    const navigateToRequestPayslip = async () => {
        console.log("Navigate to Request Payslip");
        // Simply getting the payslip information from the server
        try {
            const response = await axios.get(
                `https://employnet.onrender.com/api/payslip/request-payslip/${user._id}`,
                { withCredentials: true }
            );
            console.log("Response from api:", response.data);
            setPayslipContent(response.data); // Set the payslip content
            setShowPayslipModal(true); // Show the modal
        } catch (error) {
            console.error("Error during request payslip:", error);
        }
    };

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentMonth = monthNames[new Date().getMonth()];

    const [daysPresent, setDaysPresent] = useState(null);
    const [monthlyHoursWorked, setMonthlyHoursWorked] = useState(null);

    const getEmployeeAttendance = async () => {
        try {
            const response = await axios.get(
                `https://employnet.onrender.com/api/attendance/retrieve-attendance/${user._id}`,
                { withCredentials: true }
            );
            console.log("Response from api:", response.data);
            setDaysPresent(response.data.record.totalDaysPresent);
            setMonthlyHoursWorked(response.data.record.totalMonthlyHoursWorked);
        } catch (error) {
            console.error("Error during attendance:", error);
        }
    };

    const PayslipModal = () => {
        const { user, setUser } = useContext(usercontext);
        const styles = StyleSheet.create({
            page: {
                fontFamily: "Helvetica",
                padding: 30,
            },
            header: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
            },
            logo: {
                width: 100,
                height: 100,
            },
            titleContainer: {
                textAlign: "center",
                alignItems: "center",
            },
            title: {
                fontSize: 24,
                fontWeight: "bold",
            },
            subtitle: {
                fontSize: 16,
            },
            timestamp: {
                fontSize: 12,
                textAlign: "right",
            },
            section: {
                marginTop: 30,
            },
            table: {
                display: "table",
                width: "auto",
            },
            tableRow: {
                margin: "auto",
                flexDirection: "row",
                marginBottom: 15,
            },
            tableCol: {
                width: "25%",
            },
            tableCell: {
                margin: "auto",
                marginTop: 5,
                fontSize: 10,
            },
            footer: {
                marginTop: "auto",
                padding: 10,
                fontSize: 10,
                alignItems: "center",
            },
            footerTitle: {
                fontWeight: "bold",
                textAlign: "center",
            },
            footerSubTitle: {
                textAlign: "center",
            },
            line: {
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginTop: 2.5,
                marginBottom: 10,
            },
            personalInfo: {
                marginBottom: 20,
                marginVertical: 10,
                fontSize: 10,
            },
            tableRowInfo: {
                margin: "auto",
                flexDirection: "row",
                marginBottom: 15,
                justifyContent: "flex-end",
            },
            tableColInfo: {
                width: "75%",
            },
        });

        const PayslipDocument = () => {
            // Call the getEmployeeAttendance function to get the attendance data
            getEmployeeAttendance();

            return (
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View style={styles.header}>
                            <Image style={styles.logo} src={logo} />
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>SALARY SLIP</Text>
                                <Text style={styles.subtitle}>
                                    Salary Slip for the month of {currentMonth}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.timestamp}>
                                    {new Date().toLocaleDateString("en-US", {
                                        timeZone: "Asia/Karachi",
                                    })}
                                </Text>
                                <Text style={styles.timestamp}>
                                    {new Date().toLocaleTimeString("en-US", {
                                        timeZone: "Asia/Karachi",
                                    })}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.line} />

                        <View style={styles.personalInfo}>
                            <View style={styles.tableRowInfo}>
                                <View style={styles.tableColInfo}>
                                    <Text>
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Name:
                                        </Text>{" "}
                                        {user.FirstName} {user.LastName}
                                    </Text>
                                    <Text>
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Role:
                                        </Text>{" "}
                                        {user.Role}
                                    </Text>
                                    <Text>
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Employee ID:
                                        </Text>{" "}
                                        {user._id}
                                    </Text>
                                    <Text>
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Email:
                                        </Text>{" "}
                                        {user.Email}
                                    </Text>
                                </View>
                                <View style={styles.tableColInfo}>
                                    <Text>
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Date of Joining:
                                        </Text>{" "}
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString("en-US", {
                                            timeZone: "Asia/Karachi",
                                        })}
                                    </Text>
                                    <Text>
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Total Working Days:
                                        </Text>{" "}
                                        {daysPresent}
                                    </Text>
                                    <Text>
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Total Hours Worked:
                                        </Text>{" "}
                                        {Math.round(monthlyHoursWorked)} hours
                                    </Text>
                                    <Text>
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Days at Organization:
                                        </Text>{" "}
                                        {Math.floor(
                                            (new Date() -
                                                new Date(user.createdAt)) /
                                                (1000 * 60 * 60 * 24)
                                        )}{" "}
                                        days
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.line} />
                        <View style={styles.table}>
                            <Text style={{ fontSize: 10, marginLeft: 50 }}>
                                {" "}
                                <Text style={{ textDecoration: "underline" }}>
                                    Basic Salary:
                                </Text>
                            </Text>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {" "}
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Base Salary:
                                        </Text>
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        PKR {payslipContent.message.baseSalary}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 10, marginLeft: 50 }}>
                                {" "}
                                <Text style={{ textDecoration: "underline" }}>
                                    Deductions:
                                </Text>
                            </Text>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {" "}
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Income Tax:
                                        </Text>
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {" "}
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            E.O.B.I:
                                        </Text>
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        PKR{" "}
                                        {payslipContent.message.incomeTax *
                                            payslipContent.message.baseSalary}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        PKR{" "}
                                        {0.01 *
                                            payslipContent.message.baseSalary}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 10, marginLeft: 50 }}>
                                {" "}
                                <Text style={{ textDecoration: "underline" }}>
                                    Net Salary:
                                </Text>
                            </Text>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {" "}
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Net Salary:
                                        </Text>
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        PKR{" "}
                                        {payslipContent.message.baseSalary -
                                            payslipContent.message.baseSalary *
                                                payslipContent.message
                                                    .incomeTax -
                                            0.01 *
                                                payslipContent.message
                                                    .baseSalary}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.footer}>
                            <Text style={styles.footerTitle}>
                                This is a computer generated slip and hence
                                requires no Signature.
                            </Text>
                            <Text style={styles.footerSubTitle}>
                                LAHORE UNIVERSITY OF MANAGEMENT SCIENCES, Lahore
                                Phone No: (042)35608000
                            </Text>
                            <Text>
                                URL : https://www.lums.edu.pk email:
                                employnetlums@gmail.com
                            </Text>
                        </View>
                    </Page>
                </Document>
            );
        };

        const openInNewTab = (blobUrl) => {
            const win = window.open(blobUrl, "_blank");
            win.focus();
        };

        return (
            <Dialog
                open={showPayslipModal}
                onClose={() => setShowPayslipModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Payslip</DialogTitle>
                {payslipContent && (
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="h6">
                                Date:{" "}
                                {new Date(
                                    payslipContent.message.date
                                ).toLocaleDateString("en-US", {
                                    timeZone: "Asia/Karachi",
                                })}
                            </Typography>
                            <Typography variant="body1">
                                Base Salary: PKR{" "}
                                {payslipContent.message.baseSalary}
                            </Typography>
                            <Typography variant="body1">
                                Income Tax:{" "}
                                {payslipContent.message.incomeTax * 100}%
                            </Typography>
                            <Typography variant="body1">
                                Net Salary: PKR{" "}
                                {payslipContent.message.baseSalary -
                                    payslipContent.message.baseSalary *
                                        payslipContent.message.incomeTax}
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                )}
                <DialogActions>
                    <BlobProvider document={<PayslipDocument />}>
                        {({ blob, url, loading, error }) => (
                            <Button
                                color="primary"
                                onClick={() => openInNewTab(url)}
                                disabled={loading}
                            >
                                {loading
                                    ? "Loading document..."
                                    : "Open Payslip"}
                            </Button>
                        )}
                    </BlobProvider>
                    <Button
                        onClick={() => setShowPayslipModal(false)}
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const rows = [
        { field: "Name", value: `${user.FirstName} ${user.LastName}` },
        {
            field: "Date of Joining",
            value: new Date(user.createdAt).toLocaleDateString("en-US", {
                timeZone: "Asia/Karachi",
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        },
        {
            field: "Days at Company",
            value: Math.floor(
                (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
            ),
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Layout pageTitle="Manager Dashboard">
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />

                    <Box
                        component="main"
                        sx={{
                            display: "flex",
                        }}
                    >
                        <Container maxWidth="lg" sx={{ mb: 4 }}>
                            <Grid container spacing={3}>
                                {/* Welcome Banner */}
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            width: { xs: "80vw", md: "100%" },
                                        }}
                                    >
                                        <WelcomeCard sx={{ width: "inherit" }}>
                                            <CardContent>
                                                <Typography
                                                    variant="h3"
                                                    component="div"
                                                    fontSize="2rem"
                                                    gutterBottom
                                                >
                                                    Welcome, {user.FirstName}!
                                                </Typography>
                                            </CardContent>
                                        </WelcomeCard>
                                    </Box>
                                </Grid>

                                {/* Quick Actions */}
                                <Grid
                                    item
                                    container
                                    xs={12}
                                    justifyContent="center"
                                >
                                    <QuickActionButton
                                        title="View Employees' Leave Requests"
                                        onClick={navigateToLeaveRequest}
                                    />

                                    <QuickActionButton
                                        title="Request Payslip"
                                        onClick={navigateToRequestPayslip}
                                    />
                                </Grid>

                                {/* Information Table */}
                                <Grid item xs={12}>
                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            width: { xs: "80vw", md: "100%" },
                                        }}
                                    >
                                        <Table
                                            // sx={{ minWidth: 650 }}
                                            aria-label="simple table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {rows.map((row) => (
                                                        <TableCell
                                                            key={row.field}
                                                            align="left"
                                                        >
                                                            {row.field}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    {rows.map((row) => (
                                                        <TableCell
                                                            key={row.field}
                                                            align="left"
                                                        >
                                                            {row.value}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <PayslipModal />
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </Layout>
        </ThemeProvider>
    );
};

export default ManagerDashboardPage;
