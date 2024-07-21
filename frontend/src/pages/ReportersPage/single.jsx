import { useEffect, useState, useMemo } from "react";
import { SingleReporterComp } from "../../components";
import { getReporter } from "../../service/reporters";
import { useParams } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { Layout } from "../../components";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export function SingleReporter() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [reporter, setReporter] = useState([]);
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
            });
        } catch (err) {
            setLoading(false);
        }
    }, []);
    return (
        !loading && (
            <Layout>
                <SingleReporterComp reporter={reporter} />
            </Layout>
        )
    );
}
