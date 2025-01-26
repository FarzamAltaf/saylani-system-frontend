import { useState } from "react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppRoutes } from "../../constant/constant";
import Cookies from "js-cookie";

const UpdatePassword = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userId = JSON.parse(Cookies.get("userId") || null);
    console.log(userId)

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            notification.error({
                message: "Form Incomplete",
                description: "Please fill in the new password.",
            });
            return;
        }

        if (!userId) {
            notification.error({
                message: "User Not Found",
                description: "Unable to find user ID. Please login again.",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.put(`${AppRoutes.updatePasscode}/${userId}`, {
                password: password,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.status) {
                notification.success({
                    message: "Password Updated",
                    description: response.data.message || "Your password has been successfully updated.",
                });
                const { ...userData } = response.data.user;
                Cookies.remove("status");
                Cookies.remove("user");
                Cookies.remove("userId");
                Cookies.remove("authToken");
                Cookies.set("user", JSON.stringify(userData), { expires: 7 });
                Cookies.set("authToken", response.data.token, { expires: 7 });
                navigate("/user/dashboard");
            } else {
                notification.error({
                    message: "Update Failed",
                    description: response.data.message || "Failed to update the password.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Update Failed",
                description: error.response?.data?.message || "An error occurred while updating the password.",
            });
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Update Your Password
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            New Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                placeholder="Enter your new password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
