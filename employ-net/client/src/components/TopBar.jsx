import React from "react";
import {
    styled,
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationBell from "./NotificationBell";

const drawerWidth = 240; // Adjust this value as per your layout needs

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "rgba(6,129,175,0.93)",
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
//

// Optional: Accept `title` as a prop if you want to make it dynamic
const TopBar = ({ pageTitle, toggleDrawer }) => {
    return (
        <AppBar position="fixed">
            <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {pageTitle}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* <Button color="inherit">hi</Button> */}
                    <NotificationBell />
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
