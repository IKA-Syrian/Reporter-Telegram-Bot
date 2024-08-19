import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "./App.css";
import "./index.css";
import {
    MainPageLogin,
    Dashboard,
    Reports,
    Reporters,
    EditReporter,
    EditReport,
    SingleReport,
    SingleReporter,
    Logs,
    Users,
    AddUser,
    EditUser,
    SingleUser,
} from "./pages";
const getCssVariable = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name);

const theme = createTheme({
    palette: {
        primary: {
            main: getCssVariable("--color-primary-100").trim(),
            light: getCssVariable("--color-primary-200").trim(),
            dark: getCssVariable("--color-primary-300").trim(),
        },
        background: {
            paper: getCssVariable("--color-surface-100").trim(),
            default: getCssVariable("--color-surface-200").trim(),
        },
        text: {
            primary: getCssVariable("--color-surface-500").trim(),
            secondary: getCssVariable("--color-surface-400").trim(),
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
    },
});
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => (
    <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path="/" element={<MainPageLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/reports" element={<Reports />} />
                <Route path="/dashboard/reporters" element={<Reporters />} />
                <Route
                    path="/dashboard/reports/:id/view"
                    element={<SingleReport />}
                />
                <Route
                    path="/dashboard/reports/:id/edit"
                    element={<EditReport />}
                />
                <Route
                    path="/dashboard/reporters/:id/view"
                    element={<SingleReporter />}
                />
                <Route
                    path="/dashboard/reporters/:id/edit"
                    element={<EditReporter />}
                />
                <Route path="/dashboard/users" element={<Users />} />
                <Route path="/dashboard/users/add" element={<AddUser />} />
                <Route
                    path="/dashboard/users/:id/edit"
                    element={<EditUser />}
                />
                <Route
                    path="/dashboard/users/:id/view"
                    element={<SingleUser />}
                />
                <Route path="/dashboard/logs" element={<Logs />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </Router>
    </ThemeProvider>
);

export default App;
