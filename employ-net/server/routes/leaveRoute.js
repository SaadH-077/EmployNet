import express from "express";
import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import Attendance from "../models/attendanceModel.js";
import Notification from "../models/notificationModel.js";
import Team from "../models/teamModel.js";
import Leave from "../models/leaveModel.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Manager from "../models/managerModel.js";

const router = express.Router();

dotenv.config();

const HOURS_THRESHOLD = parseFloat(process.env.HOURS_THRESHOLD); // Parse as a floating-point number

// Creating a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

//Creating a route to send an email
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        });
        console.log("Email sent successfully");
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Internal server error" };
    }
};

const sendEmployeeNotification = async (employeeID, notif_content, type) => {
    //this function is to send notifications for the leaves that an employee gets automatically from their paid leaves
    try {
        // Find the user's notification record
        let notification_record = await Notification.findOne({
            user: employeeID,
        });

        // Create a new notification object
        let notification = {
            notif_index: notification_record.notifications.length,
            notif_type: type,
            content: notif_content,
            time: new Date().toLocaleString("en-US",  { timeZone: 'Asia/Karachi' }),
            isRead: false,
        };

        // Add the new notification to the user's notification record
        notification_record.notifications.unshift(notification);

        await notification_record.save();
        console.log("Sent notification to employee for leaves:", notification);
    } catch (error) {
        console.error("Error sending notification:", error);
        return;
    }
};

const sendManagerLeaveRequest = async (
    employeeID,
    reason,
    remainingLeavesList
) => {
    //this function is to send managers the employees' leave request so that they can use their unpaid leaves

    try {
        // Find the employee
        const employee = await Employee.findById(employeeID);
        if (!employee) {
            throw new Error("Employee not found");
        }

        // Find the team of the employee
        const team = await Team.findById(employee.teamId);
        if (!team) {
            throw new Error("Team not found");
        }

        // Find the manager of the team
        const managerId = team.managerId;

        // Create the leave request object
        const leaveRequest = {
            employeeId: employeeID,
            employeeFirstName: employee.FirstName,
            employeeLastName: employee.LastName,
            dateList: remainingLeavesList,
            reason: reason,
        };

        // Find the Leave document for the manager
        let leaveDoc = await Leave.findOne({ managerId: managerId });

        if (!leaveDoc) {
            // If the Leave document doesn't exist for the manager, create a new one
            leaveDoc = new Leave({ managerId: managerId, requests: [] });
        }

        // Add the leave request to the requests array
        leaveDoc.requests.push(leaveRequest);

        // Save the updated Leave document
        await leaveDoc.save();

        console.log("Leave request sent to manager successfully");

        //now send a notification that a new leave request has been received.
        let notification_record = await Notification.findOne({
            user: managerId,
        });

        // Create a new notification object
        const notification = {
            notif_index: notification_record.notifications.length,
            notif_type: "Leave Request",
            content: `You have received a new leave request from ${
                employee.FirstName
            } ${employee.LastName} for the period ${
                remainingLeavesList[0]
            } to ${remainingLeavesList[remainingLeavesList.length - 1]}.`,
            time: new Date().toLocaleString("en-US",  { timeZone: 'Asia/Karachi' }),
            isRead: false,
        };

        // Add the new notification to the user's notification record
        notification_record.notifications.unshift(notification);

        await notification_record.save();

        //send manager an email that they  have received leave request in portal
        const manager = await Manager.findById(managerId);

        const email_content = `Dear ${
            manager.FirstName
        },\n\nYou have received a new leave request from ${
            employee.FirstName
        } ${employee.LastName} for the period ${remainingLeavesList[0]} to ${
            remainingLeavesList[remainingLeavesList.length - 1]
        } in the EmployNet portal. You can view and respond to this request by logging into your portal and navigating to "View Leave Requests."\n\nRegards,\nEmployNet Team`;

        await sendEmail(manager.Email, "New Leave Request", email_content);

        console.log(
            "Sent notification for leave req to manager:",
            notification
        );
    } catch (error) {
        console.error("Error sending leave request to manager:", error);
    }
};

