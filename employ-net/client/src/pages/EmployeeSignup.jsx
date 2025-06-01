import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CircularProgress from "@mui/joy/CircularProgress";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const defaultTheme = createTheme();

function EmployeeSignup() {
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState("");
    const [dobError, setDOBError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [surnameError, setSurnameError] = useState("");
    const [team, setTeam] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(dayjs()); // Initialize with current date or specific default
    const [teamError, setTeamError] = useState("");
    const [displayCircularProcessing, setDisplayCircularProcessing] =
        useState(false);
    const [teamOptions, setTeamOptions] = useState([]);

    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const isNameValid = (name) => {
        return /^[a-zA-Z]+$/.test(name.trim());
    };

    const isPasswordStrong = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(password);
        const hasMinLength = password.length >= 8;
        return hasUpperCase && hasSpecialChar && hasMinLength;
    };

    const submitHandler = async (e) => {
        setDisplayCircularProcessing(true);
        e.preventDefault();
        let formData = Object.fromEntries(new FormData(e.target));
        const { firstName, surname, email, password, selectedTeam } = formData;
        formData.dateOfBirth = dateOfBirth.toDate();
        formData.email = email.trim().toLowerCase();
        console.log("Form data:", formData);
    
        let hasError = false;
    
        if (!firstName.trim()) {
            setFirstNameError("First name cannot be empty.");
            hasError = true;
        } else if (!isNameValid(firstName)) {
            setFirstNameError("First name can only contain letters.");
            hasError = true;
        } else {
            setFirstNameError("");
        }
    
        if (!surname.trim()) {
            setSurnameError("Surname cannot be empty.");
            hasError = true;
        } else if (!isNameValid(surname)) {
            setSurnameError("Surname can only contain letters.");
            hasError = true;
        } else {
            setSurnameError("");
        }
    
        if (!isEmailValid(email)) {
            setEmailError("Please enter a valid email address.");
            hasError = true;
        } else {
            setEmailError("");
        }
    
        if (!isPasswordStrong(password)) {
            setPasswordError(
                "Password is too weak. It must contain at least one capital letter, one special character, and be at least 8 characters long."
            );
            hasError = true;
        } else {
            setPasswordError("");
        }
    
        // Validate date of birth
        const currentDate = dayjs();
        const selectedDate = dateOfBirth;
        if (selectedDate.isAfter(currentDate, "day")) {
            setDOBError("Date of birth cannot be in the future.");
            hasError = true;
        } else {
            setDOBError("");
        }
    
        if (!selectedTeam.trim()) {
            setTeamError("Please select a team.");
            hasError = true;
        } else {
            setTeamError("");
        }
    
        if (hasError) {
            setDisplayCircularProcessing(false);
            return;
        }
    
        try {
            const response = await axios.post(
                "https://employnet.onrender.com/api/authentication/employee-signup",
                formData,
                { withCredentials: true }
            );
            console.log("Response from api:", response.data);
    
            if (response.data.success) {
                console.log("Signup successful");
                navigate("/");
            }
        } catch (error) {
            setDisplayCircularProcessing(false);
            if (
                error.response.status === 400 &&
                error.response.data.message === "User already exists"
            ) {
                setEmailError("User already exists");
            } else {
                console.error("Error during signup:", error);
            }
        }
    };
    
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

    useEffect(() => {
        // Fetch team names from backend
        axios
            .get("https://employnet.onrender.com/api/authentication/teams-list", {
                withCredentials: true,
            })
            .then((response) => {
                const teamNames = response.data.message;
                console.log("Team names:", teamNames);
                const options = teamNames.map((teamName, idx) => {
                    return (
                        <Option key={idx} value={teamName}>
                            {teamName}
                        </Option>
                    );
                });
                setTeamOptions(options);
            })
            .catch((error) => {
                console.error("Error while fetching team names:", error);
            });
    }, []);

    return (
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
                <Typography component="h2" variant="h3">
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
                    Employee Sign up
                </Typography>

                <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                error={Boolean(firstNameError)}
                                helperText={firstNameError}
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="surname"
                                label="Surname"
                                name="surname"
                                autoComplete="family-name"
                                error={Boolean(surnameError)}
                                helperText={surnameError}
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                error={Boolean(emailError)}
                                helperText={emailError}
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={Boolean(passwordError)}
                                helperText={passwordError}
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
                        </Grid>

                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="dateOfBirth"
                                    value={dateOfBirth}
                                    onChange={(newValue) => {
                                        setDateOfBirth(newValue);
                                    }}
                                    label="Date of Birth"
                                    sx={{ width: "100%" }}
                                />
                            </LocalizationProvider>
                            {dobError && <Typography variant="caption" color="error">{dobError}</Typography>}
                        </Grid>


                        <Grid item xs={12}>
                            <FormLabel component="legend">Gender</FormLabel>
                            <RadioGroup row name="gender" defaultValue="male">
                                <FormControlLabel
                                    value="male"
                                    control={
                                        <Radio
                                            sx={{
                                                "&.Mui-checked": {
                                                    color: "rgba(6,129,175,0.93)",
                                                },
                                            }}
                                        />
                                    }
                                    label="Male"
                                />
                                <FormControlLabel
                                    value="female"
                                    control={
                                        <Radio
                                            sx={{
                                                "&.Mui-checked": {
                                                    color: "rgba(6,129,175,0.93)",
                                                },
                                            }}
                                        />
                                    }
                                    label="Female"
                                />
                                <FormControlLabel
                                    value="other"
                                    control={
                                        <Radio
                                            sx={{
                                                "&.Mui-checked": {
                                                    color: "rgba(6,129,175,0.93)",
                                                },
                                            }}
                                        />
                                    }
                                    label="Other"
                                />
                            </RadioGroup>
                            <Grid item xs={12} sx={{ mt: 1 }}>
                                <Select
                                    placeholder="Select a team..."
                                    required
                                    name="selectedTeam"
                                    indicator={<KeyboardArrowDown />}
                                    error={teamError ? "true" : ""} // Conditionally apply error state
                                    sx={{
                                        width: "inherit",
                                        height: "3.4rem",
                                        [`& .${selectClasses.indicator}`]: {
                                            transition: "0.2s",
                                            [`&.${selectClasses.expanded}`]: {
                                                transform: "rotate(-180deg)",
                                            },
                                        },
                                    }}
                                >
                                    {teamOptions}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
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
                        Sign Up
                    </Button>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        {displayCircularProcessing && <CircularProgress />}
                    </Box>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/");
                                }}
                                variant="body2"
                                sx={{
                                    color: "rgba(6,129,175,0.93)",
                                    textDecorationColor: "rgba(6,129,175,0.93)",
                                }}
                            >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}

export default EmployeeSignup;
