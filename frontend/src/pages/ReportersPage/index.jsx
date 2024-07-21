import { useState, useEffect } from "react";
import { ReportersComp, Layout } from "../../components/";
import { getReporters } from "../../service/reporters";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export function Reporters() {
    const navigate = useNavigate();

    const [reporters, setReporters] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    const fetchData = async () => {
        try {
            getReporters().then((data) => {
                setReporters(data);
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
                    <h1>Reporters</h1>
                    <ReportersComp reporters={reporters} />
                </Layout>
            </>
        )
    );
}
