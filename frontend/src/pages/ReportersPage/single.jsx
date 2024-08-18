import { useEffect, useState } from "react";
import { SingleReporterComp, ReportsComp } from "../../components";
import { getReporter } from "../../service/reporters";
import { useParams } from "react-router-dom";
import { Layout } from "../../components";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Grid, Box } from "@mui/material";

export function SingleReporter() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [reporter, setReporter] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        try {
            getReporter(id).then((data) => {
                setLoading(false);
                setReporter(data);
                setReports(data.reports);
            });
        } catch (err) {
            setLoading(false);
        }
    }, [id]);

    return (
        !loading && (
            <Layout>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            flexDirection: { xs: "column", md: "row" },
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                display: "flex",
                                justifyContent: {
                                    xs: "center",
                                    md: "flex-start",
                                },
                                mb: { xs: 2, md: 0 },
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    maxWidth: { xs: "100%", md: "400px" },
                                }}
                            >
                                <SingleReporterComp reporter={reporter} />
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={9}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <ReportsComp reports={reports} />
                        </Grid>
                    </Grid>
                </Box>
            </Layout>
        )
    );
}
