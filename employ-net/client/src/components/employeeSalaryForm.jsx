import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

const EmployeeSalaryForm = ({ employeeId }) => {
    const [salary, setSalary] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/payslip/request-payslip/${employeeId}`,
                    {withCredentials: true}
                );
                setSalary(response.data.message.baseSalary);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch salary");
                setLoading(false);
            }
        };

        fetchSalary();
    }, [employeeId]);

    const handleSalaryChange = (event) => {
        const newSalary = event.target.value;
        if (isNaN(newSalary) || parseFloat(newSalary) < 0) {
            setFormError("Invalid salary input. Please enter a valid number.");
        } else {
            setFormError("");
            setSalary(newSalary);
        }
    };

    const updateSalary = async () => {
        if (salary === "") {
            setFormError("Please enter a salary");
        }
        if (!formError && salary !== "") {
            try {
                await axios.post(
                    `https://employnet.onrender.com/api/payslip/update-salary`,
                    { salary, employeeId },
                    { withCredentials: true }
                );
                alert("Salary updated successfully!");
            } catch (error) {
                setError("Failed to update salary");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Box sx={{ display: "block" }}>
            {/* <Typography variant="h6" gutterBottom>
                Adjust Salary
            </Typography> */}
            <TextField
                label="Current Salary"
                type="number"
                value={salary}
                onChange={handleSalaryChange}
                error={!!formError}
                helperText={formError || "Enter the new salary"}
                variant="outlined"
            />
            <Box>
                <Button
                    variant="contained"
                    onClick={updateSalary}
                    sx={{ mt: 2 }}
                    disabled={!!formError || salary === ""}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default EmployeeSalaryForm;
