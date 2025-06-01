import mongoose from "mongoose";

// This code defines a Mongoose schema named managerSchema to structure manager data for storage in MongoDB. 
// It includes fields like first name, last name, address, city, gender, date of birth, email, password, and phone number. 
// The schema also includes timestamps for creation and updating. 
// Finally, it exports the Manager model for use in other parts of the application.

const Schema = mongoose.Schema;

const managerSchema = new Schema({
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
                Role: true,
            },
        }
    }, {timestamps: true})

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;