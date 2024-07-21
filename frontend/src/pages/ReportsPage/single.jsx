import { useEffect, useState, useMemo } from "react";
import { SingleReportComp } from "../../components";
import { getReport } from "../../service/reports";
import { useParams } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { Layout } from "../../components";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export function SingleReport() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    useEffect(() => {
        try {
            getReport(id).then((data) => {
                setLoading(false);
                setReport(data);
            });
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }, []);

    // const report = useMemo(() => {
    //     return reports.find((report) => report.id === 1); // Adjust this condition as per your data structure
    // }, [reports]);

    return (
        !loading && (
            <Layout>
                <SingleReportComp report={report} />
            </Layout>
        )
    );
}
