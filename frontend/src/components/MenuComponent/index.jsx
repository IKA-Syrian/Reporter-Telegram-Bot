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
// Create RTL cache
const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});

// Create a theme with RTL direction
const theme = createTheme({
    direction: "rtl",
});

export default function MenuComponent({ open, onClose }) {
    const [isAdmin, setIsAdmin] = React.useState(false);
    React.useEffect(() => {
        const user = localStorage.getItem("username");
        const token = Cookies.get("token");
        getUser(user, token).then((response) => {
            console.log(response);
            if (response.isAdmin == true) {
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
                            <NavLink to="/dashboard">
                                <ListItem button>
                                    <ListItemText primary="الصفحة الرئيسية" />

                                    <ListItemIcon
                                        style={{ justifyContent: "flex-end" }}
                                    >
                                        <Home />
                                    </ListItemIcon>
                                </ListItem>
                            </NavLink>
                            <NavLink to="/dashboard/reports">
                                <ListItem button>
                                    <ListItemText primary="التقارير" />

                                    <ListItemIcon
                                        style={{ justifyContent: "flex-end" }}
                                    >
                                        <Article />
                                    </ListItemIcon>
                                </ListItem>
                            </NavLink>
                            <NavLink to="/dashboard/reporters">
                                <ListItem button>
                                    <ListItemText primary="المراسلين" />

                                    <ListItemIcon
                                        style={{ justifyContent: "flex-end" }}
                                    >
                                        <Contacts />
                                    </ListItemIcon>
                                </ListItem>
                            </NavLink>
                            {isAdmin ? (
                                <>
                                    <NavLink to="/dashboard/users">
                                        <ListItem button>
                                            <ListItemText primary="المستخدمين" />

                                            <ListItemIcon
                                                style={{
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <Person />
                                            </ListItemIcon>
                                        </ListItem>
                                    </NavLink>
                                    <NavLink to="/dashboard/logs">
                                        <ListItem button>
                                            <ListItemText primary="السجل" />

                                            <ListItemIcon
                                                style={{
                                                    justifyContent: "flex-end",
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
