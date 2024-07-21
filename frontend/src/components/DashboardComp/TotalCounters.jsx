import PropTypes from "prop-types";
import { Box, Paper, Typography } from "@mui/material";

export default function TotalCounters({ reports, reporters }) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-around", mb: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", width: "30%" }}>
                <Typography variant="h6">إجمالي التقارير</Typography>
                <Typography variant="h4">{reports.length}</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: "center", width: "30%" }}>
                <Typography variant="h6">إجمالي المراسلين</Typography>
                <Typography variant="h4">{reporters.length}</Typography>
            </Paper>
        </Box>
    );
}

TotalCounters.propTypes = {
    reports: PropTypes.array.isRequired,
    reporters: PropTypes.array.isRequired,
};
