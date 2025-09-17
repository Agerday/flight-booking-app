import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    useTheme,
    useMediaQuery,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation } from "react-router-dom";

const navItems = [
    { label: "Book a Flight", path: "/book" },
    { label: "My Bookings", path: "/my-bookings" },
];

const TopMenu: React.FC = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const location = useLocation();

    const toggleDrawer = () => setMobileOpen(!mobileOpen);

    return (
        <>
            <AppBar
                position="sticky"
                elevation={6}
                sx={{
                    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    borderBottom: "2px solid rgba(255,255,255,0.1)",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Brand */}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: "none",
                            color: "white",
                            fontWeight: 700,
                            letterSpacing: "0.8px",
                            fontSize: "1.3rem",
                            transition: "all 0.2s ease",
                            "&:hover": { opacity: 0.85 },
                        }}
                    >
                        Flight-Booking-App
                    </Typography>

                    {/* Desktop Menu */}
                    {!isMobile && (
                        <Box>
                            {navItems.map((item) => (
                                <Button
                                    key={item.path}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        mx: 1.2,
                                        px: 2.5,
                                        py: 1,
                                        color: "white",
                                        fontWeight:
                                            location.pathname === item.path ? "bold" : "medium",
                                        borderRadius: "25px",
                                        backgroundColor:
                                            location.pathname === item.path
                                                ? "rgba(255,255,255,0.2)"
                                                : "transparent",
                                        boxShadow:
                                            location.pathname === item.path
                                                ? "0 3px 10px rgba(0,0,0,0.2)"
                                                : "none",
                                        transition: "all 0.25s",
                                        "&:hover": {
                                            backgroundColor: "rgba(255,255,255,0.3)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {/* Mobile Hamburger */}
                    {isMobile && (
                        <IconButton color="inherit" edge="end" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={toggleDrawer}
                PaperProps={{
                    sx: {
                        width: 260,
                        background: "linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
            >
                <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Flight-Booking-App
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
                <List>
                    {navItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            component={RouterLink}
                            to={item.path}
                            onClick={toggleDrawer}
                            sx={{
                                borderRadius: "12px",
                                mx: 1,
                                my: 0.5,
                                "&.active, &:hover": {
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                },
                            }}
                            selected={location.pathname === item.path}
                        >
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontWeight:
                                        location.pathname === item.path ? "bold" : "medium",
                                    fontSize: "0.95rem",
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default TopMenu;
