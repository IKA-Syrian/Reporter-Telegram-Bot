import { useState, useEffect } from "react";
import { Layout } from "../../components";
import { updateReporter, getReporter } from "../../service/reporters";
import { useParams } from "react-router-dom";
import { ReporterForm } from "../../components/Forms/reporterForm";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export function EditReporter() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reporter, setReporter] = useState({});
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
            getReporter(id).then((data) => {
                setReporter(data);
                setLoading(false);
            });
        } catch (err) {
            console.log(err);
            setLoading(true);
        }
    }, []);
    const handleUpdate = async (data) => {
        try {
            await updateReporter(id, data);
            navigate("/dashboard/reporters");
        } catch (err) {
            setError("Something went wrong");
        }
    };
    return (
        !loading && (
            <>
                <Layout>
                    <ReporterForm
                        reporter={reporter}
                        error={error}
                        onSubmit={handleUpdate}
                    />
                </Layout>
            </>
        )
    );
}
