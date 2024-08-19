import { useState, useEffect } from "react";
import { SingleUserComp, Layout } from "../../components";
import { getUserInfo } from "../../service/users";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export function SingleUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        try {
            getUserInfo(id).then((data) => {
                setLoading(false);
                setUser(data);
            });
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }, []);

    return (
        !loading && (
            <Layout>
                <SingleUserComp user={user} />
            </Layout>
        )
    );
}
