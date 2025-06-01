import mongoose from "mongoose";

const claimedBenefitsSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    benefitLimits: [
        {
            benefitType: {
                type: String,
                enum: [
                    "OPD Coverage",
                    "Dental Coverage",
                    "Hospitalization Charges",
                ],
                required: true,
            },
            monthlyLimit: Number,
            remainingLimit: Number,
        },
    ],
    claims: [
        // holds a list of claims made by the employee
        {
            benefitType: {
                type: String,
                enum: [
                    "OPD Coverage",
                    "Dental Coverage",
                    "Hospitalization Charges",
                ],
            },
            claimAmount: Number,
            description: String,
            claimDate: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const ClaimedBenefits = mongoose.model(
    "ClaimedBenefits",
    claimedBenefitsSchema
);
export default ClaimedBenefits;
