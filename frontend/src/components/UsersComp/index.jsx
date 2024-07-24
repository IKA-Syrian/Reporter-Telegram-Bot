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
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
} from "@mui/icons-material";
// import { get}

export function UsersComp({ users }) {
    const navigate = useNavigate();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedUsers, setSortedUsers] = useState([...users]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 25;

    useEffect(() => {
        setSortedUsers([...users]);
    }, [users]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleUserEdit = (userId) => {
        navigate(`/dashboard/users/${userId}/edit`);
    };

    const handleDelete = (userIds) => {
        const ConfirmationMessage = window.confirm(
            `Are you sure you want to delete ${
                userIds.length > 1 ? "these users" : "this user"
            }?`
        );
        if (ConfirmationMessage) {
            userIds.forEach((userId) => {
                deleteUser(userId)
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

    const handleSelectUser = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedUsers(users.map((user) => user._id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        setSortedUsers((prevSorted) => {
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

    const handleAdd = () => {
        navigate("/dashboard/users/add");
    };
    const filteredUsers = sortedUsers.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user._id.toString().includes(searchTerm)
    );

    const paginatedUsers = filteredUsers.slice(
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
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <IconButton
                        color="primary"
                        onClick={() => handleAdd()}
                        sx={{
                            borderRadius: "50%",
                            border: "2px solid",
                            margin: "auto 10px",
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#d50202",
                            color: "white",
                            height: "100%",
                            "&:hover": { backgroundColor: "#ff4c4c" },
                            "&:disabled": {
                                backgroundColor: "#12304c",
                                color: "white",
                            },
                        }}
                        onClick={() => handleDelete(selectedUsers)}
                        disabled={selectedUsers.length === 0}
                    >
                        حذف المحدد
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={
                                        selectedUsers.length === users.length &&
                                        selectedUsers.length > 0
                                    }
                                />
                            </TableCell>
                            {[
                                { key: "_id", label: "المعرف" },
                                { key: "username", label: "الأسم الاول" },
                                { key: "email", label: "الأسم الأخير" },
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
                        {paginatedUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedUsers.includes(
                                            user._id
                                        )}
                                        onChange={() =>
                                            handleSelectUser(user._id)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={`/dashboard/users/${user._id}/view`}
                                    >
                                        {user._id}
                                    </Link>
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleUserEdit(user._id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDelete([user._id])}
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
                    count={Math.ceil(filteredUsers.length / recordsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    dir="rtl"
                />
            </Box>
        </Box>
    );
}
