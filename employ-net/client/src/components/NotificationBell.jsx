import React, { useState, useEffect, useContext } from "react";
import { IconButton, Badge, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { usercontext } from "../context/UserContext";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);

    const { user, setUser } = useContext(usercontext);
    // console.log("User in NotificationBell:", user);
    

    //i need to fetch the notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if(!user) return;
            const userID = user._id;
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/notifications/fetch-notifications/${userID}`, 
                    { withCredentials: true }
                );

                // console.log("Notifications response:", response);
                // console.log(
                //     "Notifications response success:",
                //     response.data.success
                // ); 
                if (response.data.success === true) {
                    // console.log(
                    //     "Setting notifications to",
                    //     response.data.notifications
                    // );
                    setNotifications(response.data.notifications);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        // Fetch notifications initially
        setTimeout(fetchNotifications, 100);    // Fetch notifications after some time to give the system time to load the checkin status etc

        // Fetch notifications every 10 seconds
        const intervalId = setInterval(fetchNotifications, 10 * 1000);

        // Cleanup interval
        return () => clearInterval(intervalId);
    }, []);

    const handleDeleteNotification = async (index) => {
        try {
            //get the actual backend index of this notification object
            const notification_to_delete = notifications[index];
            const actual_index = notification_to_delete.notif_index;

            // Delete the notification at the specified index
            const newNotifications = [...notifications];
            newNotifications.splice(index, 1);
            setNotifications(newNotifications);

            console.log("Actual index of notif to delete:", actual_index);
            if(!user) return;
            const userID = user._id;
            // Send a request to the server to delete the notification
            await axios.delete(
                `https://employnet.onrender.com/api/notifications/delete-notification/${userID}/${actual_index}`,
                { withCredentials: true }

            );
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    //frontend stuff here
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick} color="inherit">
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {notifications.length >0 ? notifications.map((notification, index) => (
                    <MenuItem key={index}>
                        {notification.content}
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleDeleteNotification(index)}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </MenuItem>
                )): <MenuItem>No notifications to display at this moment</MenuItem>}
            </Menu>
        </div>
    );
};

export default NotificationBell;
