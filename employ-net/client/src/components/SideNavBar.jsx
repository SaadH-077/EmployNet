import React from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import LogoutIcon from "@mui/icons-material/Logout";
import LoupeIcon from "@mui/icons-material/Loupe";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsIcon from "@mui/icons-material/Settings";
import EventNoteIcon from "@mui/icons-material/EventNote";
import axios from "axios";

function SideNavBar({ drawerWidth, mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();
    // const [drawerOpen, setDrawerOpen] = useState(true);
    const { user, setUser } = useContext(usercontext);

    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerClose = () => {
        setIsClosing(true);
        // setMobileOpen(false);
    };

    const handleSignOut = async () => {
        // Implement sign-out logic here
        localStorage.removeItem("user");
        setUser(null);
        console.log("User signed out");
        // Redirect to login page or clear user session
        const response = await axios.post(
            "https://employnet.onrender.com/api/authentication/logout",
            {},
            { withCredentials: true }
        );

        console.log("Logout response", response.data);
        navigate("/");
    };

    console.log(user);
    const isEmployee = user.Role === "employee";

    const mainItems = [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            onClick: () =>
                isEmployee
                    ? navigate("/employee-dashboard")
                    : navigate("/manager-dashboard"),
        },
        {
            text: "Profile",
            icon: <AccountCircleIcon />,
            onClick: () =>
                isEmployee
                    ? navigate("/employee-info")
                    : navigate("/manager-info"),
        },
        {
            text: "Benefits Claim",
            display: isEmployee ? "flex" : "none",
            icon: <LoupeIcon />,
            onClick: () => navigate("/benefits-claim"),
        },
        {
            text: "Bookings",
            display: isEmployee ? "flex" : "none",
            icon: <EventNoteIcon />,
            onClick: () => navigate("/view-bookings"),
        },
        {
            text: "Timesheet",
            display: isEmployee ? "flex" : "none",
            icon: <AccessTimeIcon />,
            onClick: () => navigate("/view-attendance"),
        },
        {
            text: "My Team",
            display: !isEmployee ? "flex" : "none",
            icon: <AccountCircleIcon />,
            onClick: () => navigate("/manager-team"),
        },
        {
            text: "Manager Information",
            display: isEmployee ? "flex" : "none",
            icon: <AccountCircleIcon />,
            onClick: () => navigate("/employee-manager"),
        },
        {
            text: "Approved Leaves",
            display: isEmployee ? "flex" : "none",
            icon: <EventNoteIcon />, // Use the leave management icon
            onClick: () => navigate("/view-approved-leaves"), // Navigate to the leave management page
        },
        {
            text: "Employees' Leave Requests",
            display: !isEmployee ? "flex" : "none",
            icon: <EventNoteIcon />, // Use the leave management icon
            onClick: () => navigate("/view-leave-requests"), // Navigate to the leave management page
        },
        {
            text: "Settings",
            icon: <SettingsIcon />,
            onClick: () =>
                isEmployee
                    ? navigate("/emp-settings")
                    : navigate("/manager-settings"),
        },
    ];

    const bottomItems = [
        {
            text: "Logout",
            icon: <LogoutIcon />,
            onClick: handleSignOut,
        },
    ];

    const drawer = (
        <Box>
            <Toolbar />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "90vh",
                }}
            >
                <List>
                    {mainItems.map((item) => (
                        <ListItemButton
                            key={item.text}
                            sx={{
                                // "&:hover": {
                                //     backgroundColor: 'purple',
                                //     "& .MuiListItemText-primary": {
                                //         color: 'white',
                                //     },
                                // },
                                display: item.display,
                            }}
                            onClick={() => {
                                item.onClick();
                                // setMobileOpen(false); // Optionally close the drawer when an item is clicked
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
                <List>
                    {bottomItems.map((item) => (
                        <ListItemButton
                            key={item.text}
                            sx={
                                {
                                    // mt : 44,
                                    // "&:hover": {
                                    //     backgroundColor: 'purple',
                                    //     "& .MuiListItemText-primary": {
                                    //         color: 'white',
                                    //     },
                                    // },
                                }
                            }
                            onClick={() => {
                                item.onClick();
                                // setMobileOpen(false); // Optionally close the drawer when an item is clicked
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onTransitionEnd={handleDrawerTransitionEnd}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                    },
                }}
            >
                {drawer}
            </Drawer>
            {/* <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                open={drawerOpen}
            >
                {drawer}
            </Drawer> */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}

export default SideNavBar;
