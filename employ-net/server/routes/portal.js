import express from "express";
import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import Manager from "../models/managerModel.js";
import Payslip from "../models/payslipModel.js";
import EnrolledBenefits from "../models/enrollmentBenefitsModel.js";
import ClaimedBenefits from "../models/claimedBenefitsModel.js";
import Room from "../models/roomModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

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

// Creating a route to fetch the payslip information for an employee
router.get("/request-payslip/:id", async (req, res) => {
  console.log("Entering the request payslip route");

  const ID = req.params.id;

  try {
    const payslip = await Payslip.findOne({ userId: ID });

    if (!payslip) {
      res.status(404).json({ success: false, message: "Payslip not found" });
    } else {
      res.json({ success: true, message: payslip });
    }
  } catch (error) {
    console.error("Error during fetching payslip:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
})

  

export { router };
