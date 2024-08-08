import { useState } from "react";
import PropTypes from "prop-types";
import { addUser } from "../../service/users";
import {
    Box,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    Paper,
} from "@mui/material";
import DOMPurify from "dompurify";

export function AddUserForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        isAdmin: false,
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
        addUser(formData)
            .then((response) => {
                window.location.href = "/dashboard/users";
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Add User Form
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="email"
                        variant="outlined"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password"
                        variant="outlined"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleChange}
                        />
                    }
                    label={<Typography>is Admin</Typography>}
                />
                <Box mb={2}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}
