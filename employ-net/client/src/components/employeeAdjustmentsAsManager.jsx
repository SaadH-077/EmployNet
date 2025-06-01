import EmployeeSalaryForm from "./employeeSalaryForm";
import AdjustClaimedBenefitsForm from "./adjustClaimedBenefitsForm";
import { Box, Grid, Typography } from "@mui/material";

export default function EmployeeAdjustmentsAsManager({ employeeId }) {
    return (
        <Box sx={{ width: "100%" }}>
            {/* <Typography variant="h4" gutterBottom>
                Employee Adjustments
            </Typography> */}
            <Box sx={{ display: "flex" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>
                            Adjust Base Salary
                        </Typography>
                        <EmployeeSalaryForm employeeId={employeeId} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>
                            Adjust Benefits
                        </Typography>
                        <AdjustClaimedBenefitsForm employeeId={employeeId} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
