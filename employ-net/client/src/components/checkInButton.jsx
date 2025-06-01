import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";

// This component represents a button for users to check in or out.
// It utilizes the useContext hook to access user context and determine the user's ID for API requests.
// Depending on the user's check-in and check-out status, the button's variant and onClick event are dynamically set.
// The handleCheckIn and handleCheckOut functions make API calls to the backend to record check-in and check-out times respectively.
// Feedback regarding the success or failure of the check-in/check-out process is logged to the console.
// Additionally, when both check-in and check-out are done, a placeholder function bothDone is invoked.
// Bootstrap's Button component is used for styling and user interaction.

const CheckInButton = ({triggerRefresh}) => {
    const { user, setUser, checkInStatus, setCheckInStatus } =
        useContext(usercontext);

    const employeeID = user._id;

    useEffect(() => {
      
        const fetchCheckInStatus = async () => {
            
            try {
                console.log("Sending Get Request to fetch checkin status");

                // Make an API call to get the check-in status from the backend
                const response = await axios.get(
                    `https://employnet.onrender.com/api/attendance/checkin-status/${employeeID}`, 
                    { withCredentials: true }
                );

                console.log("Response from checkin status api:", response.data);

                const checkInStatusFromBackend = response.data.checkInStatus;


                console.log("Sucess of fetch checkin", response.data.success);
                if (response.data.success) {
                    console.log(
                        "Checkin status from backend:",
                        checkInStatusFromBackend
                    );
                    setCheckInStatus(checkInStatusFromBackend);
                }

                // let model_roll =
                //     user.Role === "employee" ? "Employee" : "Manager";

                // //lets try sending user a notification about their checkin status
                // console.log("Sending checkin status notif to user");
                // const notification = {
                //     user: user._id,
                //     type: "standard",
                //     role: model_roll,
                //     content: `Your check-in status is ${checkInStatusFromBackend} at time ${new Date().toLocaleString()}`,
                // };

                // const notif_response = await axios.post(
                //     "https://employnet.onrender.com/api/notifications/send-notification",
                //     notification, { withCredentials: true }
                // );
                // console.log("Notif response:", notif_response);
            } catch (error) {
                console.error("Error fetching check-in status:", error);
            }
        };

        // Fetch check-in status initially
        fetchCheckInStatus();
    }, []);

    const handleCheckIn = async () => {
        console.log("Check-in clicked!");

        const date = new Date();
        const checkInTime = date.toISOString();

        console.log("Check-in time:", checkInTime);

        try {
            const response = await axios.post(
                `https://employnet.onrender.com/api/attendance/checkin/${employeeID}`, {},
                {withCredentials: true}
            );

            console.log("Response from check-in api:", response.data);

            if (response.data.success) {
                console.log("Check-in successful");
                setCheckInStatus("CheckedIn");
                triggerRefresh();   // to update charts
            }
        } catch (error) {
            console.error("Error during check-in:", error);
        }
    };

    const handleCheckOut = async () => {
        console.log("Check-out clicked!");

        const date = new Date();
        const checkOutTime = date.toISOString();

        console.log("Check-out time:", checkOutTime);

        try {
            const response = await axios.post(
                `https://employnet.onrender.com/api/attendance/checkout/${employeeID}`, {},
                {withCredentials: true}
            );

            console.log("Response from check-out api:", response.data);

            if (response.data.success) {
                console.log("Check-out successful");
                setCheckInStatus("CheckedOut");
                triggerRefresh();   // to update charts

            }
        } catch (error) {
            console.error("Error during check-out:", error);
        }
    };

    const bothDone = () => {
      console.log("checkin status",  checkInStatus);
        console.log("Both done");
    };

    return (
        <>
            <Button
                variant={
                    checkInStatus === "NotCheckedIn"
                        ? "success"
                        : checkInStatus === "CheckedIn"
                        ? "danger"
                        : "primary"
                }
                onClick={
                    checkInStatus === "NotCheckedIn"
                        ? handleCheckIn
                        : checkInStatus === "CheckedIn"
                        ? handleCheckOut
                        : bothDone
                }
                disabled={checkInStatus === "CheckedOut"} // Disable button if already checked out
            >
                {checkInStatus === "CheckedIn"
                    ? "Check Out"
                    : checkInStatus === "CheckedOut"
                    ? "Checked Out"
                    : "Check In"}
            </Button>
        </>
    );
};

export default CheckInButton;
