import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Admin = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = Cookies.get("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p><strong>Username:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Token:</strong> {Cookies.get("authToken")}</p>
        </div>
    );
};

export default Admin;
