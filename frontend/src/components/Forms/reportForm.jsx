import { useState } from "react";
import PropTypes from "prop-types";
import { updateReport } from "../../service/reports";
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardMedia,
    IconButton,
    Modal,
    Paper,
    MenuItem,
    Select,
    InputLabel,
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";
import ReactPlayer from "react-player";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export function ReportForm({ report }) {
    const [formData, setFormData] = useState({
        reportID: report.reportID,
        reportTitle: report.reportTitle,
        reportDescription: report.reportDescription,
        reportAttachments: report.reportAttachments,
        reportDate: report.reportDate,
        reportStatus: report.reportStatus,
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAttachmentClick = (attachment) => {
        setSelectedAttachment(attachment);
        setModalOpen(true);
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = `https://media.iaulibrary.com/${selectedAttachment.filePath
            .split("/")
            .slice(4)
            .join("/")}`;
        link.download = selectedAttachment.filePath.split("/").pop();
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setModalOpen(false);
    };

    const handleDelete = () => {
        formData.reportAttachments = formData.reportAttachments.filter(
            (attachment) =>
                attachment.file_unique_id !== selectedAttachment.file_unique_id
        );
        setFormData({ ...formData });
        setModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        updateReport(report.reportID, formData)
            .then((response) => {
                window.location.href = "/dashboard/reports";
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Report Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="عنوان التقرير"
                            name="reportTitle"
                            value={formData.reportTitle}
                            onChange={handleChange}
                            sx={{
                                fontSize: "24px",
                                "& textarea": {
                                    fontSize: "18px",
                                },
                            }}
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            label="محتوى التقرير"
                            name="reportDescription"
                            value={formData.reportDescription}
                            onChange={handleChange}
                            sx={{
                                fontSize: "24px",
                                "& textarea": {
                                    fontSize: "18px",
                                },
                            }}
                        />
                    </Box>
                    <Box mb={2}>
                        <Typography variant="h5">مرفقات التقرير</Typography>
                        <Box
                            display="flex"
                            flexWrap="wrap"
                            gap={2}
                            sx={{
                                "& img": {
                                    objectFit: "contain",
                                },
                                "& video": {
                                    objectFit: "contain",
                                },
                                justifyContent: "center",
                            }}
                        >
                            {formData.reportAttachments.map((attachment) => (
                                <Card
                                    key={attachment.file_unique_id}
                                    onClick={() =>
                                        handleAttachmentClick(attachment)
                                    }
                                    sx={{
                                        cursor: "pointer",
                                        width: 100,
                                        height: 100,
                                    }}
                                >
                                    {attachment.mime_type.startsWith(
                                        "image"
                                    ) ? (
                                        <CardMedia
                                            component="img"
                                            image={`https://media.iaulibrary.com/${attachment.filePath
                                                .split("/")
                                                .slice(4)
                                                .join("/")}`}
                                            alt="attachment"
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    ) : (
                                        <ReactPlayer
                                            url={`https://media.iaulibrary.com/${attachment.filePath
                                                .split("/")
                                                .slice(4)
                                                .join("/")}`}
                                            width="100%"
                                            height="100%"
                                            controls={false}
                                        />
                                    )}
                                </Card>
                            ))}
                        </Box>
                    </Box>
                    <Box mb={2}>
                        <InputLabel
                            id="reportStatus-label"
                            name="reportStatus"
                            sx={{
                                textAlign: "left",
                                display: "flex",
                            }}
                        >
                            حالة التقرير
                        </InputLabel>
                        <Select
                            fullWidth
                            labelId="reportStatus-label"
                            id="reportStatus"
                            value={formData.reportStatus}
                            label="حالة التقرير"
                            onChange={handleChange}
                            sx={{
                                display: "block",
                            }}
                        >
                            <MenuItem
                                value="pending"
                                sx={{ display: "block", textAlign: "center" }}
                            >
                                قيد الانتظار
                            </MenuItem>
                            <MenuItem
                                value="approved"
                                sx={{ display: "block", textAlign: "center" }}
                            >
                                تم الموافقة
                            </MenuItem>
                            <MenuItem
                                value="rejected"
                                sx={{ display: "block", textAlign: "center" }}
                            >
                                تم الرفض
                            </MenuItem>
                        </Select>
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            type="date"
                            label="تاريخ التقرير"
                            name="reportDate"
                            value={formData.reportDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary">
                        تعديل
                    </Button>
                </form>

                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Paper sx={modalStyle}>
                        <Typography variant="h6" gutterBottom>
                            خيارات المرفقات
                        </Typography>
                        {selectedAttachment && (
                            <Box mb={2}>
                                {selectedAttachment.mime_type.startsWith(
                                    "image"
                                ) ? (
                                    <CardMedia
                                        component="img"
                                        image={`https://media.iaulibrary.com/${selectedAttachment.filePath
                                            .split("/")
                                            .slice(4)
                                            .join("/")}`}
                                        alt="attachment"
                                        sx={{ width: "50%", height: "50%" }}
                                    />
                                ) : (
                                    <ReactPlayer
                                        url={`https://media.iaulibrary.com/${selectedAttachment.filePath
                                            .split("/")
                                            .slice(4)
                                            .join("/")}`}
                                        width="50%"
                                        height="50%"
                                        controls
                                    />
                                )}
                            </Box>
                        )}
                        <Box display="flex" justifyContent="space-between">
                            <IconButton
                                onClick={handleDownload}
                                color="primary"
                            >
                                <Download />
                            </IconButton>
                            <IconButton
                                onClick={handleDelete}
                                color="secondary"
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </Paper>
                </Modal>
            </Box>
        </Paper>
    );
}

ReportForm.propTypes = {
    report: PropTypes.object.isRequired,
};
