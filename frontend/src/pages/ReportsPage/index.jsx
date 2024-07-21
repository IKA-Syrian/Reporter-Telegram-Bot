import { useState, useEffect } from "react";
import { ReportsComp, Layout } from "../../components";
import { getReports } from "../../service/reports";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export function Reports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            getReports().then((data) => {
                setLoading(false);

                setReports(data);
            });
        } catch (err) {
            console.log(err);
            loading(true);
        }
    };
    useEffect(() => {
        fetchData();

        const updateInterval =
            new Date().getHours() >= 0 && new Date().getHours() < 8
                ? 3600000
                : 120000;
        const intervalId = setInterval(fetchData, updateInterval);

        return () => clearInterval(intervalId);
    }, []);
    return (
        !loading && (
            <>
                <Layout>
                    <h1>Reports</h1>
                    <ReportsComp reports={reports} />
                </Layout>
            </>
        )
    );
}
