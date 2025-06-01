import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import NavBar from "../components/NavBar";
import CheckInButton from "../components/checkInButton";

// This component represents the Employee Home Page, providing a user-friendly interface for logged-in employees. 
// It utilizes React Bootstrap for styling, useContext hook for accessing user context, and useNavigate hook for navigation. 
// The component features buttons for updating information, viewing information, and viewing attendance, 
// along with a custom CheckInButton component for checking in. The layout is organized with a NavBar component at the top 
// and buttons stacked vertically for easy access and navigation. Additional content can be added below the buttons.

const EmployeeHomePage = () => {
  let navigate = useNavigate();

  return (
    <Container>
      <NavBar />
      <Container className="mt-3">
        <h3>Welcome to Employ-Net</h3>
        <p>You are logged in as an employee.</p>

        {/* Wrap buttons in a div with d-flex flex-column to stack them vertically */}
        <div className="d-flex flex-column align-items-start">
          <Button
            variant="primary"
            className="mb-3"
            onClick={() => navigate("/employee-update")}
          >
            Update Information
          </Button>

          <Button
            variant="primary"
            className="mb-3"
            onClick={() => navigate("/employee-info")}
          >
            View Information
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate("/view-attendance")}
            className="mb-3"
          >
            View Attendance
          </Button>
          
          <CheckInButton className="mb-3" />
        </div>
      </Container>
      {/* Additional homepage content goes here */}
    </Container>
  );
};

export default EmployeeHomePage;
