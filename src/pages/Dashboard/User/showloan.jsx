import { useState, useEffect } from "react";
import axios from "axios";
import { AppRoutes } from "../../../constant/constant";
import { Drawer, Input, Button, Select } from "antd";

const { Option } = Select;

const ShowLoan = () => {
    const [loans, setLoans] = useState([]);
    const [loanCategories, setLoanCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [categoriesForSelectedLoan, setCategoriesForSelectedLoan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deposit, setDeposit] = useState("");
    const [loanPeriod, setLoanPeriod] = useState(null);
    const [installments, setInstallments] = useState(null);
    const [maxLoanPeriod, setMaxLoanPeriod] = useState(0);

    // Fetch loan data
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await axios.get(AppRoutes.AdminGetLoan);
                if (response.data.success) {
                    setLoans(response.data.data);
                } else {
                    console.error("Failed to fetch loans", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching loans:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, []);

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(AppRoutes.AdminGetLoanCategory);
                if (response.data.success) {
                    setLoanCategories(response.data.data);
                } else {
                    console.error("Failed to fetch loan categories", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching categories:", error.message);
            }
        };

        fetchCategories();
    }, []);

    // Filter categories for a loan
    const getCategoriesForLoan = (loanId) => {
        return loanCategories
            .filter((category) => category.loanId === loanId)
            .sort((a, b) => a.title.localeCompare(b.title));
    };

    const handleShowCategoriesModal = (loanId) => {
        setSelectedLoanId(loanId);
        const categories = getCategoriesForLoan(loanId);
        setCategoriesForSelectedLoan(categories);
        setShowModal(true);
    };

    const handleShowDrawer = (category) => {
        setSelectedCategory(category);

        // Match category.loanId with the loans data to get the loanPeriod
        const loan = loans.find((loan) => loan._id === category.loanId);
        const loanPeriod = loan ? Number(loan.loanPeriod) : 0;

        setMaxLoanPeriod(loanPeriod);
        setShowDrawer(true);
    };

    const closeModal = () => setShowModal(false);
    const closeDrawer = () => {
        setShowDrawer(false);
        setDeposit("");
        setLoanPeriod(null);
        setInstallments(null);
    };

    const calculateInstallments = () => {
        if (!deposit || !loanPeriod || !selectedCategory?.loanAmount) {
            alert("Please provide valid deposit, loan period, and loan amount.");
            return;
        }

        const totalLoan = Number(selectedCategory.loanAmount); // Ensure the loan amount is numeric
        const initialDeposit = Number(deposit); // Convert deposit to a number
        const remainingLoan = totalLoan - initialDeposit; // Calculate the remaining loan balance

        if (remainingLoan <= 0) {
            alert("Deposit cannot be greater than or equal to the loan amount.");
            return;
        }

        const months = Number(loanPeriod) * 12; // Convert loan period in years to months

        if (months <= 0) {
            alert("Loan period must be greater than 0.");
            return;
        }

        const monthlyPayment = remainingLoan / months; // Distribute the balance equally across months
        setInstallments(monthlyPayment.toFixed(2)); // Round the result to two decimal places
    };



    return (
        <section className="text-gray-600 body-font overflow-hidden">
            <h1 className="theme-font text-4xl font-extrabold">Loans</h1>
            <div className="container px-5 py-24 mx-auto">
                <div className="-my-8 divide-y-2 divide-gray-100">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        loans.map((loan) => (
                            <div key={loan._id} className="py-8 flex flex-wrap md:flex-nowrap">
                                <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                                    <span className="font-semibold title-font text-gray-700">
                                        CATEGORY
                                    </span>
                                </div>
                                <div className="md:flex-grow">
                                    <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                                        {loan.title}
                                    </h2>
                                    <p className="leading-relaxed">{loan.description}</p>
                                    <a
                                        className="text-indigo-500 inline-flex items-center mt-4 cursor-pointer"
                                        onClick={() => handleShowCategoriesModal(loan._id)}
                                    >
                                        See categories
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="M12 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">
                            Categories for{" "}
                            {loans.find((loan) => loan._id === selectedLoanId)?.title}
                        </h3>
                        <div className="space-y-2">
                            {categoriesForSelectedLoan.map((category) => (
                                <button
                                    key={category._id}
                                    className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
                                    onClick={() => handleShowDrawer(category)}
                                >
                                    {category.title}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Drawer
                title={`Loan Details for ${selectedCategory?.title}`}
                placement="left"
                visible={showDrawer}
                onClose={closeDrawer}
                width={400}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block">Initial Deposit:</label>
                        <Input
                            type="number"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                            placeholder="Enter initial deposit"
                        />
                    </div>

                    <div>
                        <label className="block">Loan Period (Years):</label>
                        <Select
                            value={loanPeriod}
                            onChange={(value) => setLoanPeriod(value)}
                            placeholder="Select loan period"
                            style={{ width: "100%" }}
                        >
                            {maxLoanPeriod > 0 ? (
                                [...Array(maxLoanPeriod).keys()].map((i) => (
                                    <Option key={i + 1} value={i + 1}>
                                        {i + 1} Year{i > 0 ? "s" : ""}
                                    </Option>
                                ))
                            ) : (
                                <Option disabled>No Loan Period Available</Option>
                            )}
                        </Select>
                    </div>

                    <div>
                        <Button
                            type="primary"
                            onClick={calculateInstallments}
                            style={{ width: "100%" }}
                        >
                            Calculate Installments
                        </Button>
                    </div>

                    {installments && (
                        <div className="mt-4">
                            <strong>Estimated Monthly Installment:</strong> ${installments}
                        </div>
                    )}
                </div>
            </Drawer>
        </section>
    );
};

export default ShowLoan;
