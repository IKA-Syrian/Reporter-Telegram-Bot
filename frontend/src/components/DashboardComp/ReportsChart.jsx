import PropTypes from "prop-types";
import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import {
    format,
    subDays,
    eachHourOfInterval,
    eachDayOfInterval,
    isSameHour,
    parseISO,
    isValid,
    isSameDay,
    startOfDay,
    addHours,
} from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const date = format(parseISO(label), "yyyy-MM-dd");
        return (
            <Box
                sx={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    padding: 2,
                }}
            >
                <Typography variant="subtitle1" gutterBottom color={"#000"}>
                    {date}
                </Typography>
                {payload.map((item) => (
                    <Typography
                        key={item.dataKey}
                        variant="body2"
                        color={item.color}
                    >
                        {item.dataKey}: {item.value}
                    </Typography>
                ))}
            </Box>
        );
    }

    return null;
};

export default function ReportsChart({ reports, reporters }) {
    const [dateRange, setDateRange] = useState("7");

    const getDateRange = (days) => {
        if (days === "0") {
            const today = format(new Date(), "yyyy-MM-dd");
            return [today];
        }
        const end = new Date();
        const start = subDays(end, days - 1);
        return eachDayOfInterval({ start, end }).map((date) =>
            format(date, "yyyy-MM-dd")
        );
    };

    const getHourlyRange = (day) => {
        const start = startOfDay(parseISO(day));
        const end = addHours(start, 24);
        return eachHourOfInterval({ start, end }).map((date) =>
            format(date, "yyyy-MM-dd HH:00")
        );
    };

    const filterDataByDateRange = (data, dateRange, dateField) => {
        if (dateRange === "0" || dateRange === "1") {
            const day =
                dateRange === "0"
                    ? format(new Date(), "yyyy-MM-dd")
                    : format(subDays(new Date(), 1), "yyyy-MM-dd");
            const range = getHourlyRange(day);
            return range.map((hour) => ({
                date: hour,
                count: data.filter((item) => {
                    if (!item[dateField]) return false; // Check if date exists
                    const itemDate = parseISO(item[dateField]);
                    return (
                        isValid(itemDate) &&
                        isSameHour(itemDate, parseISO(hour))
                    );
                }).length,
            }));
        } else {
            const range = getDateRange(Number(dateRange));
            return range.map((date) => ({
                date,
                count: data.filter((item) => {
                    if (!item[dateField]) return false; // Check if date exists
                    const itemDate = parseISO(item[dateField]);
                    return (
                        isValid(itemDate) && isSameDay(itemDate, parseISO(date))
                    );
                }).length,
            }));
        }
    };

    const reportData = filterDataByDateRange(reports, dateRange, "reportDate");
    const reporterData = filterDataByDateRange(
        reporters,
        dateRange,
        "reportDate"
    ); // Adjust the field name if necessary

    return (
        <Box
            sx={{
                mb: 5,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
            dir="rtl"
        >
            <Box
                display="flex"
                justifyContent="space-between"
                mb={2}
                width="100%"
                maxWidth="900px"
            >
                <Typography variant="h5">
                    تقارير ومراسلين بمرور الوقت
                </Typography>
                <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    sx={{
                        backgroundColor: "white",
                        minWidth: 120, // Adjust the width as per your requirement
                    }}
                >
                    <MenuItem value="0">اليوم</MenuItem>
                    <MenuItem value="1">الأمس</MenuItem>
                    <MenuItem value="7">آخر 7 أيام</MenuItem>
                    <MenuItem value="14">آخر 14 يوم</MenuItem>
                    <MenuItem value="30">هذا الشهر</MenuItem>
                    <MenuItem value="60">الشهر الماضي</MenuItem>
                </Select>
            </Box>
            <Box sx={{ width: "100%", maxWidth: "900px" }}>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={reportData.map((report, index) => ({
                            date: report.date,
                            reports: report.count,
                            reporters: reporterData[index]?.count || 0,
                        }))}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(tick) => {
                                if (dateRange === "0" || dateRange === "1") {
                                    return format(parseISO(tick), "HH:mm");
                                } else {
                                    return format(parseISO(tick), "MM-dd");
                                }
                            }}
                            stroke="#fff"
                            tickMargin={10}
                        />
                        <YAxis stroke="#fff" tickMargin={10} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="reports"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="reporters"
                            stroke="#82ca9d"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}

ReportsChart.propTypes = {
    reports: PropTypes.array.isRequired,
    reporters: PropTypes.array.isRequired,
};
