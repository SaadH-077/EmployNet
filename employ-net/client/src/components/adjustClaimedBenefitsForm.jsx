import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    TextField,
    Button,
    Box,
    Typography,
    FormControl,
    Alert,
    AlertTitle,
} from "@mui/material";

const EmployeeBenefitsUpdateForm = ({ employeeId }) => {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState([]);

    const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                // Fetch the employee's benefits and their claimed amounts
                const benefitsResponse = await axios.get(
                    `https://employnet.onrender.com/api/benefits/employee-benefits/${employeeId}`,
                    {withCredentials: true}
                );
                const claimsResponse = await axios.get(
                    `https://employnet.onrender.com/api/benefits/claims-summary/${employeeId}`,
                    {withCredentials: true}
                );

                // Format the benefits data with initial newLimit and merge claimed amounts
                let formattedBenefits = benefitsResponse.data.benefits.map(
                    (benefit) => ({
                        ...benefit,
                        newLimit: benefit.monthlyLimit,
                        totalClaimed: 0, // Initialize with 0, will update if found
                    })
                );

                // Map the claimed amounts to the corresponding benefits
                claimsResponse.data.forEach((claim) => {
                    const index = formattedBenefits.findIndex(
                        (benefit) => benefit.benefitType === claim.benefitType
                    );
                    if (index !== -1) {
                        formattedBenefits[index].totalClaimed =
                            claim.totalClaimed;
                    } else {
                        formattedBenefits[index].totalClaimed = 0;
                    }
                });

                setBenefits(formattedBenefits);
                setFormError(new Array(formattedBenefits.length).fill(""));
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch benefits");
                setLoading(false);
            }
        };

        fetchBenefits();
    }, [employeeId]);

    const handleLimitChange = (index, newLimit) => {
        const updatedBenefits = [...benefits];
        updatedBenefits[index].newLimit = newLimit;
        setBenefits(updatedBenefits);

        const errors = [...formError];
        const minAllowedLimit = updatedBenefits[index].totalClaimed;
        if (newLimit === "") {
            errors[index] = "Limit is required";
        } else if (newLimit < minAllowedLimit) {
            errors[index] = `Limit must be at least ${minAllowedLimit}`; // the amount employee has already claimed
        } else {
            errors[index] = "";
        }
        setFormError(errors);
    };

    const isFormValid = !formError.some((error) => error !== "");

    const saveNewLimits = async () => {
        if (isFormValid) {
            try {
                await axios.post(
                    "https://employnet.onrender.com/api/benefits/update-limits",
                    {
                        employeeId,
                        benefits: benefits.map(({ benefitType, newLimit }) => ({
                            benefitType,
                            newLimit,
                        })),
                    },
                    { withCredentials: true }
                );
                setDisplaySuccessAlert(true);
            } catch (error) {
                console.error("Failed to update limits:", error);
            }
        } else {
            alert("Please correct the errors before submitting.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Box sx={{ width: "100%" }}>
            {/* <Typography variant="h4" gutterBottom>
                Employee Benefits Adjustment
            </Typography> */}
            
            <Box>
                {/* <Typography variant="h5" gutterBottom>
                    Adjust Monthly Limits for Claimed Benefits
                </Typography> */}
                {benefits.map((benefit, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Box mb={1}>
                            <Typography variant="h6">
                                {benefit.benefitType}
                            </Typography>
                        </Box>
                        <FormControl error={!!formError[index]}>
                            <TextField
                                type="number"
                                label="Current Monthly Limit"
                                value={benefit.newLimit}
                                onChange={(e) =>
                                    handleLimitChange(
                                        index,
                                        e.target.value !== ""
                                            ? parseInt(e.target.value, 10)
                                            : ""
                                    )
                                }
                                helperText={
                                    formError[index] ||
                                    "Enter new monthly limit"
                                }
                                variant="outlined"
                                error={!!formError[index]}
                            />
                        </FormControl>
                    </Box>
                ))}
                <Button
                    variant="contained"
                    onClick={saveNewLimits}
                    sx={{ mt: 2 }}
                    disabled={!isFormValid}
                >
                    Save Changes
                </Button>
                {displaySuccessAlert && (
                    <Alert
                        severity="success"
                        onClose={() => setDisplaySuccessAlert(false)}
                        sx={{ mt: 2 }}
                    >
                        <AlertTitle>Success</AlertTitle>
                        Employee's claim limits were updated successfully.
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default EmployeeBenefitsUpdateForm;
