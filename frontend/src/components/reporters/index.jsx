import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    TextField,
    Button,
    IconButton,
    Paper,
    Box,
    TableContainer,
    TableSortLabel,
    Pagination,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { deleteReporter } from "../../service/reporters";

export function ReportersComp({ reporters }) {
    const navigate = useNavigate();
    const [selectedReporters, setSelectedReporters] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedReporters, setSortedReporters] = useState([...reporters]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 25;

    useEffect(() => {
        setSortedReporters([...reporters]);
    }, [reporters]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleReporterEdit = (reporterId) => {
        navigate(`/dashboard/reporters/${reporterId}/edit`);
    };

    const handleDelete = (reporterIds) => {
        const ConfirmationMessage = window.confirm(
            `Are you sure you want to delete ${
                reporterIds.length > 1 ? "these reporters" : "this reporter"
            }?`
        );
        if (ConfirmationMessage) {
            reporterIds.forEach((reporterId) => {
                deleteReporter(reporterId)
                    .then((response) => {
                        console.log(response);
                        window.location.reload();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        }
    };

    const handleSelectReporter = (reporterId) => {
        setSelectedReporters((prevSelected) =>
            prevSelected.includes(reporterId)
                ? prevSelected.filter((id) => id !== reporterId)
                : [...prevSelected, reporterId]
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedReporters(
                reporters.map((reporter) => reporter.TelegramId)
            );
        } else {
            setSelectedReporters([]);
        }
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        setSortedReporters((prevSorted) => {
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

    const filteredReporters = sortedReporters.filter(
        (reporter) =>
            reporter.firstName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            reporter.lastName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            reporter.phoneNumber.includes(searchTerm) ||
            reporter.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedReporters = filteredReporters.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                mb={2}
                sx={{ color: "white" }}
            >
                <TextField
                    label="البحث"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputLabelProps={{
                        style: { color: "white" },
                    }}
                    InputProps={{
                        style: { color: "white", borderColor: "white" },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "white",
                            },
                            "&:hover fieldset": {
                                borderColor: "white",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "white",
                            },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#d50202",
                        color: "white",
                        "&:hover": { backgroundColor: "#ff4c4c" },
                        "&:disabled": {
                            backgroundColor: "#12304c",
                            color: "white",
                        },
                    }}
                    onClick={() => handleDelete(selectedReporters)}
                    disabled={selectedReporters.length === 0}
                >
                    حذف المحدد
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={
                                        selectedReporters.length ===
                                            reporters.length &&
                                        selectedReporters.length > 0
                                    }
                                />
                            </TableCell>
                            {[
                                { key: "TelegramId", label: "المعرف" },
                                { key: "firstName", label: "الأسم الاول" },
                                { key: "lastName", label: "الأسم الأخير" },
                                { key: "phoneNumber", label: "رقم الهاتف" },
                                { key: "city", label: "المدينة" },
                                { key: "Verified", label: "الحالة" },
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
                            <TableCell>تعديل</TableCell>
                            <TableCell>حذف</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedReporters.map((reporter) => (
                            <TableRow key={reporter.TelegramId}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedReporters.includes(
                                            reporter.TelegramId
                                        )}
                                        onChange={() =>
                                            handleSelectReporter(
                                                reporter.TelegramId
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={`/dashboard/reporters/${reporter.TelegramId}/view`}
                                    >
                                        {reporter.TelegramId}
                                    </Link>
                                </TableCell>
                                <TableCell>{reporter.firstName}</TableCell>
                                <TableCell>
                                    {reporter.lastName.trim()}
                                </TableCell>
                                <TableCell>
                                    <a href={"tel:" + reporter.phoneNumber}>
                                        {reporter.phoneNumber}+
                                    </a>
                                </TableCell>
                                <TableCell>{reporter.city}</TableCell>
                                <TableCell>
                                    <span
                                        className={`pulsate ${
                                            reporter.Verified
                                                ? "verified"
                                                : reporter.isBlocked
                                                ? "blocked"
                                                : "pending"
                                        }`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            handleReporterEdit(
                                                reporter.TelegramId
                                            )
                                        }
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="secondary"
                                        onClick={() =>
                                            handleDelete([reporter.TelegramId])
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                display="flex"
                justifyContent="center"
                mt={2}
                backgroundColor="var(--color-surface-200)"
                p={1}
                borderRadius={15}
                maxWidth={300}
                sx={{
                    "& .MuiPagination-ul": { justifyContent: "center" },
                    marginTop: "20px",
                    display: "-webkit-inline-box",
                }}
            >
                <Pagination
                    count={Math.ceil(filteredReporters.length / recordsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    dir="rtl"
                />
            </Box>
        </Box>
    );
}

ReportersComp.propTypes = {
    reporters: PropTypes.array.isRequired,
};