router.post("/request-leave", async (req, res) => {
    const { employeeID, startDate, endDate, reason, dateList } = req.body;

    let remainingLeavesList = [];
    let notif_content = "...";

    //retrieve the employee from the database
    try {
        let employee = await Employee.findById(employeeID);

        if (!employee) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }

        if (dateList.length === 0) {
            notif_content = "Your leave request contains no working days.";
            await sendEmployeeNotification(
                employeeID,
                notif_content,
                "Leave Invalid"
            );

            return res.json({
                success: true,
                message: "Leave request contains no working days",
            });
        }

        let approvedLeavesCount = Math.min(
            employee.PaidLeaves,
            dateList.length
        );

        let approved_leaves = dateList.slice(0, approvedLeavesCount);
        remainingLeavesList = dateList.slice(approvedLeavesCount);

        //Add the approved leaves to the attendance table
        for (const date of dateList.slice(0, approvedLeavesCount)) {
            const leaveMonth = date[0];
            const leaveYear = date.slice(-4);

            let attendance = await Attendance.findOne({
                userId: employeeID,
                month: leaveMonth,
                year: leaveYear,
            });

            if (!attendance) {
                attendance = new Attendance({
                    userId: employeeID,
                    month: leaveMonth,
                    year: leaveYear,
                    monthlyHoursWorked: [],
                });
            }

            // Check if the date already has an entry in monthlyHoursWorked
            const existingEntry = attendance.monthlyHoursWorked.find(
                (entry) => entry.date === date
            );

            if (!existingEntry) {
                // Add the leave entry only if it doesn't already exist
                attendance.monthlyHoursWorked.push({
                    date: date,
                    hoursWorked: 0,
                    attendanceStatus: "Paid Leave",
                });

                //add dummy hours so that payslip does not show any deductions for this day.
                attendance.totalMonthlyHoursWorked += HOURS_THRESHOLD;

                await attendance.save();
            } else {
                console.log(`Leave already marked for date ${date}`);
                approvedLeavesCount--;
                approved_leaves = approved_leaves.filter((d) => d !== date);
                //send notification for this:
                notif_content = `Your leave request for the date ${date} cannot be processed due to invalid date.`;
                await sendEmployeeNotification(
                    employeeID,
                    notif_content,
                    "Leave Invalid"
                );
            }
        }

        // Deduct the approved leaves from the employee's paid leaves count
        employee.PaidLeaves -= approvedLeavesCount;
        employee.RemainingLeaves = employee.PaidLeaves + employee.UnpaidLeaves;

        await employee.save();

        let email_subject = "";
        //for remaining leaves, send request to the manager
        if (remainingLeavesList.length > 0) {
            if (approvedLeavesCount > 0) {
                notif_content = `Your leave request from ${
                    approved_leaves[0]
                } to ${
                    approved_leaves[approved_leaves.length - 1]
                } has been approved from your paid leaves and the remaining unpaid leaves are pending manager approval.`;

                email_subject =
                    "Paid Leaves Granted and Unpaid Leaves Pending Approval";
            } else {
                notif_content = `Your leave request for unpaid leaves is pending manager approval.`;
                email_subject = "Unpaid Leaves Pending Approval";
            }

            sendManagerLeaveRequest(employeeID, reason, remainingLeavesList);
        } else {
            if (approvedLeavesCount > 0) {
                notif_content = `Your leave request from ${
                    approved_leaves[0]
                } to ${
                    approved_leaves[approved_leaves.length - 1]
                } has been approved from your paid leaves.`;

                email_subject = "Paid Leaves Granted";
            } else {
                notif_content = `Your leave request contained no valid dates.`;
                email_subject = "Leave Request Invalid";
            }
        }

        // Send a notification to the employee
        await sendEmployeeNotification(
            employeeID,
            notif_content,
            "Leave Granted"
        );

        //send an email for this notification
        const email_content = `Dear ${employee.FirstName},\n\n${notif_content}\n\nRegards,\nEmployNet Team`;

        await sendEmail(employee.Email, email_subject, email_content);

        res.json({
            success: true,
            message: "Paid leaves granted successfully",
        });
    } catch (error) {
        console.log("error", error);
        res.json({ success: false, message: "Internal server error" });
    }
});

router.get("/get-leave-requests/:userid", async (req, res) => {
    const userID = req.params.userid;

    try {
        const leave_record = await Leave.findOne({ managerId: userID });

        if (leave_record) {
            return res.json({ success: true, requests: leave_record.requests });
        }
        console.log("Leave Request Entry does not exist.");
        return res.json({
            success: true,
            requests: [],
        });
    } catch (error) {
        console.log("Error in getting leave requests", error);
        return res.json({ success: false, message: "Internal server error" });
    }
});

