import { useState, useEffect } from "react";
import { Layout } from "../../components";
import { updateUser, getUserInfo } from "../../service/users";
import { useParams } from "react-router-dom";
import { EditUserForm } from "../../components/Forms/editUser";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
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
            getUserInfo(id).then((data) => {
                setUser(data);
                setLoading(false);
            });
        } catch (err) {
            console.log(err);
            setLoading(true);
        }
    }, []);
    const handleUpdate = async (data) => {
        try {
            await updateUser(id, data);
            navigate("/dashboard/users");
        } catch (err) {
            setError("Something went wrong");
        }
    };
    return (
        !loading && (
            <>
                <Layout>
                    <EditUserForm
                        user={user}
                        error={error}
                        onSubmit={handleUpdate}
                    />
                </Layout>
            </>
        )
    );
}
