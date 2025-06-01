// import React, { useContext, useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "axios";
// import { usercontext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import {
//     Box,
//     Container,
//     Card,
//     CardContent,
//     Typography,
//     TextField,
//     Button,
//     Alert,
//     AlertTitle,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit"; // Icon for editing information
// import Layout from "../components/layout";

// const InformationUpdate = () => {
//     const { user, setUser } = useContext(usercontext);
//     const employeeID = user._id;
//     let navigate = useNavigate();
//     const [errorMessage, setErrorMessage] = useState("");
//     const [userInfo, setUserInfo] = useState({
//         FirstName: "",
//         LastName: "",
//         Address: "",
//         City: "",
//         Gender: "",
//         DateOfBirth: "",
//         PhoneNumber: "",
//     });
//     const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);
//     const [displayFailureAlert, setDisplayFailureAlert] = useState(false);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const response = await axios.get(`https://employnet.onrender.com/api/emp/employee-info/${employeeID}`, { withCredentials: true });
//                 console.log("Response from API:", response.data.message);

//                 setUserInfo({
//                     FirstName: response.data.message.FirstName || "",
//                     LastName: response.data.message.LastName || "",
//                     Address: response.data.message.Address || "",
//                     City: response.data.message.City || "",
//                     PhoneNumber: response.data.message.PhoneNumber || "",
//                     Gender: response.data.message.Gender || "",
//                     DateOfBirth: formatDate(response.data.message.DateOfBirth) || "",
//                 });
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         };

//         fetchUserData();
//     }, [employeeID]);

//     function formatDate(unformattedDate) {
//         const date = new Date(unformattedDate);
//         const year = date.getFullYear();
//         let month = date.getMonth() + 1; // getMonth() returns month from 0 to 11
//         let day = date.getDate();

//         // if month less than 10, prepend a '0'
//         if (month < 10) month = "0" + month;

//         // if day less than 10, prepend a '0'
//         if (day < 10) day = "0" + day;

//         return `${year}-${month}-${day}`;
//     }

//     const validateForm = () => {
//         if (
//             userInfo.FirstName.trim() === "" ||
//             userInfo.LastName.trim() === "" ||
//             userInfo.Address.trim() === "" ||
//             userInfo.City.trim() === "" ||
//             userInfo.Gender.trim() === "" ||
//             userInfo.DateOfBirth.trim() === "" ||
//             userInfo.PhoneNumber.trim() === ""
//         ) {
//             setErrorMessage("No field can be empty.");
//             return false;
//         } else if (!/^[a-zA-Z]+$/.test(userInfo.FirstName)) {
//             setErrorMessage("First name must contain only letters.");
//             return false;
//         } else if (!/^[a-zA-Z]+$/.test(userInfo.LastName)) {
//             setErrorMessage("Last name must contain only letters.");
//             return false;
//         } else if (/^\d+$/.test(userInfo.Address)) {
//             setErrorMessage("Address cannot be just numbers.");
//             return false;
//         } else if (/\d/.test(userInfo.City)) {
//             setErrorMessage("City cannot contain numbers.");
//             return false;
//         } else if (!/^\d+$/.test(userInfo.PhoneNumber)){
//             setErrorMessage("Phone number must only contain numbers.");
//             return false;
//         }
//         else {
//             const currentDate = new Date();
//             const selectedDate = new Date(userInfo.DateOfBirth);
//             const ageDiffMs = currentDate - selectedDate;
//             const ageDate = new Date(ageDiffMs);
//             const userAge = Math.abs(ageDate.getUTCFullYear() - 1970);

//             if (selectedDate > currentDate) {
//                 setErrorMessage("Date of birth cannot be in the future.");
//                 return false;
//             } else if (userAge < 18) {
//                 setErrorMessage("You must be at least 18 years old.");
//                 return false;
//             } else {
//                 setErrorMessage("");
//                 return true;
//             }
//         }
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         const formData = new FormData(e.target);
//         const updatedData = Object.fromEntries(formData);

//         try {
//             const response = await axios.put(
//                 `https://employnet.onrender.com/api/emp/employee-update/${employeeID}`,
//                 updatedData,
//                 { withCredentials: true }
//             );
//             console.log("Response from api:", response.data);
//             setDisplaySuccessAlert(true);
//             setUser(response.data.message);
//             navigate(-1);
//         } catch (error) {
//             console.error("Error during update:", error);
//             setDisplayFailureAlert(true);
//         }
//     };

//     const handleCancel = () => {
//         navigate(-1);
//     };

