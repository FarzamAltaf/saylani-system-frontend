import { useState } from "react";
import axios from "axios";
import { AppRoutes, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from "../../constant/constant";
import { notification } from "antd";
import { useNavigate } from "react-router";

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false); // To handle image upload loading
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
            return response.data.secure_url; // Return the image URL from Cloudinary
        } catch (error) {
            notification.error({
                message: "Image Upload Failed",
                description: "There was an error uploading the image.",
            });
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.image) {
            notification.error({
                message: "Please complete the form",
                description: "All fields are required, including the image upload.",
            });

            return;
        }

        setLoading(true);
        setImageLoading(true);
        try {
            const imageUrl = await uploadImageToCloudinary(formData.image);

            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                imageUrl: imageUrl,
            };

            const response = await axios.post(AppRoutes.signup, userData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            notification.success({
                message: "Signup Successful",
                description: response.data.message || "User registered successfully",
            });

            setFormData({
                name: "",
                email: "",
                password: "",
                image: null,
            });
            navigate("/signin");
        } catch (error) {
            notification.error({
                message: "Signup Failed",
                description: ` User already exist ${error}`,
            });
        } finally {
            setLoading(false);
            setImageLoading(false);
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
                    Sign up to create an account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                            Full name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                // required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                // required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-900">
                            Upload your image
                        </label>
                        <div className="mt-2">
                            <input
                                id="image"
                                name="image"
                                type="file"
                                onChange={handleImageChange}
                                // required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                // required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={loading || imageLoading}
                        >
                            {imageLoading ? "Uploading Image..." : loading ? "Signing up..." : "Sign up"}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Sign in here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
