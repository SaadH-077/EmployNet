import express from "express";
import Team from "../models/teamModel.js";
import Employee from "../models/employeeModel.js";
const router = express.Router();

// @desc    Fetch team name and team members
router.get("/manager-team/:userId", async (req, res) => {
    try {
        console.log("Entering the manager team route");
        console.log("User ID:", req.params.userId);
        const teamDoc = await Team.findOne({ managerId: req.params.userId });
        if (!teamDoc) {
            res.status(404).json({
                success: false,
                message: "Team not found",
            });
        } else {
            // get all team member employees' objects
            const teamMembers = await Promise.all(
                teamDoc.members.map((employeeId) =>
                    Employee.findById(employeeId).exec()
                )
            );

            const responseObject = {
                teamName: teamDoc.teamName,
                teamMembers: teamMembers,       // complete employee objects list
            }
            res.json({ success: true, message: responseObject });
        }
    } catch (err) {
        console.log("Error during fetching team:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// router.get("/teams-list", async (req, res) => {
//     console.log("Entering the teams list route");

//     try {
//         const teams = await Team.find();
//         const teamNames = teams.map((team) => team.teamName);

//         if (!teams) {
//             res.status(404).json({
//                 success: false,
//                 message: "Teams not found",
//             });
//         } else {
//             res.json({ success: true, message: teamNames });
//         }
//     } catch (error) {
//         console.error("Error during fetching teams:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// });

export { router };
