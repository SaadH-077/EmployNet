import mongoose from "mongoose";

//Store leave requests for each manager

const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manager",
        required: true,
    },
    requests: [
        {
            employeeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
                required: true,
            },
            employeeFirstName: {
                type: String,
                required: true,
            },
            employeeLastName: {
                type: String,
                required: true,
            },
            dateList: {
                type: [String], // Array of strings
                required: true,
                default: []
            },
            reason: {
                type: String,
                required: true,
                default: ""
            },
        },
    ],
});

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
