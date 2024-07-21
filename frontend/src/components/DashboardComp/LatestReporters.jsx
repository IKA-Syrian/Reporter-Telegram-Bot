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
export default function LatestReporters({ reporters }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>رقم المراسل</TableCell>
                        <TableCell>الاسم الأول</TableCell>
                        <TableCell>اسم العائلة</TableCell>
                        <TableCell>رقم الهاتف</TableCell>
                        <TableCell>المدينة</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reporters.map((reporter) => (
                        <TableRow key={reporter.TelegramId}>
                            <TableCell>
                                <Link
                                    to={`/dashboard/reporters/${reporter.TelegramId}/view`}
                                >
                                    {reporter.TelegramId}
                                </Link>
                            </TableCell>
                            <TableCell>{reporter.firstName}</TableCell>
                            <TableCell>{reporter.lastName}</TableCell>
                            <TableCell>
                                <a href={"tel:" + reporter.phoneNumber}>
                                    +{reporter.phoneNumber}
                                </a>
                            </TableCell>
                            <TableCell>{reporter.city}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

LatestReporters.propTypes = {
    reporters: PropTypes.array.isRequired,
};