router.post("/approve-leave-request", async (req, res) => {
    const { request_id, manager_id, employeeId, dateList } = req.body;

    try {
        // Remove the leave request entry from the Leaves table
        const leave_record = await Leave.findOne({
            managerId: manager_id,
        });

        if (!leave_record) {
            console.log("Leave entry does not exist.");
            return res
                .status(404)
                .json({ success: false, message: "Leave request not found" });
        }

        //now from the requests array  in leave object, just delete the one request that has the request_id
        leave_record.requests = leave_record.requests.filter(
            (request) => request._id != request_id
        );

        await leave_record.save();

        // Calculate how many unpaid leaves the employee has
        console.log("deletedLeave record", leave_record);

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }

        const employeeUnpaidLeaves = employee.UnpaidLeaves;

        // Calculate how many of the employee's unpaid leaves can accommodate the dates in dateList
        let approvedLeavesCount = Math.min(
            employeeUnpaidLeaves,
            dateList.length
        );

        let approved_leaves = dateList.slice(0, approvedLeavesCount);

        // Add the approved leaves to the attendance table
        for (const date of dateList.slice(0, approvedLeavesCount)) {
            const leaveMonth = date[0];
            const leaveYear = date.slice(-4);

            let attendance = await Attendance.findOne({
                userId: employeeId,
                month: leaveMonth,
                year: leaveYear,
            });

            if (!attendance) {
                attendance = new Attendance({
                    userId: employeeId,
                    month: leaveMonth,
                    year: leaveYear,
                    monthlyHoursWorked: [],
                });
            }

            // Check if the date already has an entry in monthlyHoursWorked
            const existingEntry = attendance.monthlyHoursWorked.find(
                (entry) => entry.date === date
            );

            if (!existingEntry) {
                // Add the leave entry only if it doesn't already exist
                attendance.monthlyHoursWorked.push({
                    date: date,
                    hoursWorked: 0,
                    attendanceStatus: "Unpaid Leave",
                });

                await attendance.save();
            } else {
                console.log(`Leave already marked for date ${date}`);
                approvedLeavesCount--;
                approved_leaves = approved_leaves.filter((d) => d !== date);
                //send notification for this:
                const notif_content = `Your leave request for the date ${date} cannot be processed due to invalid date.`;
                await sendEmployeeNotification(
                    employeeId,
                    notif_content,
                    "Leave Invalid"
                );
            }
        }

        // Deduct the approved leaves from the employee's unpaid leaves count
        const remainingUnpaidLeaves =
            employeeUnpaidLeaves - approvedLeavesCount;

        // Update the employee's unpaid leaves count in the database
        employee.UnpaidLeaves = remainingUnpaidLeaves;
        employee.RemainingLeaves = employee.PaidLeaves + employee.UnpaidLeaves;

        await employee.save();

        // Send a notification to the employee
        let notif_content = "";
        let notif_type = "";

        if (approvedLeavesCount > 0) {
            notif_content = `Your leave request from ${approved_leaves[0]} to ${
                approved_leaves[approved_leaves.length - 1]
            } has been approved from your unpaid leaves.`;
            notif_type = "Leave Granted";
        } else {
            notif_content = `Your leave request has been rejected by the system as you have no more unpaid leaves remaining.`;
            notif_type = "Leave Rejected";
        }

        await sendEmployeeNotification(employeeId, notif_content, notif_type);

        //send an email for this notification
        const email_content = `Dear ${employee.FirstName},\n\n${notif_content}\n\nRegards,\nEmployNet Team`;
        await sendEmail(
            employee.Email,
            "Unpaid Leave Request Status",
            email_content
        );

        res.json({
            success: true,
            message: "Leave request approved successfully",
        });

        //NOTE: HAVE A LOOK AT THE CHECKIN ROUTES TO MAKE SURE THE PRE MADE ATTENDANCE ENTRIES DUE TO LEAVES DONT BREAK THAT CODE
    } catch (error) {
        console.error("Error approving leave request:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.post("/reject-leave-request", async (req, res) => {
    const { request_id, manager_id, employeeId, dateList } = req.body;

    try {
        // Remove the leave request entry from the Leaves table
        const leave_record = await Leave.findOne({
            managerId: manager_id,
        });

        if (!leave_record) {
            console.log("Leave entry does not exist.");
            return res
                .status(404)
                .json({ success: false, message: "Leave request not found" });
        }

        //now from the requests array  in leave object, just delete the one request that has the request_id
        leave_record.requests = leave_record.requests.filter(
            (request) => request._id != request_id
        );

        await leave_record.save();

        // Send a notification to the employee
        let notif_content = `Your leave request for unpaid leaves from ${
            dateList[0]
        } to ${
            dateList[dateList.length - 1]
        } has been rejected by the manager.`;
        let notif_type = "Leave Rejected";

        await sendEmployeeNotification(employeeId, notif_content, notif_type);

        //get the employee entry using ID to get their email address
        const employee = await Employee.findById(employeeId);

        //send an email for this notification
        const email_content = `Dear ${employee.FirstName},\n\n${notif_content}\n\nRegards,\nEmployNet Team`;
        await sendEmail(
            employee.Email,
            "Unpaid Leaves Denied by Manager",
            email_content
        );

        res.json({
            success: true,
            message: "Leave request rejected successfully",
        });

        //NOTE: HAVE A LOOK AT THE CHECKIN ROUTES TO MAKE SURE THE PRE MADE ATTENDANCE ENTRIES DUE TO LEAVES DONT BREAK THAT CODE
    } catch (error) {
        console.error("Error approving leave request:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.post("/get-month-leaves", async (req, res) => {
    console.log("req", req);
    const { employeeID, month, year } = req.body;
    console.log("employeeID", employeeID);
    console.log("month", month);
    console.log("year", year);

    try {
        let attendance = await Attendance.findOne({
            userId: employeeID,
            month: month,
            year: year,
        });

        if (!attendance) {
            return res.json({
                success: true,
                leaves: [],
            });
        }

        let leaves = attendance.monthlyHoursWorked.filter(
            (entry) =>
                entry.attendanceStatus == "Paid Leave" ||
                entry.attendanceStatus == "Unpaid Leave"
        );

        return res.json({
            success: true,
            leaves: leaves,
        });
    } catch (error) {
        console.error("Error getting month leaves:", error);
        return res.json({ success: false, message: "Internal server error" });
    }
});

export { router };
