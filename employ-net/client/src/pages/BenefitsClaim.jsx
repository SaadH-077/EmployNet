import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography, Alert, AlertTitle, Grid } from "@mui/material";
import BenefitsToggleSwitch from "../components/benefitsToggleSwitch.jsx";

import Layout from "../components/layout.jsx";

import { usercontext } from "../context/UserContext";
import axios from "axios";

// import ClaimedBenefits from "../../../server/models/claimedBenefitsModel.js";

function BenefitsClaim() {
    const { user } = React.useContext(usercontext);
    const [displaySuccessAlert, setDisplaySuccessAlert] = React.useState(false);
    const [displayFailureAlert, setDisplayFailureAlert] = React.useState(false);
    const [displayNegativeClaimAlert, setDisplayNegativeClaimAlert] = React.useState(false);
    const [chosenBenefit, setChosenBenefit] = React.useState(null);
    const [chosenBenefitRemainingLimit, setChosenBenefitRemainingLimit] = React.useState(null);

    const [enrolledBenefits, setEnrolledBenefits] = React.useState([]);
    const [benefits, setBenefits] = React.useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your logic here to handle the form submission
        // For example, you can access the form values using event.target.elements
        const benefitType = e.target.elements.benefitType.value;
        const claimAmount = e.target.elements.claimAmount.value;
        const description = e.target.elements.description.value;

        const formData = {
            benefitType,
            claimAmount,
            description,
            employeeId: user._id,
        };

        // check negative claim amount
        if (claimAmount < 0) {
            console.log("Claim amount cannot be negative");
            setDisplayNegativeClaimAlert(true);
            return
        }

        // Perform any necessary validation or data processing
        console.log("Form Submitted: ", benefitType, claimAmount, description);

        try {
            const response = await axios.post(
                "https://employnet.onrender.com/api/benefits/claim-benefit",
                formData,
                { withCredentials: true }
            );

            console.log("Response from api:", response.data);
            if (response.data.success) {
                console.log("Claim successful on backend");

                setDisplaySuccessAlert(true);
                fetchBenefits()
                setChosenBenefit(null)
                setChosenBenefitRemainingLimit(null)
            } else {
                // Display error modal depening on whether amount exceeds limit or not
                console.log("claim failed");
                if (response.data.message === "Claim amount exceeds limit") {
                    console.log("Claim amount exceeds limit");
                    setDisplayFailureAlert(true);
                }
            }
        } catch (error) {
            console.error("Error during claim:", error);
        }

        // Clear the form fields
        e.target.reset();
    };

    const fetchBenefits = async () => {
        try {
            // Fetch the employee's benefits and their claimed amounts
            const benefitsResponse = await axios.get(
                `https://employnet.onrender.com/api/benefits/employee-benefits/${user._id}`,
                { withCredentials: true }
            );
            const claimsResponse = await axios.get(
                `https://employnet.onrender.com/api/benefits/claims-summary/${user._id}`,
                { withCredentials: true }
            );
            const enrolledBenefitsResponse = await axios.get(
                `https://employnet.onrender.com/api/benefits/all-enrollment-benefits/${user._id}`,
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
        } catch (err) {
            console.log("FAILED TO FETCH BENEFITS");
        }
    };

    React.useEffect(() => {
        fetchBenefits();
    }, [user._id]);

    function getBenefitsOptions() {
        // Fetch the benefits options from the server
        // use the benefits state
        return benefits.map((each) => each.benefitType);
    }
    // Should get this dynamically for the current employee
    const benefitsOptions = getBenefitsOptions();

    React.useEffect(() => {
        console.log("chosen beefit:", chosenBenefit);
    }, [chosenBenefit]);

    const handleBenefitChange = (event, newValue) => {
        setChosenBenefit(newValue);
        // also find chosen benefit's monthly limit from benefits array
        setChosenBenefitRemainingLimit(benefits.find(benefit => benefit.benefitType === newValue)?.monthlyLimit - benefits.find(benefit => benefit.benefitType === newValue)?.totalClaimed);
    }

    return (
        <Layout pageTitle="Benefits Management">
            <Grid
                container
                spacing={10}
                sx={{ p: 4, justifyContent: "center" }}
            >
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Benefits Claim
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Autocomplete
                                disablePortal
                                id="benefitType"
                                options={benefitsOptions}
                                fullWidth
                                value={chosenBenefit} // Set the selected value here
                                onChange={handleBenefitChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={chosenBenefitRemainingLimit ? "Remaining limit: " + chosenBenefitRemainingLimit : "Select Benefit Type"}
                                    />
                                )}
                            />
                            {/* Find chosen benefit from benefits.benefitType and display monthly limit */}
                            {/* {chosenBenefitRemainingLimit && (<Typography variant="body1">Remaining monthly limit: {chosenBenefitRemainingLimit}</Typography>)} */}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="claimAmount"
                                label="Claimed Amount (PKR)"
                                type="number"
                                id="claimAmount"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                multiline
                                rows={4}
                                name="description"
                                label="Explain the reason and details for the claim"
                                id="description"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    bgcolor: "rgba(6,129,175,0.93)",
                                    "&:hover": { bgcolor: "#0e6890" },
                                }}
                            >
                                Submit Claim
                            </Button>
                            {displaySuccessAlert && (
                                <Alert
                                    severity="success"
                                    onClose={() =>
                                        setDisplaySuccessAlert(false)
                                    }
                                >
                                    <AlertTitle>Success</AlertTitle>
                                    Your claim was processed successfully.
                                </Alert>
                            )}
                            {displayFailureAlert && (
                                <Alert
                                    severity="error"
                                    onClose={() =>
                                        setDisplayFailureAlert(false)
                                    }
                                >
                                    <AlertTitle>Error</AlertTitle>
                                    Your claim amount exceeded the remaining
                                    monthly limit.
                                </Alert>
                            )}
                            {
                                displayNegativeClaimAlert && (
                                    <Alert
                                        severity="error"
                                        onClose={() =>
                                            setDisplayNegativeClaimAlert(false)
                                        }
                                    >
                                        <AlertTitle>Error</AlertTitle>
                                        Claim amount cannot be negative.
                                    </Alert>
                                )
                            }
                        </form>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <BenefitsToggleSwitch />
                    </Box>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default BenefitsClaim;
