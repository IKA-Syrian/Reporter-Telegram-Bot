import { useState, useEffect } from "react";
import { UsersComp, Layout } from "../../components";
import { getUsers } from "../../service/users";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            const token = Cookies.get("token");
            getUsers(token).then((data) => {
                setLoading(false);

                setUsers(data);
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
                    <h1>Users</h1>
                    <UsersComp users={users} />
                </Layout>
            </>
        )
    );
}
