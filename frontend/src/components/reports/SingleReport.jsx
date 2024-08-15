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
    Paper,
    Divider,
    IconButton,
} from "@mui/material";
import ReactPlayer from "react-player";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";
import { getMetaData, getMedia } from "../../service/media";
import { format, parseISO } from "date-fns";

export function SingleReportComp({ report }) {
    const [reporter, setReporter] = useState(null);
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
    const handleDownload = async (attachment, report) => {
        try {
            const fileData = await getMedia(
                attachment.filePath,
                report.reportID
            );
            if (!fileData.error) {
                console.log("File data:", fileData);
                const blob = new Blob([fileData], {
                    type: attachment.mimeType,
                });

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                const dateID = format(parseISO(report.reportDate), "yyyyMMdd");
                link.setAttribute(
                    "download",
                    `${report.reportID}-${dateID}-${
                        report.TelegramId
                    }.${attachment.filePath.split("/").pop().split(".").pop()}`
                );
                // link.setAttribute(
                //     "download",
                //     `${attachment.file_unique_id}.${attachment.filePath
                //         .split("/")
                //         .pop()
                //         .split(".")
                //         .pop()}`
                // );
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                alert("حدث خطأ أثناء تنزيل الملف");
            }
        } catch (error) {
            console.error(
                `Error downloading file ${attachment.filePath}:`,
                error
            );
        }
    };
    const handleDownloadAll = (reportID) => {
        selectedAttachments.forEach(async (attachment) => {
            try {
                const fileData = await getMedia(attachment.filePath, reportID);
                if (!fileData.error) {
                    const blob = new Blob([fileData], {
                        type: attachment.mimeType,
                    });

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                        "download",
                        `${attachment.file_unique_id}.${attachment.filePath
                            .split("/")
                            .pop()
                            .split(".")
                            .pop()}`
                    );
                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } else {
                    alert("حدث خطأ أثناء تنزيل الملف");
                }
            } catch (error) {
                console.error(
                    `Error downloading file ${attachment.filePath}:`,
                    error
                );
            }
        });
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box maxWidth="1100px" margin="auto" padding="20px">
            <Typography
                variant="h4"
                gutterBottom
                color={theme.palette.primary.main}
            >
                تفاصيل التقرير
            </Typography>
            <Grid
                container
                spacing={2}
                component={Paper}
                sx={{
                    justifyContent: "center",
                    width: "100%",
                    margin: "auto",
                }}
            >
                <Grid item xs={12} md={6} p={4}>
                    <Box mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            معرف التقرير:
                        </Typography>
                        <Typography variant="body1" color="text.Secondary">
                            {report.reportID}
                        </Typography>
                    </Box>
                    <Divider color="#fff"></Divider>
                    <Box mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            تاريخ الإنشاء:
                        </Typography>
                        <Typography variant="body1" color="text.Secondary">
                            {report.reportDate}
                        </Typography>
                    </Box>
                    <Divider color="#fff"></Divider>
                    <Box mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            العنوان:
                        </Typography>
                        <Typography variant="h5" color="text.Secondary">
                            {report.reportTitle}
                        </Typography>
                    </Box>
                    <Divider color="#fff"></Divider>
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
                                color: "text.Secondary",
                                textAlign: "left",
                                maxHeight: "350px",
                                overflowY: "auto",
                            }}
                        >
                            {report.reportDescription}
                        </Typography>
                    </Box>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                    p={4}
                    sx={{
                        borderLeft: {
                            xs: "none",
                            md: `1px solid #fff`,
                        },
                    }}
                >
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
                                                color="text.Secondary"
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
                            onClick={() => handleDownloadAll(report.reportID)}
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
                                    color="text.Secondary"
                                >
                                    ملف غير مدعوم
                                </Typography>
                            )}
                            <Typography mt={2} color="text.Secondary">
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
                        onClick={() =>
                            handleDownload(selectedAttachment, report)
                        }
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
