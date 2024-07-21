import { useState, useEffect } from "react";
import { Layout } from "../../components";
import { updateReport, getReport } from "../../service/reports";
import { useParams } from "react-router-dom";
import { ReportForm } from "../../components/Forms/reportForm";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function EditReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        try {
            getReport(id).then((data) => {
                setReport(data);
                setLoading(false);
            });
        } catch (err) {
            console.log(err);
            setLoading(true);
        }
    }, []);
    const handleUpdate = async (data) => {
        try {
            await updateReport(id, data);
            navigate("/dashboard/reports");
        } catch (err) {
            setError("Something went wrong");
        }
    };
    return (
        !loading && (
            <>
                <Layout>
                    <ReportForm
                        report={report}
                        error={error}
                        onSubmit={handleUpdate}
                    />
                </Layout>
            </>
        )
    );
}
