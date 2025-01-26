import { useState } from "react";
import axios from "axios";
import { notification } from "antd";
import { motion } from "framer-motion";
import { AppRoutes } from "../../../constant/constant";

const AddLoan = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        maxloan: "",
        loanperiod: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.description || !formData.maxloan || !formData.loanperiod) {
            notification.error({
                message: "Form Incomplete",
                description: "Please fill in all the fields.",
            });
            return;
        }

        // Send the loan period as entered (no conversion needed)
        const loanPeriodString = formData.loanperiod.toString(); // Send the loan period as a string

        // Convert maxloan to string
        const maxLoanString = formData.maxloan.toString();

        setLoading(true);

        try {
            const response = await axios.post(AppRoutes.AdminAddLoan, {
                ...formData,
                loanperiod: loanPeriodString, // Send loan period as string (no conversion)
                maxloan: maxLoanString, // Send max loan as a string
            }, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.success) {
                notification.success({
                    message: "Loan Added",
                    description: "The loan has been successfully added.",
                });
                setFormData({
                    title: "",
                    description: "",
                    maxloan: "",
                    loanperiod: "",
                });
            } else {
                notification.error({
                    message: "Failed to Add Loan",
                    description: response.data.message || "Something went wrong.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response?.data?.message || "An error occurred while adding the loan.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/2 bg-indigo-600 flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-4xl font-bold mb-4">Add New Loan</h1>
                    <p className="text-xl">Create attractive loan offers for your customers</p>
                </div>
            </div>
            <div className="w-1/2 p-12 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        ></textarea>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Maximum Loan</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                name="maxloan"
                                value={formData.maxloan}
                                onChange={handleChange}
                                className="block w-full pl-7 pr-12 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                           focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="0.00"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Loan Period (in years)</label>
                        <input
                            type="number"
                            name="loanperiod"
                            value={formData.loanperiod}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : null}
                            {loading ? "Submitting..." : "Add Loan"}
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default AddLoan;
