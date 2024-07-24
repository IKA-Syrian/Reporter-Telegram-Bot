import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { Home, Article, Contacts, Person, History } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { getUser } from "../../service/users";
import Cookies from "js-cookie";

const getCssVariable = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Create RTL cache
const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});

// Create a theme with RTL direction and lighter colors
const theme = createTheme({
    palette: {
        primary: {
            main: getCssVariable("--color-primary-500"),
            light: getCssVariable("--color-primary-200"),
            dark: getCssVariable("--color-primary-100"),
        },
        background: {
            paper: getCssVariable("--color-surface-300"),
            default: getCssVariable("--color-surface-200"),
        },
        text: {
            primary: getCssVariable("--color-surface-600"),
            secondary: getCssVariable("--color-surface-400"),
        },
        secondary: {
            main: getCssVariable("--color-secondary-600"),
        },
    },
    direction: "rtl",
});

export default function MenuComponent({ open, onClose }) {
    const [isAdmin, setIsAdmin] = React.useState(false);
    React.useEffect(() => {
        const user = localStorage.getItem("username");
        const token = Cookies.get("token");
        getUser(user, token).then((response) => {
            console.log(response);
            if (response.isAdmin === true) {
                setIsAdmin(true);
            }
        });
    }, []);
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Box dir="rtl">
                    <Drawer anchor="left" open={open} onClose={onClose}>
                        <List>
                            <NavLink
                                to="/dashboard"
                                style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                }}
                            >
                                <ListItem button>
                                    <ListItemText primary="الصفحة الرئيسية" />
                                    <ListItemIcon
                                        style={{
                                            justifyContent: "flex-end",
                                            color: "#fff",
                                        }}
                                    >
                                        <Home />
                                    </ListItemIcon>
                                </ListItem>
                            </NavLink>
                            <NavLink
                                to="/dashboard/reports"
                                style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                }}
                            >
                                <ListItem button>
                                    <ListItemText primary="التقارير" />
                                    <ListItemIcon
                                        style={{
                                            justifyContent: "flex-end",
                                            color: "#fff",
                                        }}
                                    >
                                        <Article />
                                    </ListItemIcon>
                                </ListItem>
                            </NavLink>
                            <NavLink
                                to="/dashboard/reporters"
                                style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                }}
                            >
                                <ListItem button>
                                    <ListItemText primary="المراسلين" />
                                    <ListItemIcon
                                        style={{
                                            justifyContent: "flex-end",
                                            color: "#fff",
                                        }}
                                    >
                                        <Contacts />
                                    </ListItemIcon>
                                </ListItem>
                            </NavLink>
                            {isAdmin ? (
                                <>
                                    <NavLink
                                        to="/dashboard/users"
                                        style={{
                                            textDecoration: "none",
                                            color: "#fff",
                                        }}
                                    >
                                        <ListItem button>
                                            <ListItemText primary="المستخدمين" />
                                            <ListItemIcon
                                                style={{
                                                    justifyContent: "flex-end",
                                                    color: "#fff",
                                                }}
                                            >
                                                <Person />
                                            </ListItemIcon>
                                        </ListItem>
                                    </NavLink>
                                    <NavLink
                                        to="/dashboard/logs"
                                        style={{
                                            textDecoration: "none",
                                            color: "#fff",
                                        }}
                                    >
                                        <ListItem button>
                                            <ListItemText primary="السجل" />
                                            <ListItemIcon
                                                style={{
                                                    justifyContent: "flex-end",
                                                    color: "#fff",
                                                }}
                                            >
                                                <History />
                                            </ListItemIcon>
                                        </ListItem>
                                    </NavLink>
                                </>
                            ) : (
                                ""
                            )}
                        </List>
                    </Drawer>
                </Box>
            </ThemeProvider>
        </CacheProvider>
    );
}
