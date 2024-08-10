import { useState, useEffect } from "react";
import LatestReports from "./LatestReports";
import LatestReporters from "./LatestReporters";
import TotalCounters from "./TotalCounters";
import ReportsChart from "./ReportsChart";
import { Box, Paper, Typography, Grid } from "@mui/material";

export function DashboardComp({ reports, reporters }) {
    // console.log(reports.reports);
    const reportData = reports.reports;
    const reportTotal = reports.total;
    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <TotalCounters reports={reportTotal} reporters={reporters} />
            <ReportsChart reports={reportData} reporters={reporters} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            mb: 2,
                            backgroundColor: "var(--color-surface-600)",
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            أحدث المراسلين
                        </Typography>
                        <LatestReporters reporters={reporters} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            mb: 2,
                            backgroundColor: "var(--color-surface-600)",
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            أحدث التقارير
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            أحدث 5 تقارير تم تقديمها
                        </Typography>
                        <LatestReports reports={reportData} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
