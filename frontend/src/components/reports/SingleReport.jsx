import PropTypes from "prop-types";
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    Grid,
    Card,
    CardMedia,
    Typography,
    Box,
    CardActionArea,
    useTheme,
    IconButton,
} from "@mui/material";
import ReactPlayer from "react-player";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";

export function SingleReportComp({ report }) {
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAttachments, setSelectedAttachments] = useState([]);
    const theme = useTheme();

    const handleAttachmentClick = (attachment) => {
        setSelectedAttachment(attachment);
        setDialogOpen(true);
    };

    const toggleSelectAttachment = (attachment) => {
        setSelectedAttachments((prevSelected) => {
            if (prevSelected.includes(attachment)) {
                return prevSelected.filter((a) => a !== attachment);
            } else {
                return [...prevSelected, attachment];
            }
        });
    };
    const handleDownload = (attachment) => {
        const link = `https://media.iaulibrary.com/${attachment.filePath
            .split("/")
            .slice(4)
            .join("/")}`;
        saveAs(link, attachment.filePath.split("/").pop());
        // const link = document.createElement("a");

        // link.download = selectedAttachment.filePath.split("/").pop();
        // link.target = "_blank";
        // link.rel = "noopener noreferrer";
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    };
    const handleDownloadAll = () => {
        selectedAttachments.forEach((attachment) => {
            fetch(
                `https://media.iaulibrary.com/${attachment.filePath
                    .split("/")
                    .slice(4)
                    .join("/")}`,
                {
                    method: "GET",
                    headers: {},
                }
            )
                .then((response) => {
                    response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(
                            new Blob([buffer])
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                            "download",
                            attachment.file_unique_id
                        );
                        document.body.appendChild(link);
                        link.click();
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box maxWidth="800px" margin="auto" padding="20px">
            <Typography
                variant="h4"
                gutterBottom
                color={theme.palette.primary.main}
            >
                تفاصيل التقرير
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            معرف التقرير:
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {report.reportID}
                        </Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            تاريخ الإنشاء:
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {report.reportDate}
                        </Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            العنوان:
                        </Typography>
                        <Typography variant="h5" color="textPrimary">
                            {report.title}
                        </Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            التقرير:
                        </Typography>
                        <Typography
                            component="div"
                            sx={{
                                width: "100%",
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "textSecondary",
                            }}
                        >
                            {report.reportDescription}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                    >
                        المرفقات:
                    </Typography>
                    <Grid container spacing={2}>
                        {report.reportAttachments.map((attachment) => (
                            <Grid
                                item
                                key={attachment.file_unique_id}
                                xs={6}
                                sm={4}
                            >
                                <Card
                                    sx={{
                                        cursor: "pointer",
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        border: selectedAttachments.includes(
                                            attachment
                                        )
                                            ? `2px solid ${theme.palette.primary.main}`
                                            : "none",
                                        padding: "10px",
                                        position: "relative",
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() =>
                                            handleAttachmentClick(attachment)
                                        }
                                    >
                                        {attachment.mime_type.startsWith(
                                            "image"
                                        ) ? (
                                            <CardMedia
                                                component="img"
                                                height="100"
                                                image={`https://media.iaulibrary.com/${attachment.filePath
                                                    .split("/")
                                                    .slice(4)
                                                    .join("/")}`}
                                                alt="Attachment"
                                            />
                                        ) : attachment.mime_type.startsWith(
                                              "video"
                                          ) ? (
                                            <ReactPlayer
                                                url={`https://media.iaulibrary.com/${attachment.filePath
                                                    .split("/")
                                                    .slice(4)
                                                    .join("/")}`}
                                                controls
                                                width="100%"
                                                height="100%"
                                            />
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                ملف غير مدعوم
                                            </Typography>
                                        )}
                                    </CardActionArea>
                                    <Checkbox
                                        checked={selectedAttachments.includes(
                                            attachment
                                        )}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleSelectAttachment(attachment);
                                        }}
                                        sx={{
                                            position: "absolute",
                                            top: "5px",
                                            right: "5px",
                                            zIndex: 1,
                                        }}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={selectedAttachments.length === 0}
                            onClick={handleDownloadAll}
                            startIcon={<DownloadIcon />}
                        >
                            تنزيل الجميع
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>معلومات المرفق</DialogTitle>
                <DialogContent>
                    {selectedAttachment && (
                        <>
                            {selectedAttachment.mime_type.startsWith(
                                "image"
                            ) ? (
                                <Card>
                                    <CardMedia
                                        component="img"
                                        image={`https://media.iaulibrary.com/${selectedAttachment.filePath
                                            .split("/")
                                            .slice(4)
                                            .join("/")}`}
                                        alt="Attachment"
                                        sx={{ maxWidth: "100%" }}
                                    />
                                </Card>
                            ) : selectedAttachment.mime_type.startsWith(
                                  "video"
                              ) ? (
                                <ReactPlayer
                                    url={`https://media.iaulibrary.com/${selectedAttachment.filePath
                                        .split("/")
                                        .slice(4)
                                        .join("/")}`}
                                    controls
                                    width="100%"
                                    height="auto"
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    ملف غير مدعوم
                                </Typography>
                            )}
                            <Typography mt={2} color="textPrimary">
                                اسم الملف: {selectedAttachment.fileName}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        إغلاق
                    </Button>
                    <Button
                        onClick={() => handleDownload(selectedAttachment)}
                        color="primary"
                    >
                        تنزيل
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

SingleReportComp.propTypes = {
    report: PropTypes.object.isRequired,
};
