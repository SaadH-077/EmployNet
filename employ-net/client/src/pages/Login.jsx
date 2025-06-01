import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";

import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/UserContext";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

// This component represents the login page for users. It utilizes Material-UI components for styling such as Avatar, Button, TextField, etc.
// The component includes form fields for users to input their email address, password, and select their role (employee or manager) using radio buttons.
// Upon submission, the form data is sent to the backend API endpoint for user authentication.
// The layout is organized with a Container component for overall structure and includes links for password reset and signup.
// Errors during login are displayed in a modal, and successful login redirects users to the homepage.
// User information is stored in local storage for persistence across sessions.
// The useEffect hook ensures that user data is fetched from local storage upon component mounting.

const two_factor = true;

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="#">
                LUMSxDevsinc
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
// Add comment

const defaultTheme = createTheme();

function Login() {
    const navigate = useNavigate();
    const { user, setUser, checkInStatus, setCheckInStatus } =
        useContext(usercontext);
    const [redirected, setRedirected] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [otp, setOtp] = useState(null);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otpInput, setOtpInput] = useState("");

   useEffect(() => {
        console.log("Checking local storage in login");
        if(localStorage.getItem("user")) {
            console.log("clearing User found in local storage");
            localStorage.removeItem("user");        //user shouldnt be able to press the back button to go back to the inside page without logging in again
            setUser(null);
        }
    }, []);

    const redirectToSignUp = () => {
        navigate("/signup");
    };

    const redirectToReset = async () => {
        const email = document.getElementById("username").value;
        const role = "employee";
        if (email) {
            try {
                // const otp = Math.floor(100000 + Math.random() * 900000);
                // const response = await axios.post(
                //     "https://employnet.onrender.com/api/authentication/reset1",
                //     { email, otp },
                //     { withCredentials: true }
                // );
                // const generatedOtp = otp;
                // const resetString = "reset";
                // if (response.data.success) {
                //     navigate("/otp", {
                //         state: { email, generatedOtp, resetString },
                //     });
                // } else {
                //     setErrorMessage(
                //         "Failed to send password reset email. Please try again."
                //     );
                //     setShowModal(true);
                // }
                navigate("/reset-password", {
                    state: { email, role },
                });
            } catch (error) {
                setErrorMessage("An error occurred. Please try again.");
                setShowModal(true);
            }
        } else {
            setErrorMessage(
                "Please enter your email address and select role to reset your password."
            );
            // setErrorMessage(String(model_roll))
            setShowModal(true);
        }
    };

    const ErrorModal = () => {
        return (
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form submitted");
        const formData = Object.fromEntries(new FormData(e.target));
        // formData.otp = otp
        // const username = formData.get("username").toLowerCase();

        // // Update the username in the formData
        // formData.set("username", username);
        formData.username = formData.username.toLowerCase();

        const generatedOtp = Math.floor(100000 + Math.random() * 900000);
        formData.otp = generatedOtp; // Add OTP to formData
        // console.log(formData);


        try {
            const response = await axios.post(
                "https://employnet.onrender.com/api/authentication/login",
                formData, {withCredentials: true}

            );

            // console.log("Response from api:", response.data);

            if (response.data.success) {
                setUser(response.data.user);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                // const otp = Math.floor(100000 + Math.random() * 900000);
                // console.log("OTP is: ", otp)
                if (two_factor) {
                    navigate("/otp", {
                        state: { generatedOtp, role: formData.role },
                    });
                    // setIsOtpModalOpen(true);
                } else {
                    if (response.data.user.Role === "employee") {
                        console.log("Redirecting to employee homepage");
                        navigate("/employee-dashboard");
                    } else if (response.data.user.Role === "manager") {
                        console.log("Redirecting to manager homepage");
                        navigate("/manager-dashboard");
                    } else {
                        console.error("Invalid role:", response.data.user.Role);
                    }
                }

                console.log("Login successful");
            } else {
                setErrorMessage(response.data.message);
                setShowModal(true);
                console.log("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h3">
                        Employ-Net
                    </Typography>
                    <Box sx={{ mb: 3 }} />

                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: "rgba(6,129,175,0.93)",
                            width: { xs: 36, sm: 50, md: 64 },
                            height: { xs: 36, sm: 50, md: 64 },
                        }}
                    >
                        <LockOutlinedIcon fontSize="large" />
                        {/* <img src="devsinc_logo.jpeg" alt="Custom" /> */}
                    </Avatar>

                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ fontFamily: "Arial" }}
                    >
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Email Address"
                            name="username"
                            autoComplete="email"
                            autoFocus
                            InputProps={{
                                style: { color: "#000000" },
                            }}
                            InputLabelProps={{
                                style: { color: "#000000" },
                            }}
                            sx={{
                                    "& label.Mui-focused": { color: "rgba(6,129,175,0.93)" },
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "rgba(6,129,175,0.93)",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: "rgba(6,129,175,0.93)",
                                        },
                                    },
                                }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            InputProps={{
                                style: { color: "#000000" },
                            }}
                            InputLabelProps={{
                                style: { color: "#000000" },
                            }}
                            sx={{
                                    "& label.Mui-focused": { color: "rgba(6,129,175,0.93)" },
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "rgba(6,129,175,0.93)",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: "rgba(6,129,175,0.93)",
                                        },
                                    },
                                }}
                        />
                        {/* Add some space before the radio button */}
                        <Box sx={{ mb: 1 }} />
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">
                            Role
                        </FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="role"
                            defaultValue="employee"
                            sx={{ justifyContent: "center" }}
                        >
                            <FormControlLabel
                                value="employee"
                                control={
                                    <Radio
                                        sx={{
                                            "&.Mui-checked": {
                                                color: "rgba(6,129,175,0.93)",
                                            },
                                        }}
                                    />
                                }
                                label="Employee"
                            />
                            <FormControlLabel
                                value="manager"
                                control={
                                    <Radio
                                        sx={{
                                            "&.Mui-checked": {
                                                color: "rgba(6,129,175,0.93)",
                                            },
                                        }}
                                    />
                                }
                                label="Manager"
                            />
                        </RadioGroup>
                        {/* <FormControlLabel
                            control={
                                <Checkbox value="remember" color="primary" />
                            }
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "rgba(6,129,175,0.93)",
                                "&:hover": { backgroundColor: "#0e6890" },
                            }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        redirectToReset();
                                    }}
                                    variant="body2"
                                    sx={{
                                        color: "rgba(6,129,175,0.93)",
                                        textDecorationColor: "rgba(6,129,175,0.93)",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        redirectToSignUp();
                                    }}
                                    variant="body2"
                                    sx={{
                                        color: "rgba(6,129,175,0.93)",
                                        textDecorationColor: "rgba(6,129,175,0.93)",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
                <ErrorModal />
            </Container>
        </ThemeProvider>
    );
}

export default Login;
