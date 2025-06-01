import mongoose from "mongoose";

const Schema = mongoose.Schema;

const payslipSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
        index: true,
      },
    date: {
        type: Date,
        required: true,
      },
    baseSalary: {
        type: Number,
        required: true,
    },
    incomeTax: {
        type: Number,
        required: true
    },
    netSalary: {
        type: Number,
        required: false
    },
    // benefits: {
    //     type: mongoose.Schema.Types.ObjectId,   // referencing to benefitsModel.js schema
    //     ref: "Benefits",
    //     required: true,
    // }
}, {timestamps: true})

const Payslip = mongoose.model('Payslip', payslipSchema);

export default Payslip;