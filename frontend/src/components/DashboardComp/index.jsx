import { useState, useEffect } from "react";
import LatestReports from "./LatestReports";
import LatestReporters from "./LatestReporters";
import TotalCounters from "./TotalCounters";
import ReportsChart from "./ReportsChart";
import { Box, Paper, Typography, Grid } from "@mui/material";

export function DashboardComp({ reports, reporters }) {
    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <TotalCounters reports={reports} reporters={reporters} />
            <ReportsChart reports={reports} reporters={reporters} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, mb: 2, backgroundColor: "#eeeef7" }}>
                        <Typography variant="h5" gutterBottom>
                            أحدث المراسلين
                        </Typography>
                        <LatestReporters reporters={reporters} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, mb: 2, backgroundColor: "#eeeef7" }}>
                        <Typography variant="h5" gutterBottom>
                            أحدث التقارير
                        </Typography>
                        <LatestReports reports={reports} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
