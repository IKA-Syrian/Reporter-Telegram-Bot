import { useState, useEffect } from "react";
import { Layout } from "../../components";
import { AddUserForm } from "../../components/Forms/addUser";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function AddUser() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <Layout>
                <AddUserForm />
            </Layout>
        </>
    );
}