//     return (
//         <Layout pageTitle="Update Personal Information">
//             <Box sx={{ display: "flex" }}>
//                 <Container component="main" sx={{ mb: 4 }}>
//                     <Card sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 2 }}>
//                         <CardContent>
//                             <Box display="flex" justifyContent="center">
//                                 <EditIcon
//                                     sx={{ fontSize: 40, color: "rgba(6,129,175,0.93)" }}
//                                 />
//                             </Box>
//                             <Typography
//                                 variant="h5"
//                                 component="div"
//                                 align="center"
//                                 gutterBottom
//                             >
//                                 Update Personal Information
//                             </Typography>
//                             <Box
//                                 component="form"
//                                 onSubmit={handleUpdate}
//                                 noValidate
//                                 sx={{ mt: 1 }}
//                             >
//                                 <TextField
//                                     margin="dense"
//                                     required
//                                     fullWidth
//                                     id="FirstName"
//                                     label="First Name"
//                                     name="FirstName"
//                                     autoComplete="FirstName"
//                                     value={userInfo.FirstName}
//                                     onChange={(e) => setUserInfo({...userInfo, FirstName: e.target.value})}
//                                 />
//                                 <TextField
//                                     margin="dense"
//                                     required
//                                     fullWidth
//                                     id="LastName"
//                                     label="Last Name"
//                                     name="LastName"
//                                     autoComplete="LastName"
//                                     value={userInfo.LastName}
//                                     onChange={(e) => setUserInfo({...userInfo, LastName: e.target.value})}
//                                 />
//                                 <TextField
//                                     margin="dense"
//                                     required
//                                     fullWidth
//                                     id="Address"
//                                     label="Address"
//                                     name="Address"
//                                     autoComplete="Address"
//                                     value={userInfo.Address}
//                                     onChange={(e) => setUserInfo({...userInfo, Address: e.target.value})}
//                                 />
//                                 <TextField
//                                     margin="dense"
//                                     required
//                                     fullWidth
//                                     id="City"
//                                     label="City"
//                                     name="City"
//                                     autoComplete="City"
//                                     value={userInfo.City}
//                                     onChange={(e) => setUserInfo({...userInfo, City: e.target.value})}
//                                 />
//                                 <TextField
//                                     margin="dense"
//                                     required
//                                     fullWidth
//                                     id="PhoneNumber"
//                                     label="Phone Number"
//                                     name="PhoneNumber"
//                                     autoComplete="PhoneNumber"
//                                     value={userInfo.PhoneNumber}
//                                     onChange={(e) => setUserInfo({...userInfo, PhoneNumber: e.target.value})}
//                                 />
//                                 <TextField
//                                     margin="dense"
//                                     required
//                                     fullWidth
//                                     select
//                                     id="Gender"
//                                     label="Gender"
//                                     name="Gender"
//                                     value={userInfo.Gender}
//                                     onChange={(e) => setUserInfo({...userInfo, Gender: e.target.value})}
//                                     SelectProps={{ native: true }}
//                                 >
//                                     <option value="">Select Gender</option>
//                                     <option value="Male">Male</option>
//                                     <option value="Female">Female</option>
//                                     <option value="Other">Other</option>
//                                 </TextField>
//                                 <TextField
//                                     margin="dense"
//                                     required
//                                     fullWidth
//                                     id="DateOfBirth"
//                                     label="Date of Birth"
//                                     name="DateOfBirth"
//                                     type="date"
//                                     value={userInfo.DateOfBirth}
//                                     onChange={(e) => setUserInfo({...userInfo, DateOfBirth: e.target.value})}
//                                 />
//                                 <Button
//                                     type="submit"
//                                     fullWidth
//                                     variant="contained"
//                                     sx={{
//                                         bgcolor: "rgba(6,129,175,0.93)",
//                                         "&:hover": {
//                                             bgcolor: "primary.dark",
//                                         },
//                                         mt: 3,
//                                         mb: 2,
//                                     }}
//                                 >
//                                     Confirm Changes
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     fullWidth
//                                     color="error"
//                                     onClick={handleCancel}
//                                     sx={{ mt: 1 }}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Box>
//                             {displaySuccessAlert && (
//                                 <Alert
//                                     severity="success"
//                                     onClose={() => setDisplaySuccessAlert(false)}
//                                     sx={{ width: "100%", mt: 2 }}
//                                 >
//                                     <AlertTitle>Success</AlertTitle>
//                                     Your information has been updated successfully.
//                                 </Alert>
//                             )}
//                             {displayFailureAlert && (
//                                 <Alert
//                                     severity="error"
//                                     onClose={() => setDisplayFailureAlert(false)}
//                                     sx={{ width: "100%", mt: 2 }}
//                                 >
//                                     <AlertTitle>Error</AlertTitle>
//                                     An error occurred while updating your information.
//                                 </Alert>
//                             )}
//                             {errorMessage && (
//                                 <Alert severity="error" sx={{ mt: 2 }}>
//                                     {errorMessage}
//                                 </Alert>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </Container>
//             </Box>
//         </Layout>
//     );
// };

// export default InformationUpdate;

