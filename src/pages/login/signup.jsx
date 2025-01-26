import { useState } from "react";
import axios from "axios";
import { AppRoutes, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from "../../constant/constant";
import { notification } from "antd";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cnic: "",
        image: null,
    });
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    // Handle image file change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        if (!file) {
            setErrors((prev) => ({ ...prev, image: "Please upload an image." }));
        } else {
            setErrors((prev) => ({ ...prev, image: "" }));
        }
    };

    // Validate form fields
    const validateField = (name, value) => {
        let error = "";
        if (!value) {
            error = "This field is required.";
        } else if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
            error = "Please enter a valid email address.";
        } else if (name === "cnic" && !/^\d+$/.test(value)) {
            error = "CNIC must contain only numbers.";
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    // Validate the entire form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Full name is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.cnic) newErrors.cnic = "CNIC is required.";
        if (!formData.image) newErrors.image = "Image is required.";
        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Please enter a valid email.";
        if (formData.cnic && !/^\d+$/.test(formData.cnic)) newErrors.cnic = "CNIC must contain only numbers.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Upload image to Cloudinary
    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
            return response.data.secure_url;
        } catch (error) {
            notification.error({
                message: "Image Upload Failed",
                description: "There was an error uploading the image.",
            });
            throw error;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setImageLoading(true);

        try {
            let imageUrl = "";
            if (formData.image) {
                imageUrl = await uploadImageToCloudinary(formData.image);
            }

            const userData = {
                name: formData.name,
                email: formData.email,
                cnic: formData.cnic,
                imageUrl: imageUrl, // Send image URL only if image is uploaded
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
                cnic: "",
                image: null,
            });

            if (response.data.data.otp) {
                navigate("/verify");
                const { ...userData } = response.data.data.user;
                Cookies.set("user", JSON.stringify(userData), { expires: 7 });
                Cookies.set("userId", JSON.stringify(userData._id), { expires: 7 });
                Cookies.set("authToken", response.data.data.token, { expires: 7 });
                Cookies.set("verificationCode", response.data.data.otp, { expires: 15 / (24 * 60) });
            } else {
                console.log("OTP not found in the response:", response.data);
            }

        } catch (error) {
            notification.error({
                message: "Signup Failed",
                description: `Error: ${error.response?.data?.message || error.message}`,
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
                    src="https://res.cloudinary.com/dd2alel5h/image/upload/v1737803880/sayl_qsabxv.png"
                    className="mx-auto h-30 w-auto"
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
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 ${errors.name ? "outline-red-500" : "outline-gray-300"} focus:outline-2 focus:outline-indigo-600`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 ${errors.email ? "outline-red-500" : "outline-gray-300"} focus:outline-2 focus:outline-indigo-600`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="cnic" className="block text-sm font-medium text-gray-900">
                            CNIC
                        </label>
                        <div className="mt-2">
                            <input
                                id="cnic"
                                name="cnic"
                                type="text"
                                value={formData.cnic}
                                onChange={handleChange}
                                placeholder="Enter your CNIC without dashes"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 ${errors.cnic ? "outline-red-500" : "outline-gray-300"} focus:outline-2 focus:outline-indigo-600`}
                            />
                            {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
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
                                accept="image/*"
                                onChange={handleImageChange}
                                className={`block w-full text-base ${errors.image ? "outline-red-500" : "outline-gray-300"} focus:outline-2 focus:outline-indigo-600`}
                            />
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg"
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
