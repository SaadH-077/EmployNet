import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import SideNavBar from "../components/SideNavBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { usercontext } from "../context/UserContext";
import { useContext } from "react";
import axios from "axios";
import Layout from "../components/layout.jsx";

const ViewLeaveRequests = () => {
    const { user, setUser } = useContext(usercontext);
    const [items, setItems] = useState([]);
    const [expandedItemId, setExpandedItemId] = useState(null); // State to track the expanded item ID

    // Function to fetch items (you can replace it with your actual API call)
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/leave/get-leave-requests/${user._id}`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    console.log("Response for leave reqs:", response.data);
                    setItems(response.data.requests);
                } else {
                    console.error(
                        "Failed to fetch leave requests:",
                        response.data.error
                    );
                }
            } catch (error) {
                console.error("Error fetching leave requests:", error);
            }
        };

        fetchItems();
    }, []);

    // Function to handle view button click
    const handleViewClick = (id) => {
        setExpandedItemId((prevId) => (prevId === id ? null : id)); // Toggle expanded item ID
    };

    const handleApproveClick = async (index) => {
        let target_item = items[index];

        console.log("target_item,", target_item);

        try {
            let req_info = {
                request_id: target_item._id,
                manager_id: user._id,
                employeeId: target_item.employeeId,
                dateList: target_item.dateList,
            };

            console.log("request info", req_info);

            const response = await axios.post(
                "https://employnet.onrender.com/api/leave/approve-leave-request",
                req_info,
                { withCredentials: true }
            );
            if (response.data.success) {
                // Handle success
                console.log("Leave request approved successfully");
                // Remove the item from the list
                setItems((prevItems) =>
                    prevItems.filter((item, i) => i !== index)
                );
            } else {
                console.error(
                    "Failed to approve or successfully reject leave request."
                );
            }
        } catch (error) {
            console.error("Error approving or rejecting leave request:", error);
        }
    };

    const handleRejectClick = async (index) => {
        let target_item = items[index];

        console.log("target_item in reject button,", target_item);

        try {
            let req_info = {
                request_id: target_item._id,
                manager_id: user._id,
                employeeId: target_item.employeeId,
                dateList: target_item.dateList,
            };

            console.log("request info", req_info);

            const response = await axios.post(
                "https://employnet.onrender.com/api/leave/reject-leave-request",
                req_info,
                { withCredentials: true }
            );
            if (response.data.success) {
                // Handle success
                console.log("Leave request rejected successfully");
                // Remove the item from the list
                setItems((prevItems) =>
                    prevItems.filter((item, i) => i !== index)
                );
            } else {
                console.error("Failed to successfully reject leave request.");
            }
        } catch (error) {
            console.error("Error approving or rejecting leave request:", error);
        }
    };

    const renderItems = () => {
        return items.map((item, index) => (
            <Grid key={index} item xs={12}>
                <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {item.employeeFirstName} {item.employeeLastName}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            ID: {item.employeeId}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            From {item.dateList[0]} to{" "}
                            {item.dateList[item.dateList.length - 1]}
                        </Typography>
                        {expandedItemId === item.id && ( // Check if the item is expanded
                            <Typography variant="body2" color="text.secondary">
                                {item.reason}
                            </Typography>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 2,
                            }}
                        >
                            <Button
                                onClick={() => handleViewClick(item.id)}
                                variant="outlined"
                                size="small"
                            >
                                {expandedItemId === item.id
                                    ? "Hide Reason"
                                    : "View Reason"}
                            </Button>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    onClick={() => handleApproveClick(index)}
                                    variant="contained"
                                    size="small"
                                    color="success"
                                >
                                    Approve
                                </Button>
                                <Button
                                    onClick={() => handleRejectClick(index)}
                                    variant="contained"
                                    size="small"
                                    color="error"
                                >
                                    Reject
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        ));
    };

    return (
        <Layout pageTitle="Employees' Leave Requests">
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <SideNavBar drawerWidth={240} />
                <Container sx={{ pt: 15, flexGrow: 1 }}>
                    <Grid container spacing={4}>
                        {items.length > 0 ? (
                            renderItems()
                        ) : (
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ textAlign: "center", width: "100%" }}
                            >
                                No leave requests found
                            </Typography>
                        )}
                    </Grid>
                </Container>
            </Box>
        </Box>
        </Layout>
    );
};

export default ViewLeaveRequests;