import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { usercontext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import EditIcon from "@mui/icons-material/Edit"; // Icon for editing information
import Box from "@mui/material/Box";

const InformationUpdate = () => {
    const { user } = useContext(usercontext);
    const employeeID = user._id;
    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [userInfo, setUserInfo] = useState({
        FirstName: "",
        LastName: "",
        Address: "",
        City: "",
        Gender: "",
        DateOfBirth: "",
        PhoneNumber: "",
    });

    function formatDate(unformattedDate) {
        const date = new Date(unformattedDate);
        const year = date.getFullYear();
        let month = date.getMonth() + 1; // getMonth() returns month from 0 to 11
        let day = date.getDate();

        // if month less than 10, prepend a '0'
        if (month < 10) month = "0" + month;

        // if day less than 10, prepend a '0'
        if (day < 10) day = "0" + day;

        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/emp/employee-info/${employeeID}`,
                    { withCredentials: true }
                );
                // console.log("TEST:", response.data.message.FirstName);
                // setUserInfo(response.data.message);
                console.log("Response from api1:", response.data.message);

                setUserInfo((prevUserInfo) => ({
                    ...prevUserInfo,
                    FirstName: response.data.message.FirstName,
                    LastName: response.data.message.LastName,
                    Address: response.data.message.Address,
                    City: response.data.message.City,
                    PhoneNumber: response.data.message.PhoneNumber,
                    Gender: response.data.message.Gender,
                    DateOfBirth: formatDate(response.data.message.DateOfBirth),
                }));

                console.log("Updated first name:", userInfo.FirstName);
                console.log("Updated gender:", userInfo.Gender);
                console.log("Updated date of birth:", userInfo.DateOfBirth);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [employeeID]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = Object.fromEntries(formData);

        // Validating first name, last name, and city
        if (!/^[A-Za-z\s]+$/.test(updatedData.FirstName)) {
            setErrorMessage("First name can only contain letters and spaces.");
            return;
        }
        if (!/^[A-Za-z\s]+$/.test(updatedData.LastName)) {
            setErrorMessage("Last name can only contain letters and spaces.");
            return;
        }
        if (
            updatedData.City !== "" &&
            !/^[A-Za-z\s]+$/.test(updatedData.City)
        ) {
            // non compulsory fields
            setErrorMessage("City can only contain letters and spaces.");
            return;
        }

        if (
            updatedData.PhoneNumber !== "" &&
            !/^\d+$/.test(updatedData.PhoneNumber)
        ) {
            // non compulsory fields
            setErrorMessage("Phone number can only contain numbers.");
            return;
        }

        // Validating date of birth
        if (updatedData.DateOfBirth === "") {
            setErrorMessage("Date of birth cannot be empty.");
            return;
        }
        const currentDate = new Date();
        const selectedDate = new Date(updatedData.DateOfBirth);
        if (selectedDate > currentDate) {
            setErrorMessage("Date of birth cannot be in the future.");
            return;
        }

        userInfo.PhoneNumber = String(userInfo.PhoneNumber);

        console.log("Updated data:", updatedData);
        console.log("User info:", userInfo);

        const isDataUnchanged = Object.keys(updatedData).every((key) => {
            return (
                userInfo[key] === updatedData[key] ||
                (userInfo[key] === undefined && !updatedData[key])
            );
        });

        if (isDataUnchanged) {
            setErrorMessage(
                "No field has been changed, click cancel to keep existing information."
            );
            return;
        }

        setErrorMessage("");

        try {
            const response = await axios.put(
                `https://employnet.onrender.com/api/emp/employee-update/${employeeID}`,
                updatedData,
                { withCredentials: true }
            );
            console.log("Response from api:", response.data);
            navigate("/employee-info"); // Adjust the path as needed
        } catch (error) {
            console.error("Error during update:", error);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <>
            <Layout pageTitle="Employee Update Information">
                <Container
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{ minHeight: "80vh" }}
                >
                    <Card style={{ width: {xs: "90%", md: "60%"} }} className="p-3">
                        <Box display="flex" justifyContent="center">
                            <EditIcon
                                sx={{
                                    fontSize: 40,
                                    color: "rgba(6,129,175,0.93)",
                                }}
                            />
                        </Box>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                Update Personal Information
                            </Card.Title>
                            <p className="text-center">
                                Update fields as needed; leave others as it is
                                to retain current information.
                            </p>

                            {errorMessage && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {errorMessage}
                                </div>
                            )}

                            <Form onSubmit={handleUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        id="firstName"
                                        name="FirstName"
                                        type="text"
                                        // placeholder="First Name"
                                        defaultValue={userInfo.FirstName}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        id="lastName"
                                        name="LastName"
                                        type="text"
                                        // placeholder="Last Name"
                                        defaultValue={userInfo.LastName}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        id="address"
                                        name="Address"
                                        type="text"
                                        // placeholder="Address"
                                        defaultValue={userInfo.Address}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        id="city"
                                        name="City"
                                        type="text"
                                        // placeholder="City"
                                        defaultValue={userInfo.City}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control
                                        id="gender"
                                        as="select"
                                        name="Gender"
                                        value={userInfo.Gender}
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                Gender: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        id="dateOfBirth"
                                        name="DateOfBirth"
                                        type="date"
                                        defaultValue={userInfo.DateOfBirth}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        id="phoneNumber"
                                        name="PhoneNumber"
                                        type="tel"
                                        // placeholder="Phone Number"
                                        defaultValue={userInfo.PhoneNumber}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-center">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="me-2"
                                    >
                                        Confirm Changes
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </Layout>
        </>
    );
};

export default InformationUpdate;
