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
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    ListItemText,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { deleteReport } from "../../service/reports";
const APP_URL = import.meta.env.VITE_APP_URL;
export function ReportsComp({ reports }) {
    const navigate = useNavigate();
    const [selectedReports, setSelectedReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedReports, setSortedReports] = useState([...reports]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    const [filterStatus, setFilterStatus] = useState([]);
    const statusOptions = [
        { label: "مقبول", value: "accepted" },
        { label: "في الانتظار", value: "pending" },
        { label: "مرفوض", value: "rejected" },
    ];

    useEffect(() => {
        setSortedReports([...reports]);
    }, [reports]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleReportEdit = (reportID) => {
        navigate(`/dashboard/reports/${reportID}/edit`);
    };
    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };
    const handleDelete = (reportIDs) => {
        const ConfirmationMessage = window.confirm(
            `Are you sure you want to delete ${
                reportIDs.length > 1 ? "these reports" : "this report"
            }?`
        );
        if (ConfirmationMessage) {
            reportIDs.forEach((reportID) => {
                // Assuming you have a delete function for reports
                deleteReport(reportID)
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

    const handleSelectReport = (reportID) => {
        setSelectedReports((prevSelected) =>
            prevSelected.includes(reportID)
                ? prevSelected.filter((id) => id !== reportID)
                : [...prevSelected, reportID]
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedReports(reports.map((report) => report.reportID));
        } else {
            setSelectedReports([]);
        }
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        setSortedReports((prevSorted) => {
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

    const filteredReports = sortedReports
        .filter(
            (report) =>
                report.reportTitle.includes(searchTerm) ||
                report.reportDescription.toLowerCase().includes(searchTerm)
        )
        .filter((report) => {
            if (
                filterStatus.includes("accepted") &&
                report.reportStatus === "accepted"
            )
                return true;
            if (
                filterStatus.includes("pending") &&
                report.reportStatus === "pending"
            )
                return true;
            if (
                filterStatus.includes("rejected") &&
                report.reportStatus === "rejected"
            )
                return true;
            if (filterStatus.length === 0) return true;
        });

    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + "...";
        }
        return text;
    };

    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Box display="flex" gap={2}>
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
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="filter-status-label">
                            فلتر الحالة
                        </InputLabel>
                        <Select
                            labelId="filter-status-label"
                            id="filter-status"
                            multiple
                            value={filterStatus}
                            onChange={handleFilterChange}
                            input={<OutlinedInput label="فلتر الحالة" />}
                            renderValue={(selected) =>
                                selected
                                    .map(
                                        (value) =>
                                            statusOptions.find(
                                                (option) =>
                                                    option.value === value
                                            )?.label
                                    )
                                    .join(", ")
                            }
                        >
                            {statusOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    <Checkbox
                                        checked={filterStatus.includes(
                                            option.value
                                        )}
                                    />
                                    <ListItemText primary={option.label} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
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
                    onClick={() => handleDelete(selectedReports)}
                    disabled={selectedReports.length === 0}
                >
                    حذف المحدد
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table className="reports-table">
                    <TableHead>
                        <TableRow className="ReportHead">
                            <TableCell padding="checkbox">
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={
                                        selectedReports.length ===
                                            reports.length &&
                                        selectedReports.length > 0
                                    }
                                />
                            </TableCell>
                            {[
                                { key: "reportID", label: "المعرف" },
                                { key: "reportDate", label: "تاريخ الإنشاء" },
                                { key: "reportTitle", label: "العنوان" },
                                { key: "reportDescription", label: "التقرير" },
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
                            <TableCell>المرفقات</TableCell>
                            <TableCell>الحالة</TableCell>
                            <TableCell>التعديل</TableCell>
                            <TableCell>الحذف</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedReports.map((report) => (
                            <TableRow key={report.reportID}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedReports.includes(
                                            report.reportID
                                        )}
                                        onChange={() =>
                                            handleSelectReport(report.reportID)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={`/dashboard/reports/${report.reportID}/view`}
                                    >
                                        {report.reportID}
                                    </Link>
                                </TableCell>
                                <TableCell>{report.reportDate}</TableCell>
                                <TableCell>
                                    <Link
                                        to={`/dashboard/reports/${report.reportID}/view`}
                                    >
                                        {report.reportTitle}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <pre style={{ textAlign: "right" }}>
                                        {report.reportDescription ? (
                                            truncateText(
                                                report.reportDescription,
                                                35
                                            )
                                        ) : (
                                            <h2
                                                style={{
                                                    textAlign: "right",
                                                }}
                                            >
                                                لا يوجد وصف
                                            </h2>
                                        )}
                                    </pre>
                                </TableCell>
                                <TableCell>
                                    <div className="attachments-container">
                                        {report.reportAttachments &&
                                        report.reportAttachments.length > 0 ? (
                                            <>
                                                {report.reportAttachments
                                                    .slice(0, 5)
                                                    .map((attachment) => {
                                                        const filePath =
                                                            APP_URL +
                                                            attachment.filePath
                                                                .split("/")
                                                                .slice(4)
                                                                .join("/");
                                                        if (
                                                            attachment.mime_type.startsWith(
                                                                "image"
                                                            )
                                                        ) {
                                                            return (
                                                                <a
                                                                    key={
                                                                        attachment.file_unique_id
                                                                    }
                                                                    href={
                                                                        filePath
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <img
                                                                        className="attachment-thumbnail"
                                                                        src={
                                                                            filePath
                                                                        }
                                                                        alt="attachment"
                                                                    />
                                                                </a>
                                                            );
                                                        } else {
                                                            return (
                                                                <a
                                                                    key={
                                                                        attachment.file_unique_id
                                                                    }
                                                                    href={
                                                                        filePath
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <video
                                                                        width="50"
                                                                        height="50"
                                                                        controls
                                                                        className="attachment-thumbnail"
                                                                    >
                                                                        <source
                                                                            src={
                                                                                filePath
                                                                            }
                                                                            type="video/mp4"
                                                                        />
                                                                    </video>
                                                                </a>
                                                            );
                                                        }
                                                    })}
                                                {report.reportAttachments
                                                    .length > 5 && (
                                                    <div className="more-images">
                                                        +
                                                        {report
                                                            .reportAttachments
                                                            .length - 5}{" "}
                                                        more
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <h2
                                                style={{
                                                    textAlign: "center",
                                                }}
                                            >
                                                لا يوجد مرفقات
                                            </h2>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`pulsate ${
                                            report.reportStatus === "accepted"
                                                ? "verified"
                                                : report.reportStatus ===
                                                  "rejected"
                                                ? "blocked"
                                                : "pending"
                                        }`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            handleReportEdit(report.reportID)
                                        }
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="secondary"
                                        onClick={() =>
                                            handleDelete([report.reportID])
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
                    count={Math.ceil(filteredReports.length / recordsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    dir="rtl"
                />
            </Box>
        </Box>
    );
}

ReportsComp.propTypes = {
    reports: PropTypes.array.isRequired,
};
