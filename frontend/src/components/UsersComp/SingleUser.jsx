import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Grid,
    Box,
    styled,
    Divider,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../service/users";

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: "400px",
    margin: "20px auto",
    padding: theme.spacing(3),
    // backgroundColor: "#f5f5f5",
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    color: theme.palette.text.secondary,
    textAlign: "left",
}));

const DetailsTypography = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.secondary.main,
    textAlign: "left",
    fontSize: "1.25rem",
}));

const DataTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    textAlign: "left",
    margin: theme.spacing(0, 2),
    fontSize: "1rem",
}));

const ActionsContainer = styled(CardActions)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
}));

export function SingleUserComp({ user }) {
    const navigate = useNavigate();

    const handleUserEdit = (userID) => {
        navigate(`/dashboard/users/${userID}/edit`);
    };

    const handleDelete = (userID) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );
        if (confirmDelete) {
            deleteUser(userID)
                .then((response) => {
                    navigate("/dashboard/users");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <StyledCard>
            <CardContent>
                <TitleTypography variant="h6">User Details</TitleTypography>
                <Divider />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DetailsTypography>Username:</DetailsTypography>
                        <DataTypography>{user.username}</DataTypography>
                    </Grid>
                    <Grid item xs={12}>
                        <DetailsTypography>Email:</DetailsTypography>
                        <DataTypography>{user.email}</DataTypography>
                    </Grid>
                    <Grid item xs={12}>
                        <DetailsTypography>Admin:</DetailsTypography>
                        <DataTypography>
                            {user.isAdmin ? "Yes" : "No"}
                        </DataTypography>
                    </Grid>
                </Grid>
            </CardContent>
            <ActionsContainer>
                <IconButton
                    aria-label="edit"
                    onClick={() => handleUserEdit(user["_id"])}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(user["_id"])}
                >
                    <DeleteIcon />
                </IconButton>
            </ActionsContainer>
        </StyledCard>
    );
}

SingleUserComp.propTypes = {
    user: PropTypes.object.isRequired,
};
