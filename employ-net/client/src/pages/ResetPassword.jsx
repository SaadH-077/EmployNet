import React, { useState } from 'react';
import { Button, Card, CardContent, Container, TextField, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { newPassword, confirmPassword } = Object.fromEntries(formData);
        const email = location.state?.email;

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setErrorMessage("Password must be at least 8 characters long and contain at least one uppercase letter and one special character.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            await axios.post(
                'https://employnet.onrender.com/api/authentication/reset',
                { email, newPassword},
                { withCredentials: true }
            );
            navigate('/'); 
        } catch (error) {
            console.error('Error during password reset:', error);
            setErrorMessage(String(error));
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Reset Password
                    </Typography>

                    {errorMessage && (
                        <Typography color="error">
                            {errorMessage}
                        </Typography>
                    )}

                    <Box component="form" onSubmit={handlePasswordReset} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type="password"
                            autoComplete="new-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset Password
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ResetPassword;
