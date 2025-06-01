import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    benefits: [
        {
            benefitType: {
                type: String,
                enum: ["Laptop Allowance", "Fuel Allowance"],
                required: true,
            },
            isEnrolled: {
                type: Boolean,
                default: false,
            },
            allowanceAmount: {
                type: Number,
                required: function () {
                    return this.isEnrolled;
                },
            },
        },
    ],
});

const EnrollmentBenefits = mongoose.model("Enrollment", enrollmentSchema);
export default EnrollmentBenefits;
