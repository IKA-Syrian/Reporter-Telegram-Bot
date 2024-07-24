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
import { deleteReporter } from "../../service/reporters";

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

export function SingleReporterComp({ reporter }) {
    const navigate = useNavigate();

    const handleReporterEdit = (reporterId) => {
        navigate(`/dashboard/reporters/${reporterId}/edit`);
    };

    const handleDelete = (reporterId) => {
        const ConfirmationMessage = window.confirm(
            `Are you sure you want to delete this reporter?`
        );
        if (ConfirmationMessage) {
            deleteReporter(reporterId)
                .then((response) => {
                    console.log(response);
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <StyledCard>
            <CardContent>
                <TitleTypography variant="h5">تفاصيل المراسل</TitleTypography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DetailsTypography>المعرف:</DetailsTypography>
                        <DataTypography>{reporter.TelegramId}</DataTypography>
                        <DetailsTypography>الأسم الأول:</DetailsTypography>
                        <DataTypography>{reporter.firstName}</DataTypography>
                        <DetailsTypography>الأسم الأخير:</DetailsTypography>
                        <DataTypography>{reporter.lastName}</DataTypography>
                        <DetailsTypography>رقم الهاتف:</DetailsTypography>
                        <DataTypography>{reporter.phoneNumber}</DataTypography>
                        <DetailsTypography>المدينة:</DetailsTypography>
                        <DataTypography>{reporter.city}</DataTypography>
                        <DetailsTypography>مفعل:</DetailsTypography>
                        <DataTypography>
                            {reporter.Verified ? "أجل" : "لا"}
                        </DataTypography>
                        <DetailsTypography>محظور:</DetailsTypography>
                        <DataTypography>
                            {reporter.isBlocked ? "أجل" : "لا"}
                        </DataTypography>
                    </Grid>
                </Grid>
            </CardContent>
            <ActionsContainer>
                <IconButton
                    color="primary"
                    onClick={() => handleReporterEdit(reporter.TelegramId)}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    color="secondary"
                    onClick={() => handleDelete(reporter.TelegramId)}
                >
                    <DeleteIcon />
                </IconButton>
            </ActionsContainer>
        </StyledCard>
    );
}

SingleReporterComp.propTypes = {
    reporter: PropTypes.shape({
        TelegramId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        phoneNumber: PropTypes.number.isRequired,
        city: PropTypes.string.isRequired,
        Verified: PropTypes.bool.isRequired,
        isBlocked: PropTypes.bool.isRequired,
    }).isRequired,
};

export default SingleReporterComp;
