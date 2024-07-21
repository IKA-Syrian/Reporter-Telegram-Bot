import { useState, useEffect } from "react";
import { LogsComp, Layout } from "../../components";
import { getLogs } from "../../service/logs";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export function Logs() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    const fetchData = async () => {
        try {
            getLogs().then((data) => {
                setLogs(data);
                setLoading(false);
            });
        } catch (err) {
            console.log(err);
            setLoading(true);
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
                    <h1>Logs</h1>
                    <LogsComp logs={logs} />
                </Layout>
            </>
        )
    );
}
