import React, { useContext, useEffect } from "react";
import axios from "axios";
import { usercontext } from "../context/UserContext";
import {
    FormControlLabel,
    FormGroup,
    Box,
    Switch,
    Typography,
} from "@mui/material";

export default function ControlledSwitches({ benefitName }) {
    //   const [enrolledStatus, setEnrolledStatus]
    const { user } = useContext(usercontext);
    const [benefits, setBenefits] = React.useState({});

    useEffect(() => {
        // This function is defined and immediately called within useEffect
        // It fetches data and logs the response
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://employnet.onrender.com/api/benefits/all-enrollment-benefits/${user._id}`,
                    { withCredentials: true }
                );

                // Transform the array to an object with benefitType as keys and isEnrolled as values
                const benefitsData = response.data.reduce((acc, benefit) => {
                    acc[benefit.benefitType] = benefit.isEnrolled;
                    return acc;
                }, {});
                setBenefits(benefitsData);
            } catch (error) {
                console.error("Error fetching data or setting state:", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs only once on mount

    const handleToggle = async (benefitName) => {
        try {
            // Update Backend
            await axios.post(
                "https://employnet.onrender.com/api/benefits/toggle-enrollment",
                {
                    employeeId: user._id,
                    benefitType: benefitName,
                },
                { withCredentials: true }
            );

            // Update state of switch
            setBenefits((prevBenefits) => ({
                ...prevBenefits,
                [benefitName]: !prevBenefits[benefitName],
            }));
        } catch (error) {
            console.error("Error toggling benefit enrollment:", error);
        }
    };

    const switchElements = Object.entries(benefits).map(
        ([benefitType, isEnrolled]) => {
            // console.log(
            //     "Benefit type:",
            //     benefitType,
            //     "isEnrolled:",
            //     isEnrolled
            // );
            return (
                <FormControlLabel
                    key={benefitType} // React needs a unique key for list items
                    control={
                        <Switch
                            checked={isEnrolled}
                            onChange={() => handleToggle(benefitType)}
                        />
                    }
                    label={benefitType}
                />
            );
        }
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Enrolled Benefits
            </Typography>
            <FormGroup>
                {Object.entries(benefits).map(([benefitType, isEnrolled]) => (
                    <FormControlLabel
                        key={benefitType}
                        control={
                            <Switch
                                checked={isEnrolled}
                                onChange={() => handleToggle(benefitType)}
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: "rgba(6,129,175,0.93)", // Dark purple when on
                                        "& + .MuiSwitch-track": {
                                            backgroundColor: "rgba(6,129,175,0.93)", // Dark purple track when on
                                        },
                                    },
                                    "& .MuiSwitch-switchBase": {
                                        color: "#ffffff", // White when off
                                        "& + .MuiSwitch-track": {
                                            backgroundColor: "#e0e0e0", // Grey track when off
                                        },
                                    },
                                }}
                            />
                        }
                        label={benefitType}
                    />
                ))}
            </FormGroup>
        </Box>
    );
}
