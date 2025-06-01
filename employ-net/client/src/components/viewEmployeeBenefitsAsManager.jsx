import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
} from "@mui/material";

export default function ViewEmployeeBenefitsAsManager ({ employeeId }) {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [enrolledBenefits, setEnrolledBenefits] = useState([]);

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                // Fetch the employee's benefits and their claimed amounts
                const benefitsResponse = await axios.get(
                    `https://employnet.onrender.com/api/benefits/employee-benefits/${employeeId}`,
                    { withCredentials: true }
                );
                const claimsResponse = await axios.get(
                    `https://employnet.onrender.com/api/benefits/claims-summary/${employeeId}`,
                    { withCredentials: true }
                );
                const enrolledBenefitsResponse = await axios.get(
                    `https://employnet.onrender.com/api/benefits/all-enrollment-benefits/${employeeId}`,
                    { withCredentials: true }
                );
                setEnrolledBenefits(enrolledBenefitsResponse.data);

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
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch benefits");
                setLoading(false);
            }
        };

        fetchBenefits();
    }, [employeeId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Box sx={{ width: "100%" }}>
            {/* <Typography variant="h4" gutterBottom>
                Employee Benefits
            </Typography> */}
            <Box sx={{ display: "flex" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>
                            Claimed Benefits Details
                        </Typography>
                        {benefits.map((benefit, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="h6">
                                    {benefit.benefitType}
                                </Typography>
                                <Typography variant="body1">
                                    Current Monthly Limit:{" "}
                                    {benefit.monthlyLimit}
                                </Typography>
                                <Typography variant="body1">
                                    Total Claimed: {benefit.totalClaimed}
                                </Typography>
                            </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>
                            Enrolled Benefits Details
                        </Typography>
                        {enrolledBenefits.map((benefit, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="h6">
                                    {benefit.benefitType}
                                </Typography>
                                <Typography variant="body1">
                                    Enrolled:{" "}
                                    {benefit.isEnrolled ? "Yes" : "No"}
                                </Typography>
                                <Typography variant="body1">
                                    Allowance Amount: {benefit.allowanceAmount}
                                </Typography>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

