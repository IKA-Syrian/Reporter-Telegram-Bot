import PropTypes from "prop-types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function LatestReports({ reports }) {
    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + "...";
        }
        return text;
    };
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>رقم التقرير</TableCell>
                        <TableCell>تاريخ التقرير</TableCell>
                        <TableCell>عنوان التقرير</TableCell>
                        <TableCell>وصف التقرير</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report.reportID}>
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
                                    {report.reportDescription
                                        ? truncateText(
                                              report.reportDescription,
                                              15
                                          )
                                        : "لا يوجد وصف"}
                                </pre>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

LatestReports.propTypes = {
    reports: PropTypes.array.isRequired,
};
