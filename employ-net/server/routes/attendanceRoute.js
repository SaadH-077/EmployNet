//In this file, I will define the routes for the attendance model.
import express from "express";
import Attendance from "../models/attendanceModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const HOURS_THRESHOLD = parseFloat(process.env.HOURS_THRESHOLD);

//check-in status
router.get("/checkin-status/:employeeID", async (req, res) => {
    console.log("Get Check-in status route");
    const employeeID = req.params.employeeID;
    const date = new Date().toLocaleDateString("en-US"); //this gives the localized date in m/d/yyyy format

    const test_time = new Date().toLocaleTimeString("en-US", {timeZone: 'Asia/Karachi'});
    console.log("Test time:", test_time);

    const currentMonth = date[0]; //this is the month
    const currentYear = date.slice(-4); //this is the year

    console.log("Current month:", currentMonth);
    console.log("Current year:", currentYear);
    console.log("local date:", date);
    console.log("type of local date", typeof date);

    try {
        const attendance = await Attendance.findOne({
            userId: employeeID,
            month: currentMonth,
            year: currentYear,
        });

        // console.log("Attendance:", attendance);

        if (attendance === null) {
            //if the attendance record does not exist for this month or this employee, then the employee is not checked in. Once they checkin, the record will be created.
            console.log("Employee's monthly entry does not exist yet");
            return res.json({ success: true, checkInStatus: "NotCheckedIn" });
        } else {
            console.log("Employee's monthly entry exists.");

            const attendance_date = attendance.date;
            console.log("Last logged attendance date:", attendance_date);

            console.log("Current date:", date);

            if (attendance_date === date) {
                //if the date is set to current date then the employee must at least be checked in
                console.log("The date has matched.");
                if (attendance.status === "Checked In") {
                    console.log("Employee is checked in.");
                    return res.json({
                        success: true,
                        checkInStatus: "CheckedIn",
                    });
                } else if (attendance.status === "Checked Out") {
                    console.log("Employee is checked out.");
                    return res.json({
                        success: true,
                        checkInStatus: "CheckedOut",
                    });
                } //this cant happen because if the date is set to today's date then there must have been a checkin today
                else {
                    console.log("Something is wrong in attendance records.");
                    return res.json({ success: false, checkInStatus: "error" });
                }
            } else {
                console.log("The dates have not matched.");
                console.log("Employee is not checked in.");
                if (attendance.status === "Checked In") {
                    console.log("Employee checked in but did not check out.");

                    //DISCUSS: What to do in this scenario??

                    //if an employee forgot to checkout the same day, we only count the hours worked till the min hours required for present and then automatically check them out
                    let new_entry = {
                        date: attendance_date,
                        hoursWorked: HOURS_THRESHOLD,
                        attendanceStatus: "Present",
                    };
                    attendance.monthlyHoursWorked.push(new_entry);
                    attendance.monthlyCheckOutTime.push({
                        date: attendance_date,
                        cOutTime: `Automatic Checkout After ${HOURS_THRESHOLD} hours`,
                    });
                    attendance.totalMonthlyHoursWorked += HOURS_THRESHOLD;
                    attendance.totalDaysPresent += 1;
                    attendance.status = "Checked Out";

                    const savedAttendance = await attendance.save();
                    console.log(
                        "Saved attendance when forgot to checkout:",
                        savedAttendance
                    );
                }
                return res.json({
                    success: true,
                    checkInStatus: "NotCheckedIn",
                });
            }
        }
    } catch (error) {
        console.error("Error fetching check-in status:", error);
        res.json({ checkInStatus: false });
    }
});

// Check-in route
router.post("/checkin/:employeeID", async (req, res) => {
    const employeeID = req.params.employeeID;

    const date = new Date().toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' }); //this gives the localized date in m/d/yyyy format
    const checkInTime = new Date(); //for checkin time i can use the non localized date because i really just need the difference between the times

    const currentMonth = date[0]; //this is the month
    console.log("Current month:", currentMonth);

    const currentYear = date.slice(-4); //this is the year

    const local_time = new Date().toLocaleTimeString("en-US", { timeZone: 'Asia/Karachi' });

    console.log("Current year:", currentYear);
    console.log("local date:", date);
    console.log("type of local date", typeof date);
    console.log("Check-in time:", checkInTime);
    console.log("Local time:", local_time);

    try {
        // Look for existing attendance record for the current employee and month
        let attendance = await Attendance.findOne({
            userId: employeeID,
            month: currentMonth,
            year: currentYear,
        });

        if (attendance) {
            // If attendance record exists, update check-in time and status
            attendance.checkInTime = checkInTime;
            attendance.status = "Checked In";
            attendance.date = date;

            attendance.monthlyCheckInTime.push({
                date: date,
                cInTime: local_time,
            });
        } else {
            // If attendance record doesn't exist, create a new one
            attendance = new Attendance({
                userId: employeeID,
                month: currentMonth,
                checkInTime: checkInTime,
                status: "Checked In",
                date: date,
                year: currentYear,
            });
            attendance.monthlyCheckInTime.push({
                date: date,
                cInTime: local_time,
            });
        }

        const savedAttendance = await attendance.save();

        // console.log("Saved attendance:", savedAttendance);

        res.json({ success: true, message: "Check-in successful" });
    } catch (error) {
        console.error("Error during check-in:", error);
        res.json({ success: false, message: "Check-in failed" });
    }
});

