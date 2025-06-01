import express from "express";
import Employee from "../models/employeeModel.js";
import Manager from "../models/managerModel.js";
import Payslip from "../models/payslipModel.js";
import Team from "../models/teamModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import EnrollmentBenefits from "../models/enrollmentBenefitsModel.js";
import ClaimedBenefits from "../models/claimedBenefitsModel.js";
import Notification from "../models/notificationModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

dotenv.config();

// Function to hash the password
const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
};

// Function to compare hashed and plain passwords
const comparePasswords = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

// Creating a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

//Creating a route to send an email
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        });
        console.log("Email sent successfully");
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error during sending email:", error);
        return { success: false, message: "Internal server error" };
    }
};

//Defining a function to check if the user already exists in the database
const checkUserExists = async (email, role) => {
    if (role === "employee") {
        const user = await Employee.findOne({ Email: email });
        console.log("User:", user);
        return user;
    }
    if (role === "manager") {
        const user = await Manager.findOne({ Email: email });
        console.log("User:", user);
        return user;
    }
};

//Attaching a handler to the router
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the EmployNet Portal!" });
});

//Creating a login route
router.post("/login", async (req, res) => {
    console.log("Entering the login route");

    //Three different roles: admin, warden, student
    const { username, password, role, otp} = req.body;

    console.log("Username:", username);

    //If else ladder to check the role
    try {
        let user;

        console.log(password, role, username);

        if (role === "employee") {
            console.log("Checking if the employee exists");

            user = await Employee.findOne({ Email: username });
        } else if (role === "manager") {
            console.log("Checking if the student exists");

            user = await Manager.findOne({ Email: username });
        }

        if (user) {
            // Compare hashed password
            const passwordMatch = await comparePasswords(
                password,
                user.Password
            );

            if (passwordMatch) {

                const token = jwt.sign({ userId: user._id }, process.env.SECRET_JWT, {
                    expiresIn: "7d",
                });

                // User found, send a success response
               
                // modified_user.Password = "********";

                res.status(200).cookie("token", token, {
                    httpsOnly: false,
                    // secure: true,
                    // sameSite: "none",
                    // path: "/",
                    // maxAge: 1000 * 60 * 60 * 24 * 7,
                }).json({ success: true, message: "Login successful", user});

                //Password matches, so send the login email
                const currentDate = new Date().toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' });
                const currentTime = new Date().toLocaleTimeString("en-US", { timeZone: 'Asia/Karachi' });
                const shortMessage = `Hi ${user.FirstName},
  Your OTP for Employ-Net sign in on ${currentDate} at ${currentTime} is ${otp}. If you do not recognize this activity, please reset your password immediately and contact support.
  Best,
  Employ-Net Team`;

                const emailResponse = await sendEmail(
                    username,
                    "Employ-Net Login",
                    shortMessage
                );
            } else {
                // Password does not match, send a failure response
                res.json({
                    success: false,
                    message: "Login failed. Incorrect password.",
                });
            }
        } else {
            // User not found, send a failure response
            res.json({
                success: false,
                message: "Login failed. User not found.",
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

//Creating a signup route for manager
router.post("/manager-signup", async (req, res) => {
    console.log("Entering the manager signup route");
    console.log("Received body:", req.body); // Add this line

    const {
        firstName,
        surname,
        email,
        password,
        dateOfBirth,
        gender,
        teamName,
    } = req.body;
    const role = "manager";

    // //Check if the user already exists
    const userExists = await checkUserExists(email, role);
    const userExists2 = await checkUserExists(email, "employee");

    if (userExists !== null) {
        console.log("User exists");
        return res
            .status(400)
            .json({ success: false, message: "User already exists" });
    } 
    
    else if (userExists2 !== null) {
        console.log("User exists");
        return res
            .status(400)
            .json({ success: false, message: "User already exists" });
    }
    
    else {
        console.log("Creating a manager object");

        // Create manager object
        const manager = new Manager({
            FirstName: firstName.trim(),
            LastName: surname.trim(),
            Email: email,
            Password: await hashPassword(password),
            Role: role,
            Gender: gender,
            DateOfBirth: dateOfBirth,
        });

        // Create payslip object
        const payslip = new Payslip({
            userId: manager._id,
            date: new Date(),
            baseSalary: 200000,
            incomeTax: 0.16,
        });

        // Create team object
        const team = new Team({
            teamName: teamName.trim(),
            managerId: manager._id,
            employees: [],
        });

        // add teamId to manager object
        manager.teamId = team._id;
        // Create a notification object
        const notification = new Notification({
            user: manager._id,
            userModel: "Manager",
            notifications: [],
        });

        try {
            const newManager = await manager.save();
            await payslip.save();
            await team.save();
            await notification.save();
            console.log("Team saved!");

            //Signup was successful so send a confirmation email
            const currentDate = new Date().toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' });
            const currentTime = new Date().toLocaleTimeString("en-US", { timeZone: 'Asia/Karachi' });
            const shortMessage = `Hi ${firstName},
    Your sign up attempt for Employ-Net on ${currentDate} at ${currentTime} was successful. If you do not recognize this activity, please reset your password immediately and contact support.
    Best,
    Employ-Net Team`;
            const emailResponse = await sendEmail(
                email,
                "Welcome to Employ-Net",
                shortMessage
            );
            res.json({
                success: true,
                message: "Signup Successful",
                user: newManager,
            });
        } catch (error) {
            console.error("Error during signup:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
});

//Creating a signup route for employee
router.post("/employee-signup", async (req, res) => {
    console.log("Entering the employee signup route");
    console.log("Received body:", req.body); // Add this line

    const {
        firstName,
        surname,
        email,
        password,
        dateOfBirth,
        gender,
        selectedTeam,
    } = req.body;
    const role = "employee";

    const teamDocument = await Team.findOne({ teamName: selectedTeam });

    // //Check if the user already exists
    const userExists = await checkUserExists(email, role);
    const userExists2 = await checkUserExists(email, "manager");

    if (userExists !== null) {
        console.log("User exists");
        return res
            .status(400)
            .json({ success: false, message: "User already exists" });
    } 

    else if (userExists2 !== null)
    {
        console.log("User exists");
        return res
            .status(400)
            .json({ success: false, message: "User already exists" });
    }
    
    else {
        console.log("Creating an employee object");

        // Create employee object
        const employee = new Employee({
            FirstName: firstName.trim(),
            LastName: surname.trim(),
            Email: email,
            Password: await hashPassword(password),
            Role: role,
            Gender: gender,
            DateOfBirth: dateOfBirth,
            PaidLeaves: 12,
            UnpaidLeaves: 10,
            RemainingLeaves: 22,
            teamId: teamDocument._id,
        });

        // Create payslip object
        const payslip = new Payslip({
            userId: employee._id,
            date: new Date(),
            baseSalary: 80000,
            incomeTax: 0.16,
        });

        // Create claimed benefits
        const claimedBenefits = new ClaimedBenefits({
            employeeId: employee._id,
            benefitLimits: [
                {
                    benefitType: "OPD Coverage",
                    monthlyLimit: 10000,
                    remainingLimit: 10000,
                },
                {
                    benefitType: "Dental Coverage",
                    monthlyLimit: 10000,
                    remainingLimit: 10000,
                },
                {
                    benefitType: "Hospitalization Charges",
                    monthlyLimit: 30000,
                    remainingLimit: 30000,
                },
            ],
            claims: [],
        });

        // Create enrollment-based benefits
        const enrolledBenefits = new EnrollmentBenefits({
            employeeId: employee._id,
            benefits: [
                {
                    benefitType: "Laptop Allowance",
                    isEnrolled: true,
                    allowanceAmount: 15000,
                },
                {
                    benefitType: "Fuel Allowance",
                    isEnrolled: true,
                    allowanceAmount: 20000,
                },
            ],
        });


        // Create a notification object
        const notification = new Notification({
            user: employee._id,
            userModel: "Employee",
            notifications: [],
        });

        

        try {
            // Find team document by teamName
            teamDocument.members.push(employee._id);

            // Save to database
            const newEmployee = await employee.save();
            await payslip.save();
            await claimedBenefits.save();
            await enrolledBenefits.save();
            await teamDocument.save();
            console.log("claimed benefits saved");
            console.log("enrolled benefits saved");
            console.log("employee added to team", selectedTeam);
            await notification.save();
            console.log("claimed benefits saved");
            console.log("enrolled benefits saved");
            console.log("employee added to team", selectedTeam);
            console.log("notification saved");

            //Signup was successful so send a confirmation email
            const currentDate = new Date().toLocaleDateString("en-US", { timeZone: 'Asia/Karachi' });
            const currentTime = new Date().toLocaleTimeString("en-US", { timeZone: 'Asia/Karachi' });
            const shortMessage = `Hi ${firstName},
    Your sign up attempt for Employ-Net on ${currentDate} at ${currentTime} was successful. If you do not recognize this activity, please reset your password immediately and contact support.
    Best,
    Employ-Net Team`;
            const emailResponse = await sendEmail(
                email,
                "Welcome to Employ-Net",
                shortMessage
            );
            res.json({
                success: true,
                message: "Signup Successful",
                user: newEmployee,
            });
        } catch (error) {
            console.error("Error during signup:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
});

// Function to find the role by email


router.post("/reset", async (req, res) => {
    try {
        const { email, newPassword} = req.body;
        console.log("Received email: ", email)
        console.log("received password: ", newPassword)
        // role = findUserRoleByEmail(email)
        let my_role = "abcd"
        let userResult = await checkUserExists(email, "employee") 

        if (!userResult) {
            // return res.status(404).json({ success: false, message: 'User not found' });
            my_role = "manager"
        }

        else
        {
            my_role = "employee"
        }

        const hashedPassword = await hashPassword(newPassword);

        if (my_role === "employee") {
            await Employee.updateOne({ Email: email }, { Password: hashedPassword });
        } 
        
        else if (my_role === "manager") {
            await Manager.updateOne({ Email: email }, { Password: hashedPassword });
        }

        const shortMessage = 'Your password has been successfully reset. If you did not initiate this action, please contact support immediately.';
        await sendEmail(email, 'Password Reset Confirmation', shortMessage);

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post("/reset1", async (req, res) => {
    const { email, otp } = req.body;
    console.log(req)
    // Check if the user exists
    let userExists = await checkUserExists(email, "employee") || await checkUserExists(email, "manager");

    if (!userExists) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    try {
        const emailResponse = await sendEmail(
            email,
            "Password Reset Request",
            `Your OTP for password reset is: ${otp}`
        );

        res.json({ success: true, message: "OTP sent to email for password reset." });
    } catch (error) {
        console.error("Error during password reset request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

    // try {
    //     const { email, newPassword, role } = req.body;
    //     console.log("user role: ", role)
    //     let userResult = await checkUserExists(email, role) 

    //     if (!userResult) {
    //         return res.status(404).json({ success: false, message: 'User not found' });
    //     }

    //     const hashedPassword = await hashPassword(newPassword);

    //     if (role === "employee") {
    //         await Employee.updateOne({ Email: email }, { Password: hashedPassword });
    //     } 
        
    //     else if (role === "manager") {
    //         await Manager.updateOne({ Email: email }, { Password: hashedPassword });
    //     }

    //     const shortMessage = 'Your password has been successfully reset. If you did not initiate this action, please contact support immediately.';
    //     await sendEmail(email, 'Password Reset Confirmation', shortMessage);

    //     res.json({ success: true, message: 'Password reset successfully' });
    // } catch (error) {
    //     console.error('Error resetting password:', error);
    //     res.status(500).json({ success: false, message: 'Internal server error' });
    // }
});

router.post("/logout", async (req, res) => {
    console.log("Inside logout")
    return res.clearCookie("token").json({
        success:true,
        message: "User logged out."
    })
});


router.get("/teams-list", async (req, res) => {
    console.log("Entering the teams list route");

    try {
        const teams = await Team.find();
        const teamNames = teams.map((team) => team.teamName);

        if (!teams) {
            res.status(404).json({
                success: false,
                message: "Teams not found",
            });
        } else {
            res.json({ success: true, message: teamNames });
        }
    } catch (error) {
        console.error("Error during fetching teams:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});



export { router };
