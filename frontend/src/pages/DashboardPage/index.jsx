import React, { useEffect, useState } from "react";
import { getReports } from "../../service/reports";
import { getReporters } from "../../service/reporters";
import { DashboardComp } from "../../components/";
import { Layout } from "../../components/";
import {
    Box,
    Grid,
    Typography,
    Paper,
    IconButton,
    Button,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";

export function Dashboard() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [reporters, setReporters] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    // const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const token = Cookies.get("token");
            const reportsData = await getReports(5, token);
            const reportersData = await getReporters(5, token);
            setReports(reportsData);
            setReporters(reportersData);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     const token = Cookies.get("token");
    //     console.log(token);
    //     if (!token) {
    //         navigate("/");
    //     } else {
    //         setLoading(true);
    //     }
    // }, [navigate, Cookies]);

    useEffect(() => {
        fetchData();

        const updateInterval =
            new Date().getHours() >= 0 && new Date().getHours() < 8
                ? 3600000
                : 120000;
        const intervalId = setInterval(fetchData, updateInterval);

        return () => clearInterval(intervalId);
    }, []);

    return (
        !loading && (
            <Layout>
                <h1>Dashboard</h1>
                {/* <Grid item xs={12} md={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}> */}
                <DashboardComp reports={reports} reporters={reporters} />
                {/* </Paper>
                </Grid> */}
            </Layout>
        )
    );
}
