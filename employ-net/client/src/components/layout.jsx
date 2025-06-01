import React from "react";
import TopBar from "./TopBar";
import SideNavBar from "./SideNavBar";
import { Box } from "@mui/material";

const Layout = ({ children, pageTitle }) => {
    const drawerWidth = 250; // This should be consistent with your SideNavBar settings

    const [mobileOpen, setMobileOpen] = React.useState(false);
    
    const toggleDrawer = () => {
        setMobileOpen((status) => !status);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <TopBar pageTitle={pageTitle} toggleDrawer={toggleDrawer} />
            <SideNavBar
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
