import { useState } from "react";
import PropTypes from "prop-types";
import { updateReporter } from "../../service/reporters";
import {
    Box,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    Paper,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import DOMPurify from "dompurify";

export function ReporterForm({ reporter }) {
    const positions = [
        "متعاون",
        "مراسل",
        "محرر",
        "مدير",
        "مدير عام",
        "مدير المراسلين",
        "الأرشيف",
        "شركات",
    ];
    const [formData, setFormData] = useState({
        firstName: reporter.firstName,
        lastName: reporter.lastName,
        phoneNumber: reporter.phoneNumber,
        position: reporter.position,
        city: reporter.city,
        isBlocked: reporter.isBlocked,
        Verified: reporter.Verified,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : DOMPurify.sanitize(value),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        updateReporter(reporter.TelegramId, formData)
            .then((response) => {
                window.location.href = "/dashboard/reporters";
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Reporter Form
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="الأسم الأول"
                        variant="outlined"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="الأسم الأخير"
                        variant="outlined"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="رقم الهاتف"
                        variant="outlined"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="المدينة"
                        variant="outlined"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <FormControl fullWidth>
                        <InputLabel
                            id="reporterPosition-label"
                            name="reporterPosition"
                            sx={{
                                textAlign: "left",
                                display: "flex",
                            }}
                        >
                            الصفة
                        </InputLabel>
                        <Select
                            fullWidth
                            labelId="reporterPosition-label"
                            id="reporterPosition"
                            value={formData.position}
                            label="الصفة"
                            onChange={handleChange}
                            sx={{
                                display: "block",
                            }}
                        >
                            {positions.map((position) => (
                                <MenuItem
                                    value={position}
                                    sx={{
                                        display: "block",
                                        textAlign: "center",
                                    }}
                                >
                                    {position}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box mb={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="Verified"
                                checked={formData.Verified}
                                onChange={handleChange}
                            />
                        }
                        label={<Typography>مفعل</Typography>}
                    />
                </Box>
                <Box mb={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isBlocked"
                                checked={formData.isBlocked}
                                onChange={handleChange}
                            />
                        }
                        label={<Typography>محظور</Typography>}
                    />
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        backgroundColor: "#d50202",
                        color: "white",
                        "&:hover": { backgroundColor: "#ff4c4c" },
                    }}
                    onClick={handleSubmit}
                >
                    تحديث
                </Button>
            </form>
        </Paper>
    );
}

ReporterForm.propTypes = {
    reporter: PropTypes.object.isRequired,
};
