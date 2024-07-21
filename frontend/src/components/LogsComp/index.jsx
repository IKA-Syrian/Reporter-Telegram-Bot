import React from "react";
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function LogsComp({ logs }) {
    const renderLogData = (logData) => {
        const fromData = logData.from;
        const toData = logData.to;
        return Object.keys(fromData).map((key) => {
            if (typeof fromData[key] === "object" && fromData[key] !== null) {
                // Handle nested objects
                return (
                    <TableRow key={key}>
                        <TableCell colSpan={3} align="right">
                            <Typography variant="subtitle2" fontWeight="bold">
                                {key}:
                            </Typography>
                            {renderLogData({
                                from: fromData[key],
                                to: toData[key],
                            })}
                        </TableCell>
                    </TableRow>
                );
            }
            const isChanged = fromData[key] !== toData[key];
            return (
                <TableRow key={key}>
                    <TableCell align="right">{key}</TableCell>
                    <TableCell
                        align="right"
                        style={{
                            backgroundColor: isChanged ? "#c81f1f" : "inherit",
                            color: isChanged ? "white" : "inherit",
                        }}
                    >
                        {JSON.stringify(fromData[key])}
                    </TableCell>
                    <TableCell
                        align="right"
                        style={{
                            backgroundColor: isChanged ? "green" : "inherit",
                            color: isChanged ? "white" : "inherit",
                        }}
                    >
                        {JSON.stringify(toData[key])}
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <Box p={3} dir="ltr">
            <Typography variant="h4" gutterBottom>
                سجلات النشاط
            </Typography>
            {logs.map((log) => (
                <Accordion key={log._id.$oid}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>
                            {log.ActionType} Established By {log.username}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        width: "100%",
                                        backgroundColor: "#242424",
                                        color: "white",
                                        "& th, td": {
                                            backgroundColor: "#242424",
                                            color: "white",
                                            border: "1px solid #333",
                                        },
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">
                                                    Key
                                                </TableCell>
                                                <TableCell align="center">
                                                    FROM
                                                </TableCell>
                                                <TableCell align="center">
                                                    TO
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {renderLogData(log.logData)}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}