// Check-out route
router.post("/checkout/:employeeID", async (req, res) => {
    const employeeID = req.params.employeeID;

    const date = new Date().toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' });
    const local_time = new Date().toLocaleTimeString("en-US", { timeZone: 'Asia/Karachi' });

    const currentMonth = date[0]; //this is the month
    const currentYear = date.slice(-4); //this is the year

    const checkOutTime = new Date(); //again i only need this stamp for finding the difference with the checkin time, so doesnt need to be localized

    try {
        const attendance = await Attendance.findOne({
            //fetch the entry for this employee for that specific month
            userId: employeeID,
            month: currentMonth,
            year: currentYear,
        });

        // console.log("Attendance:", attendance);

        if (attendance) {
            attendance.checkOutTime = checkOutTime;
            attendance.status = "Checked Out";

            const checkInTime = attendance.checkInTime;

            console.log("Check-out time:", checkOutTime);
            console.log("Check-in time:", checkInTime);

            console.log("Time difference:", checkOutTime - checkInTime);

            let hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

            console.log(
                "Minutes Worked:",
                (checkOutTime - checkInTime) / 60000
            );
            console.log("Hours worked:", hoursWorked);

            if (hoursWorked >= HOURS_THRESHOLD) {
                //if the employee has worked for more than 8 hours, mark them present
                attendance.monthlyHoursWorked.push({
                    date: date,
                    hoursWorked: hoursWorked,
                    attendanceStatus: "Present",
                });

                attendance.totalDaysPresent += 1;
            } else {
                attendance.monthlyHoursWorked.push({
                    date: date,
                    hoursWorked: hoursWorked,
                    attendanceStatus: "Absent",
                });
            }

            attendance.monthlyCheckOutTime.push({
                date: date,
                cOutTime: local_time,
            });

            attendance.totalMonthlyHoursWorked += hoursWorked;

            const savedAttendance = await attendance.save();

            console.log("Saved attendance at checkout:", savedAttendance);

            res.json({ success: true, message: "Check-out successful" });
        } else {
            res.json({ success: false, message: "Check-out failed" });
        }
    } catch (error) {
        console.error("Error during check-out:", error);
        res.json({ success: false, message: "Check-out failed" });
    }
});

//this route handles view attendance. It returns the number of times the employee was present in the current month.
router.get("/view-attendance/:employeeID", async (req, res) => {
    const employeeID = req.params.employeeID;
    console.log("Employee ID:", employeeID);

    const date = new Date().toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' });
    const currentMonth = date[0];
    const currentYear = date.slice(-4);

    try {
        const attendance = await Attendance.findOne({
            //get attendance entries for this employee
            userId: employeeID,
            month: currentMonth,
            year: currentYear,
        });
        // console.log("Attendance:", attendance);

        if (attendance) {
            const days_present = attendance.totalDaysPresent;
            console.log("Attendance retrieved.", days_present);

            res.json({ success: true, days_present: days_present });
        } else {
            console.log(
                "Attendance hasnt started for this month yet so returning 0 with success status."
            );
            res.json({ success: true, days_present: 0 });
        }
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.json({ success: false, message: "Error fetching attendance" });
    }
});

//route to get whole attendance object
router.get("/retrieve-attendance/:employeeID", async (req, res) => {
    const employeeID = req.params.employeeID;
    // console.log("Employee ID:", employeeID);

    const date = new Date().toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' });
    const currentMonth = date[0];
    const currentYear = date.slice(-4);

    try {
        const attendance = await Attendance.findOne({
            //get attendance entries for this employee
            userId: employeeID,
            month: currentMonth,
            year: currentYear,
        });
        console.log(
            "Attendance object in get whole attendance route:",
            attendance
        );

        if (attendance) {
            res.json({ success: true, record: attendance });
        } else {
            console.log("attendance record for this month does not exist.");
            res.json({ success: false, message: "Error fetching attendance" });
        }
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.json({ success: false, message: "Error fetching attendance" });
    }
});

