import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "./App.css";
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
} from "./pages";
const theme = createTheme({
    palette: {
        primary: {
            main: "#3f51b5",
        },
        secondary: {
            main: "#f50057",
        },
        background: {
            default: "#f4f6f8",
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
                <Route path="/dashboard/logs" element={<Logs />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </Router>
    </ThemeProvider>
);

export default App;
