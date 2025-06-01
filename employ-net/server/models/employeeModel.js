import mongoose from "mongoose";

// This Mongoose schema defines the structure for employee data in MongoDB. 
// It includes fields such as first name, last name, address, city, gender, date of birth, email, password, phone number, paid leaves, remaining leaves, unpaid leaves, and role. 
// With timestamps enabled, it also automatically tracks the creation and modification times of documents. 
// The corresponding model, "Employee," facilitates interactions with the MongoDB collection, providing methods for querying, updating, and deleting employee records.

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
        FirstName: {
            type: String,
            required: true
        },
        LastName: {
            type: String,
            required: true
        },
        Address: {
            type: String,
            required: false
        },
        City: {
            type: String,
            required: false
        },
        Gender: {
            type: String,
            required: false
        },
        DateOfBirth: {
            type: Date,
            required: false
        },
        Email: {
            type: String,
            required: true
        },
        Password: {
            type: String,
            required: true
        },
        PhoneNumber: {
            type: Number,
            required: false
        },
        PaidLeaves: {
            type: Number,
            required: true
        },
        RemainingLeaves: {
            type: Number,
            required: true
        },
        UnpaidLeaves: {
            type: Number,
            required: true
        },
        Role: {
            type: String,
            required: true
        },
        teamId: {
            type: Schema.Types.ObjectId,
            ref: 'Team'
        },
        Visibility: {
            type: Map,
            of: Boolean,
            required: true,
            default: {
                Email: true,
                FirstName: true,
                LastName: true,
                Address: true,
                City: true,
                Gender: true,
                DateOfBirth: true,
                PhoneNumber: true,
                PaidLeaves: true,
                RemainingLeaves: true,
                UnpaidLeaves: true,
                Role: true,
            },
        }
    }, {timestamps: true})

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;