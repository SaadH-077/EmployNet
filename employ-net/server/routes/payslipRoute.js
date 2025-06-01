import express from "express";
import Payslip from "../models/payslipModel.js";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

router.get("/request-payslip/:id", async (req, res) => {
    console.log("Entering the request payslip route");

    const ID = req.params.id;

    try {
        const payslip = await Payslip.findOne({ userId: ID });

        if (!payslip) {
            res.status(404).json({
                success: false,
                message: "Payslip not found",
            });
        } else {
            res.json({ success: true, message: payslip });
        }
    } catch (error) {
        console.error("Error during fetching payslip:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.post("/update-salary/", async (req, res) => {
    console.log("Entering the update salary route");

    const { employeeId, salary } = req.body;

    try {
        const payslip = await Payslip.findOne({ userId: employeeId });
        if (!payslip) {
            res.status(404).json({
                success: false,
                message: "Payslip not found",
            });
        } else {
            payslip.baseSalary = salary;
            await payslip.save();
            res.json({ success: true, message: "Salary updated successfully" });
        }
    } catch (error) {
        console.error("Error during updating salary:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

export { router };
