import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    TextField,
    Button,
    createTheme,
    ThemeProvider,
} from "@mui/material";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";

const defaultTheme = createTheme();

function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const { user, setUser } = useContext(usercontext);
    const [otpAttempts, setOtpAttempts] = useState(0);

    const receivedOtp = location.state?.generatedOtp;
    const receivedString = location.state?.resetString;
    const receivedRole = location.state?.role;
    const receivedEmail = location.state?.email;
    // console.log(receivedOtp);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp === String(receivedOtp)) {
            if (receivedString === "reset") {
                navigate("/reset-password", {
                    state: { receivedEmail, receivedRole },
                });
            }

            navigateBasedOnRole(receivedRole);
        } else {
            // console.log(otpAttempts);
            // Handle invalid OTP case
            if (otpAttempts >= 2) {
                setUser(null);
                localStorage.removeItem("user");
                navigate("/");
            }

            setOtpAttempts(otpAttempts + 1);
            setError(String("Incorrect OTP. Please try again."));
        }
    };

    const navigateBasedOnRole = (role) => {
        if (role === "employee") {
            navigate("/employee-dashboard");
        } else if (role === "manager") {
            navigate("/manager-dashboard");
        } else {
            console.error("Invalid role:", role);
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
                    <Typography component="h1" variant="h5">
                        OTP Verification
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="otp"
                            label="Enter OTP"
                            type="text"
                            id="otp"
                            autoComplete="one-time-code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Verify OTP
                        </Button>
                        {error && (
                            <Typography
                                color="error"
                                variant="body2"
                                align="center"
                            >
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default OtpVerification;
