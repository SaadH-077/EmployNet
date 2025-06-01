import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";

// This component represents a navigation bar for the application. 
// It utilizes React Bootstrap's Navbar, Nav, and Container components for layout and styling. 
// The useNavigate hook from react-router-dom is used to handle navigation within the application. 
// The useContext hook is used to access user context, enabling sign-out functionality. 
// The handleSignOut function clears the user context and redirects the user to the login page. 
// Links to different pages within the application are provided using the Link component from react-router-dom. 
// Bootstrap's Button component is used for the sign-out button with the variant set to "outline-danger" for styling.

const NavBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(usercontext);

  const handleSignOut = () => {
    // Implement sign-out logic here
    setUser(null);
    console.log("User signed out");
    // Redirect to login page or clear user session
    navigate("/");

    localStorage.removeItem('user');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Employ-Net</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/emp-homepage" className="nav-link">
              Home
            </Link>
            <Link to="/employee-dashboard" className="nav-link">
              Dashboard
            </Link>
          </Nav>
          <NotificationBell></NotificationBell>
          <Button variant="outline-danger" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