//api to return current minutes worked during the day
router.get("/current-minutes-worked/:employeeID", async (req, res) => {
    const employeeID = req.params.employeeID;

    const date = new Date().toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' });
    const currentMonth = date[0];
    const currentYear = date.slice(-4);

    try {
        const attendance = await Attendance.findOne({
            //get attendance entries for this employee
            userId: employeeID,
            month: currentMonth,
            year: currentYear,
        });
        // console.log(
        //     "Attendance object in get current minutes route:",
        //     attendance
        // );

        if (attendance) {
            const currentDate = new Date();

            const checkInTime = new Date(attendance.checkInTime);

            const isToday =
                checkInTime.getDate() === currentDate.getDate() &&
                checkInTime.getMonth() === currentDate.getMonth() &&
                checkInTime.getFullYear() === currentDate.getFullYear();

            console.log("Istoday", isToday);

            let minutes_passed = 0;

            if (isToday) {
                // Calculate the difference in milliseconds
                const timeDifference =
                    currentDate.getTime() - checkInTime.getTime();

                // Convert milliseconds to minutes
                minutes_passed = Math.floor(timeDifference / (1000 * 60));

                //if user has checked out, just return the minutes worked for this day from the monthlyHoursWorked array
                if (attendance.status === "Checked Out") {
                    console.log("User has checked out today");
                    const date_info = attendance.monthlyHoursWorked.filter(
                        (entry) => entry.date == date
                    );

                    if (date_info.length > 0) {
                        minutes_passed = date_info[date_info.length-1].hoursWorked * 60;
                    }
                }

                return res.json({
                    success: true,
                    minutes_passed: minutes_passed,
                    minutes_threshold: HOURS_THRESHOLD * 60,
                    message: "Accurate Timing",
                });
            }

            console.log("Hasnt checked in today");
            return res.json({
                success: true,
                minutes_passed: 0,
                minutes_threshold: HOURS_THRESHOLD * 60,
                message: "Check In first",
            });
        } else {
            console.log(
                "attendance record for this month in minutes API does not exist yet."
            );
            return res.json({
                success: true,
                minutes_passed: 0,
                minutes_threshold: HOURS_THRESHOLD * 60,
                message: "Check In first",
            });
        }
    } catch (error) {
        console.error("Error fetching minutes:", error);
        res.json({ success: false, message: "Error fetching minutes" });
    }
});

//api to get info about a particular date and employee
router.post("/given-date-info", async (req, res) => {
    const { employeeID, date } = req.body;

    console.log("Parameters in given date info:", employeeID, date);

    const formattedDate = new Date(date).toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' });

    const currentMonth = formattedDate[0];
    const currentYear = formattedDate.slice(-4);

    try {
        const attendance = await Attendance.findOne({
            //get attendance entries for this employee
            userId: employeeID,
            month: currentMonth,
            year: currentYear,
        });

        // function findElapsedTimeSinceCheckIn(inTime) {
        //     const currentDate = new Date();
        //     const checkInTime = new Date(inTime);

        //     let minutes_passed = 0;
        //     const timeDifference =
        //         currentDate.getTime() - checkInTime.getTime(); // Calculate the difference in milliseconds
        //     minutes_passed = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes
        //     return minutes_passed;
        // }

        if (attendance) {
            const date_info = attendance.monthlyHoursWorked.filter(
                (entry) => entry.date == formattedDate
            );
            const checkIn_info = attendance.monthlyCheckInTime.filter(
                (entry) => entry.date == formattedDate
            );
            const checkOut_info = attendance.monthlyCheckOutTime.filter(
                (entry) => entry.date == formattedDate
            );

            // console.log("Date info:", date_info);
            // console.log("CheckIn info:", checkIn_info);
            // console.log("CheckOut info:", checkOut_info);

            let total_minutes_worked = 0;
            let checkInTime = "N/A";
            let checkOutTime = "N/A";
            let attendanceStatus = "Absent";

            if (date_info.length > 0) {
                total_minutes_worked = date_info[date_info.length -1].hoursWorked * 60;
                attendanceStatus = date_info[date_info.length -1].attendanceStatus;
            }

            if (checkIn_info.length > 0) {
                checkInTime = checkIn_info[checkIn_info.length-1].cInTime;
            }

            if (checkOut_info.length > 0) {
                checkOutTime = checkOut_info[checkOut_info.length-1].cOutTime;
            }

            let statusMessage = "";
            if (checkInTime == "N/A") {
                statusMessage = "Not Checked In";
            } else if (checkOutTime == "N/A") {
                statusMessage = "Checked In"; // will only get triggered for current day
            } else {
                statusMessage = "Checked Out"; // For current and previous days, if user checked out
            }

            // console.log(
            //     "Total minutes worked:",
            //     total_minutes_worked,
            //     "CheckIn Time:",
            //     checkInTime,
            //     "CheckOut Time:",
            //     checkOutTime,
            //     "Attendance Status:",
            //     attendanceStatus,
            //     "Status Message:",
            //     statusMessage
            // );

            return res.json({
                success: true,
                minutes_worked: total_minutes_worked,
                checkInTime: checkInTime,
                checkOutTime: checkOutTime,
                attendanceStatus: attendanceStatus,
                statusMessage: statusMessage,
            });
            
        }

        return res.json({
            success: false,
            message: "No Info for this month at all",
        });
    } catch (error) {
        console.error("Error in given date info:", error);
        res.json({ success: false, message: "Error fetching given date info" });
    }
});

export { router };
 