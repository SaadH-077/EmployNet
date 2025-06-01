//In this file, I will define the routes for the benefits model.
import express from "express";
import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import Manager from "../models/managerModel.js";
import ClaimedBenefits from "../models/claimedBenefitsModel.js";
import EnrollmentBenefits from "../models/enrollmentBenefitsModel.js";

const router = express.Router();

router.post("/claim-benefit", async (req, res) => {
    const { employeeId, benefitType, claimAmount, description } = req.body;

    console.log("Claim Benefit Request received:", req.body);

    try {
        // Find the employee's claimed benefits document
        const claimedBenefitsDoc = await ClaimedBenefits.findOne({
            employeeId: employeeId,
        });
        if (!claimedBenefitsDoc) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }

        // Check if remaining limit for the benefit is sufficient for the claim
        let remainingLimit = claimedBenefitsDoc.benefitLimits.find(
            (benefit) => benefit.benefitType === benefitType
        ).remainingLimit;
        if (remainingLimit < claimAmount) {
            return res.json({
                success: false,
                message: "Claim amount exceeds limit",
            });
        }

        // Update the remaining limit by deducting the claim amount
        claimedBenefitsDoc.benefitLimits.find(
            (benefit) => benefit.benefitType === benefitType
        ).remainingLimit -= claimAmount;

        // Add claim to list of claims for the employee
        claimedBenefitsDoc.claims.push({
            benefitType: benefitType,
            claimAmount: claimAmount,
            description: description,
            claimDate: Date.now(),
        });

        // Save document to database
        await claimedBenefitsDoc.save();

        res.json({ success: true, message: "Claim successful" });
    } catch (error) {
        console.error("Error while finding claimed benefits:", error);
        return res.status(500).json({
            success: false,
            message: "Error while finding claimed benefits",
        });
    }
});

// POST route to toggle the enrollment status of a benefit
router.post("/toggle-enrollment", async (req, res) => {
    const { employeeId, benefitType } = req.body; // Or req.query, depending on how you're sending data

    try {
        // Find the enrollment document for the given employee
        const enrollment = await EnrollmentBenefits.findOne({ employeeId });

        if (!enrollment) {
            return res
                .status(404)
                .send("Enrollment not found for the given employee ID.");
        }

        // Find the specific benefit and toggle its isEnrolled state
        const benefit = enrollment.benefits.find(
            (b) => b.benefitType === benefitType
        );
        if (!benefit) {
            return res.status(404).send("Benefit type not found.");
        }

        // Toggle the enrollment status
        benefit.isEnrolled = !benefit.isEnrolled;

        // Save the updated document
        await enrollment.save();

        // Send back the updated enrollment information
        res.send(enrollment);
    } catch (error) {
        console.error("Error toggling benefit enrollment:", error);
        res.status(500).send("Internal server error.");
    }
});

// GET route to fetch all enrollment benefits
router.get("/all-enrollment-benefits/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;

        const enrollmentsDocument = await EnrollmentBenefits.findOne({
            employeeId: employeeId,
        });

        const allBenefits = enrollmentsDocument.benefits.map((each) => {
            return {
                benefitType: each.benefitType,
                isEnrolled: each.isEnrolled,
                allowanceAmount: each.allowanceAmount,
            };
        });

        res.json(allBenefits);
    } catch (error) {
        console.error("Error fetching enrollment benefits:", error);
        res.status(500).send("Internal server error.");
    }
});

// GET route to fetch the total claimed amounts for all benefits in the current month
router.get("/claims-summary/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;  // Get the employee ID from the URL parameter

        const objectId = new mongoose.Types.ObjectId(employeeId);

        const startOfMonth = new Date();
        startOfMonth.setDate(1); // Set the date to the first day of the current month
        startOfMonth.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0); // Last day of the current month
        endOfMonth.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

        const claimsSummary = await ClaimedBenefits.aggregate([
            { $match: { "employeeId": objectId } },  // Filter documents by employee ID
            { $unwind: '$claims' }, // Unwind the claims array
            { $match: {
                'claims.claimDate': { $gte: startOfMonth, $lte: endOfMonth } // Further filter claims within the current month
            }},
            { $group: {
                _id: '$claims.benefitType', // Group by benefit type
                totalClaimed: { $sum: '$claims.claimAmount' } // Sum of claim amounts for each benefit type
            }},
            { $project: {
                _id: 0,
                benefitType: '$_id',
                totalClaimed: 1
            }}
        ]);

        res.json(claimsSummary);
    } catch (error) {
        console.error("Error fetching claims summary for employee:", error);
        res.status(500).send("Internal server error.");
    }
});

// GET Request to get all claim-type benefits, their monthly limit and remaining limits
// GET route to fetch all benefits with limits for an employee
router.get("/employee-benefits/:employeeId", async (req, res) => {
    const { employeeId } = req.params;

    try {
        const claimedBenefits = await ClaimedBenefits.findOne({ employeeId: employeeId });

        if (!claimedBenefits) {
            return res.status(404).json({ success: false, message: "No benefits found for this employee." });
        }

        const benefitsWithLimits = claimedBenefits.benefitLimits.map(benefit => ({
            benefitType: benefit.benefitType,
            monthlyLimit: benefit.monthlyLimit,
            remainingLimit: benefit.remainingLimit
        }));

        res.json({ success: true, benefits: benefitsWithLimits });
    } catch (error) {
        console.error("Error fetching benefits for employee:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// POST route to update the monthly limits of benefits
router.post("/update-limits", async (req, res) => {
    const { employeeId, benefits } = req.body;

    if (!employeeId || !benefits || !benefits.length) {
        return res.status(400).send({
            success: false,
            message: "Employee ID and benefits are required."
        });
    }

    try {
        const claimedBenefitsDoc = await ClaimedBenefits.findOne({ employeeId });

        if (!claimedBenefitsDoc) {
            return res.status(404).json({
                success: false,
                message: "Claimed benefits document not found for the given employee ID."
            });
        }

        benefits.forEach(benefit => {
            const foundBenefit = claimedBenefitsDoc.benefitLimits.find(b => b.benefitType === benefit.benefitType);
            if (foundBenefit) {
                const minAllowedLimit = foundBenefit.monthlyLimit - foundBenefit.remainingLimit;
                if (benefit.newLimit >= minAllowedLimit) {
                    foundBenefit.monthlyLimit = benefit.newLimit;
                } else {
                    throw new Error(`New limit for ${benefit.benefitType} cannot be less than ${minAllowedLimit}`);
                }
            }
        });

        await claimedBenefitsDoc.save();
        res.status(200).json({
            success: true,
            message: "Benefits limits updated successfully.",
            data: claimedBenefitsDoc
        });
    } catch (error) {
        console.error("Error updating benefits limits:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while updating benefits limits",
            error: error.message
        });
    }
});




export { router };
