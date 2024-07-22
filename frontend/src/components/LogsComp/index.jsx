import React, { useState, useEffect } from "react";
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
    Checkbox,
    TableSortLabel,
    Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function LogsComp({ logs }) {
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedLogs, setSortedLogs] = useState([...logs]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    useEffect(() => {
        setSortedLogs([...logs]);
    }, [logs]);

    const handleSelectLog = (_id) => {
        setSelectedLogs((prevSelected) =>
            prevSelected.includes(_id)
                ? prevSelected.filter((id) => id !== _id)
                : [...prevSelected, _id]
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedLogs(logs.map((log) => log._id));
        } else {
            setSelectedLogs([]);
        }
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        setSortedLogs((prevSorted) => {
            return [...prevSorted].sort((a, b) => {
                if (a[key] < b[key]) {
                    return direction === "asc" ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        });
    };

    const renderLogData = (logData) => {
        const fromData = logData.from;
        const toData = logData.to;

        const renderTableRow = (key, fromValue, toValue, isChanged) => (
            <TableRow key={key}>
                <TableCell align="right">{key}</TableCell>
                <TableCell
                    align="right"
                    style={{
                        backgroundColor: isChanged ? "#c81f1f" : "inherit",
                        color: isChanged ? "white" : "inherit",
                    }}
                >
                    {JSON.stringify(fromValue)}
                </TableCell>
                <TableCell
                    align="right"
                    style={{
                        backgroundColor: isChanged ? "green" : "inherit",
                        color: isChanged ? "white" : "inherit",
                    }}
                >
                    {JSON.stringify(toValue)}
                </TableCell>
            </TableRow>
        );

        const handleArrayDifferences = (key, fromArray, toArray) => {
            const fromSet = new Set(
                fromArray.map((item) => JSON.stringify(item))
            );
            const toSet = new Set(toArray.map((item) => JSON.stringify(item)));
            const addedItems = toArray.filter(
                (item) => !fromSet.has(JSON.stringify(item))
            );
            const removedItems = fromArray.filter(
                (item) => !toSet.has(JSON.stringify(item))
            );

            return (
                <React.Fragment key={key}>
                    <TableRow>
                        <TableCell colSpan={3} align="right">
                            <Typography variant="subtitle2" fontWeight="bold">
                                {key}:
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">
                                            File Unique ID
                                        </TableCell>
                                        <TableCell align="right">
                                            File Path
                                        </TableCell>
                                        <TableCell align="right">
                                            MIME Type
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fromArray.map((item, index) => (
                                        <TableRow key={`${key}-from-${index}`}>
                                            <TableCell align="right">
                                                {item.file_unique_id}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    backgroundColor:
                                                        removedItems.includes(
                                                            item
                                                        )
                                                            ? "#c81f1f"
                                                            : "inherit",
                                                    color: removedItems.includes(
                                                        item
                                                    )
                                                        ? "white"
                                                        : "inherit",
                                                }}
                                            >
                                                {item.filePath}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.mime_type}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {addedItems.map((item, index) => (
                                        <TableRow key={`${key}-to-${index}`}>
                                            <TableCell align="right">
                                                {item.file_unique_id} (added)
                                            </TableCell>
                                            <TableCell align="right">
                                                N/A
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    backgroundColor: "green",
                                                    color: "white",
                                                }}
                                            >
                                                {item.filePath}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.mime_type}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableCell>
                    </TableRow>
                </React.Fragment>
            );
        };

        return Object.keys(fromData).map((key) => {
            const fromValue = fromData[key];
            const toValue = toData[key];

            if (Array.isArray(fromValue) || Array.isArray(toValue)) {
                // Handle array differences
                return handleArrayDifferences(key, fromValue, toValue);
            }

            if (typeof fromValue === "object" && fromValue !== null) {
                // Handle nested objects
                return (
                    <TableRow key={key}>
                        <TableCell colSpan={3} align="right">
                            <Typography variant="subtitle2" fontWeight="bold">
                                {key}:
                            </Typography>
                            {renderLogData({
                                from: fromValue,
                                to: toValue,
                            })}
                        </TableCell>
                    </TableRow>
                );
            }

            const isChanged = fromValue !== toValue;
            return renderTableRow(key, fromValue, toValue, isChanged);
        });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const paginatedLogs = sortedLogs.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <Box p={3} dir="ltr">
            <Typography variant="h4" gutterBottom>
                سجلات النشاط
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={
                                        selectedLogs.length === logs.length &&
                                        selectedLogs.length > 0
                                    }
                                />
                            </TableCell>
                            {[
                                { key: "_id", label: "ID" },
                                { key: "logDate", label: "Updated At" },
                                { key: "ActionType", label: "Action" },
                                { key: "username", label: "username" },
                                // { key: "reportDescription", label: "التقرير" },
                            ].map((column) => (
                                <TableCell
                                    key={column.key}
                                    sortDirection={
                                        sortConfig.key === column.key
                                            ? sortConfig.direction
                                            : false
                                    }
                                >
                                    <TableSortLabel
                                        active={sortConfig.key === column.key}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort(column.key)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedLogs.map((log) => (
                            <React.Fragment key={log._id}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedLogs.includes(
                                                log._id
                                            )}
                                            onChange={() =>
                                                handleSelectLog(log._id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{log._id}</TableCell>
                                    <TableCell>{log.logDate}</TableCell>
                                    <TableCell>{log.ActionType}</TableCell>
                                    <TableCell>{log.username}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography>
                                                    {log.ActionType} by{" "}
                                                    {log.username}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <TableContainer
                                                            component={Paper}
                                                            sx={{
                                                                width: "100%",
                                                                backgroundColor:
                                                                    "#242424",
                                                                color: "white",
                                                                "& th, td": {
                                                                    backgroundColor:
                                                                        "#242424",
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
                                                                    {renderLogData(
                                                                        log.logData
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                display="flex"
                justifyContent="center"
                mt={2}
                backgroundColor="#fff"
                p={1}
                borderRadius={15}
                maxWidth={300}
                // margin="auto"
                sx={{
                    "& .MuiPagination-ul": { justifyContent: "center" },
                    marginTop: "20px",
                    display: "-webkit-inline-box",
                }}
            >
                <Pagination
                    count={Math.ceil(logs.length / recordsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    dir="rtl"
                />
            </Box>
        </Box>
    );
}
