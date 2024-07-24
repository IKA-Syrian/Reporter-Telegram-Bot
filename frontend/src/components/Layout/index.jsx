import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import MenuComponent from "../MenuComponent";
import { logout } from "../../service/users";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const getCssVariable = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name);

// Create RTL cache
const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});

// Create a theme with RTL direction
const theme = createTheme({
    palette: {
        primary: {
            main: getCssVariable("--color-primary-500").trim(),
            light: getCssVariable("--color-primary-200").trim(),
            dark: getCssVariable("--color-primary-100").trim(),
        },
        secondary: {
            main: getCssVariable("--color-secondary-600").trim(),
        },
        background: {
            paper: getCssVariable("--color-surface-200").trim(),
            default: getCssVariable("--color-surface-200").trim(),
        },
        text: {
            primary: getCssVariable("--color-surface-700").trim(),
            secondary: getCssVariable("--color-surface-400").trim(),
        },
    },
    direction: "rtl",
});

export function Layout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate, Cookies]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    const handleLogout = async () => {
        try {
            const token = Cookies.get("token");
            const response = await logout(token);
            if (response.message) {
                Cookies.remove("token");
                window.location.href = "/";
            }
        } catch (error) {
            setError("حدث خطأ ما");
        }
    };
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Box dir="rtl">
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleSidebarToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" style={{ flexGrow: 1 }}>
                                Dashboard
                            </Typography>
                            <Button
                                color="inherit"
                                onClick={() => handleLogout()}
                            >
                                Logout
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <MenuComponent
                        open={isSidebarOpen}
                        onClose={handleSidebarToggle}
                    />
                    <main>{children}</main>
                </Box>
            </ThemeProvider>
        </CacheProvider>
    );
}
