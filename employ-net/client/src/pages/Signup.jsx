import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    createTheme,
    ThemeProvider,
  } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { grey } from "@mui/material/colors";


import SignupChoiceCard from "../components/signupChoiceCard";

const theme = createTheme({
    palette: {
      background: {
        default: "#FFFFFF", // Dark purple background
      },
    },
  });

function Signup() {
    const navigate = useNavigate();

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

    return (
        // <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                justifyContent: "center",
                backgroundColor: theme.palette.background.default, // Use theme background
              }}
            >
              <Card raised sx={{ minWidth: 275, width: '100%', p: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                      <Grid item xs={8.5}>
                        <SignupChoiceCard cardTitle={"Manager"} />
                      </Grid>
                      <Grid item xs={8.5}>
                        <SignupChoiceCard cardTitle={"Employee"} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box mt={5}>
                    <Copyright />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Container>
        // </ThemeProvider>
      );
}

export default Signup;
