import express from 'express'
import Manager from '../models/managerModel.js'
import dotenv from 'dotenv'

const router = express.Router()

dotenv.config()

// Creating a route to update Manager information
router.get("/manager-info/:id", async (req, res) => {
    console.log("Entering the manager info route");
    console.log(req.body);
  
    const ID = req.params.id;
    console.log("User ID:", ID)
  
    try {
      const managerInfo = await Manager.findById(ID);
  
      if (!managerInfo) {
        res.status(404).json({ success: false, message: "Manager not found" });
      } else {
        res.json({ success: true, message: managerInfo });
      }
    } catch (error) {
      console.error("Error during displaying manager information:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  
  // Creating a route to update Manager information
  router.put("/manager-update/:id", async (req, res) => {
    console.log("Entering the manager update route");
    console.log(req.body);
  
    const ID = req.params.id;
    const allFields = { ...req.body };  
  
    try {
      await Manager.findByIdAndUpdate(ID, allFields);
      const updatedManager = await Manager.findById(ID);
  
      if (!updatedManager) {
        res.status(404).json({ success: false, message: "Employee not found" });
      } else {
        res.json({ success: true, message: updatedManager });
      }
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  //Creating a route to get manager info based on team ID for the employee
  router.get("/manager-info-team/:teamId", async (req, res) => {
    console.log("Entering the manager info route");
    console.log("Team ID:", req.params.teamId);
  
    try {
      const managerDoc = await Manager.findOne({ teamId: req.params.teamId });
  
      if (!managerDoc) {
        res.status(404).json({
          success: false,
          message: "Manager not found",
        });
      } else {
        res.json({ success: true, message: managerDoc });
      }
    } catch (err) {
      console.log("Error during fetching manager:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Creating a route to fetch manager visibility settings
router.get("/manager-info/:id/visibility", async (req, res) => {
    console.log("Entering the manager visibility route");
    console.log("User ID:", req.params.id);
  
    try {
      const managerDoc = await Manager.findById(req.params.id);
  
      if (!managerDoc) {
        res.status(404).json({
          success: false,
          message: "Manager not found",
        });
      } else {
        res.json({ success: true, visibility: managerDoc.Visibility });
      }
    } catch (err) {
      console.log("Error during fetching manager visibility:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Creating a route to update manager visibility settings
router.put("/manager-info/:id/visibility", async (req, res) => {
    console.log("Entering the manager visibility update route");
    console.log("User ID:", req.params.id);
    console.log(req.body);

    const ID = req.params.id;
    const visibility = req.body.visibility;
  
    try {
      const updatedManager = await Manager.findByIdAndUpdate(ID, { Visibility : visibility });
  
      if (!updatedManager) {
        res.status(404).json({
          success: false,
          message: "Manager not found",
        });
      } else {
        res.json({ success: true, message: updatedManager });
      }
    } catch (err) {
      console.log("Error during updating manager visibility:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

export {router};