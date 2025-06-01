import express from 'express';
import Employee from '../models/employeeModel.js';
import TeamModel from '../models/teamModel.js';
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

//Creating a route to view employee information
router.get("/employee-info/:id", async (req, res) => {
    console.log("Entering the employee info route");
    console.log(req.body);
  
    const ID = req.params.id;
    console.log("User ID:", ID)
  
    try {
      const employeeInfo = await Employee.findById(ID);
  
      if (!employeeInfo) {
        res.status(404).json({ success: false, message: "Employee not found" });
      } else {
        res.json({ success: true, message: employeeInfo });
      }
    } catch (error) {
      console.error("Error during displaying employee information:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  
  //Creating a route to update employee information
  router.put("/employee-update/:id", async (req, res) => {
    console.log("Entering the employee update route");
    console.log(req.body);
  
    const ID = req.params.id;
    const allFields = { ...req.body };  
  
    try {
     await Employee.findByIdAndUpdate(ID, allFields);
     const updatedEmployee = await Employee.findById(ID);

      console.log("Updated employee:", updatedEmployee)
  
      if (!updatedEmployee) {
        res.status(404).json({ success: false, message: "Employee not found" });
      } else {
        res.json({ success: true, message: updatedEmployee });
      }
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  //Creating a route to get the manager information based on the provided team ID
  router.get("/manager-info/:id", async (req, res) => {
    console.log("Entering the manager info route");
    console.log(req.body);
  
    const ID = req.params.id;
    console.log("Team ID:", ID)
  
    try {
      const teamInfo = await TeamModel.findById(ID);
  
      if (!teamInfo) {
        res.status(404).json({ success: false, message: "Team not found" });
      } else {
        res.json({ success: true, message: teamInfo });
      }
    } catch (error) {
      console.error("Error during displaying manager information:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  })

  //Creating a route to fetch the visiblity settings of the employee
  router.get("/employee-info/:id/visibility", async (req, res) => {
    console.log("Entering the employee visibility route");
    console.log(req.body);
  
    const ID = req.params.id;
    console.log("User ID:", ID)
  
    try {
      const employeeInfo = await Employee.findById(ID);
  
      if (!employeeInfo) {
        res.status(404).json({ success: false, message: "Employee not found" });
      } else {
        res.json({ success: true, visibility: employeeInfo.Visibility });
      }
    } catch (error) {
      console.error("Error during displaying employee information:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  //Creating a route to update the visibility settings of the employee
  router.put("/employee-info/:id/visibility", async (req, res) => {
    console.log("Entering the employee visibility update route");
    console.log(req.body);
  
    const ID = req.params.id;
    const visibility = req.body.visibility;
  
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(ID, { Visibility: visibility });
  
      if (!updatedEmployee) {
        res.status(404).json({ success: false, message: "Employee not found" });
      } else {
        res.json({ success: true, message: updatedEmployee });
      }
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

export { router };