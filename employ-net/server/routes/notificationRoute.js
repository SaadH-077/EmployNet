//In this file, I will define the routes for the notification system.
import express from "express";
import Notification from "../models/notificationModel.js";

const router = express.Router();

//fetch notifications
router.get("/fetch-notifications/:userID", async (req, res) => {
    try {
        const userID = req.params.userID;

        // Fetch notifications for the specified user
        const notification_record = await Notification.findOne({
            user: userID,
        });

        // console.log("Notifications:", notification_record);

        if (notification_record === null) {
            return res.json({ success: true, notifications: [] });
        }

        res.json({
            success: true,
            notifications: notification_record.notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.json({ success: false, error: "Failed to fetch notifications" });
    }
});

//send notification to a user
router.post("/send-notification", async (req, res) => {
    try {
        const { user, type, role, content } = req.body;

        console.log("User", user)

        // Find the user's notification record
        const notification_record = await Notification.findOne({ user: user });

        console.log("Notification record:", notification_record)
        
        // If the user has no notification record, create a new one
        if (notification_record === null) {
            console.log("Creating new notification record for user", user)
            // Create a new notification object
            const notification = {
                notif_index: 0,
                notif_type: type,
                content: content,
                time: new Date().toLocaleString("en-US",  { timeZone: 'Asia/Karachi' }),
                isRead: false,
            };

            const new_notification_record = new Notification({
                user: user,
                userModel: role, //should be either "Employee" or "Manager"
                notifications: [notification],
            });

            await new_notification_record.save();
            console.log("Sent notification:", notification);
        } else {
            // Create a new notification object
            const notification = {
                notif_index: notification_record.notifications.length,
                notif_type: type,
                content: content,
                time: new Date().toLocaleString("en-US",  { timeZone: 'Asia/Karachi' }),
                isRead: false,
            };

            // Add the new notification to the user's notification record
            notification_record.notifications.unshift(notification);
            await notification_record.save();
            console.log("Sent notification:", notification);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error sending notification in the send API:", error);
        res.json({ success: false, error: "Failed to send notification" });
    }
});

//delete notification
router.delete("/delete-notification/:userID/:index", async (req, res) => {
    try {
        const userID = req.params.userID;
        const notif_index = req.params.index;

        console.log(
            "Deleting notification at index",
            notif_index,
            "for user",
            userID
        );

        // Find the user's notification record
        const notification_record = await Notification.findOne({
            user: userID,
        });

        // Delete the notification at the specified index
        // console.log(
        //     "Notifications before deletion:",
        //     notification_record.notifications
        // );

        const indexToDelete = notification_record.notifications.findIndex(
            (notification) => notification.notif_index == notif_index
        );

        if (indexToDelete !== -1) {
            // Delete the notification at the found index
            notification_record.notifications.splice(indexToDelete, 1);

            // console.log(
            //     "Notifications after deletion:",
            //     notification_record.notifications
            // );

            await notification_record.save();

            console.log("Deleted notification with notif_index", notif_index);
            return res.json({ success: true });
        } else {
            console.log(
                "Notification with notif_index",
                notif_index,
                "not found"
            );
            return res.json({
                success: false,
                error: "Notification not found",
            });
        }
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.json({ success: false, error: "Failed to delete notification" });
    }
});

export { router };
