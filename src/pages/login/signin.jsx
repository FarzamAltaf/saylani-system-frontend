import { useEffect, useState } from "react";
import axios from "axios";
import { AppRoutes } from "../../constant/constant";
import { notification } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";

const Signin = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = Cookies.get("userId");
        if (userId) {
            navigate("/user/update-password");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            notification.error({
                message: "Form Incomplete",
                description: "Please fill in both email and password.",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(AppRoutes.login, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.status) {
                notification.success({
                    message: "Login Successful",
                    description: response.data.message || "Welcome back!",
                });

                Cookies.set("authToken", response.data.data.token, { expires: 7 });
                // const { password, ...userData } = response.data.data.user;
                const { ...userData } = response.data.data.user;
                Cookies.set("user", JSON.stringify(userData), { expires: 7 });
                window.location.reload();
                if (userData.role === "user") {
                    navigate("/user/dashboard");
                } else if (userData.role === "admin") {
                    navigate("/admin/dashboard");
                }
            } else {
                notification.error({
                    message: "Login Failed",
                    description: response.data.message || "Incorrect credentials, please try again.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Login Failed",
                description: error.response?.data?.message || "An error occurred while logging in.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <Link to={"/signup"} className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signin;
