import { useState } from "react";
import { DollarCircleOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";
import { Modal, Button, Input, Form, Select, message } from "antd";

const { Option } = Select;

const featureData = [
    {
        icon: <DollarCircleOutlined className="text-5xl text-blue-500" />,
        title: "Accessible Loans",
        description: "Offering interest-free financial support to help individuals achieve stability.",
    },
    {
        icon: <HomeOutlined className="text-5xl text-green-500" />,
        title: "Housing Assistance",
        description: "Providing funds for home construction and renovation with ease.",
    },
    {
        icon: <BookOutlined className="text-5xl text-yellow-500" />,
        title: "Education Support",
        description: "Enabling students to continue their education without financial worries.",
    },
];

const serviceDetails = [
    {
        key: "1",
        title: "Wedding Loans",
        details: "Supports wedding expenses, including valima, furniture, and jahez, up to PKR 5 lakh. Loan period: 3 years.",
        maxLoan: 500000,
        loanPeriod: 3,
        subcategories: [
            { name: "Valima", description: "Support for valima expenses including food and venue arrangements." },
            { name: "Furniture", description: "Support for furniture purchases required for the wedding." },
            { name: "Valima Food", description: "Covers costs for catering and food arrangements for the valima ceremony." },
            { name: "Jahez", description: "Provides funds for purchasing jahez items." }
        ],
    },
    {
        key: "2",
        title: "Home Construction Loans",
        details: "Funds for building structures, finishing homes, and renovations, up to PKR 10 lakh. Loan period: 5 years.",
        maxLoan: 1000000,
        loanPeriod: 5,
        subcategories: [
            { name: "Structure", description: "Loan to help build the structural foundations of the home." },
            { name: "Finishing", description: "Funds to complete the finishing of the house, such as painting, flooring, and fixtures." },
            { name: "Loan", description: "Provides additional funds for further construction needs." }
        ],
    },
    {
        key: "3",
        title: "Business Startup Loans",
        details: "Assists with buying stalls, shop machinery, and advance rent, up to PKR 10 lakh. Loan period: 5 years.",
        maxLoan: 1000000,
        loanPeriod: 5,
        subcategories: [
            { name: "Buy Stall", description: "Loan to help purchase a stall for business setup." },
            { name: "Advance Rent for Shop", description: "Supports advance rent payments for setting up a business location." },
            { name: "Shop Assets", description: "Loan for buying necessary shop assets and equipment." },
            { name: "Shop Machinery", description: "Provides funds to purchase machinery for shop operations." }
        ],
    },
    {
        key: "4",
        title: "Education Loans",
        details: "Covers university and school fees to support students in their academic journey. Loan period: 4 years.",
        maxLoan: 0, // Variable max loan, based on need
        loanPeriod: 4,
        subcategories: [
            { name: "University Fees", description: "Loan to cover tuition fees and other university expenses." },
            { name: "Child Fees Loan", description: "Assists with covering education fees for children attending school." }
        ],
    },
];

const FeatureCard = ({ icon, title, description }) => (
    <div className="h-full transform transition-all duration-300 hover:scale-105">
        <div className="h-full text-center shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 bg-white rounded-lg p-6">
            <div className="mb-6 transform transition-transform duration-300 hover:scale-110">{icon}</div>
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

const LoanCalculatorModal = ({ isVisible, onClose, service, onCalculate }) => {
    const [form] = Form.useForm();

    const handleCalculate = async () => {
        const values = await form.validateFields();
        const { subcategory, initialDeposit, loanPeriod } = values;

        // Loan amount calculation based on selected loan category
        const maxLoanAmount = service.maxLoan;
        const loanAmount = maxLoanAmount - initialDeposit;  // Final loan amount after initial deposit
        const monthlyInstallment = loanAmount / loanPeriod;

        onCalculate({ loanAmount, monthlyInstallment, loanPeriod, subcategory });
        onClose(); // Close modal after calculation
    };

    return (
        <Modal
            title={`Loan Details: ${service.title}`}
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleCalculate}>
                    Calculate
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="subcategory"
                    label="Select Subcategory"
                    rules={[{ required: true, message: "Please select a subcategory!" }]}
                >
                    <Select placeholder="Select Subcategory">
                        {service.subcategories.map((sub) => (
                            <Option key={sub.name} value={sub.name}>
                                {sub.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="initialDeposit"
                    label="Initial Deposit (PKR)"
                    rules={[{ required: true, message: "Please input the initial deposit!" }]}
                >
                    <Input type="number" placeholder="Initial Deposit" />
                </Form.Item>
                <Form.Item
                    name="loanPeriod"
                    label="Loan Period (in years)"
                    rules={[{ required: true, message: "Please select a loan period!" }]}
                >
                    <Select placeholder="Select Loan Period">
                        {[...Array(service.loanPeriod)].map((_, i) => (
                            <Option key={i + 1} value={i + 1}>
                                {i + 1} Year(s)
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const LoanBreakdownModal = ({ isVisible, onClose, loanBreakdown }) => {
    return (
        <Modal
            title="Loan Breakdown"
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
            ]}
        >
            <h3 className="text-xl font-semibold">For {loanBreakdown.subcategory}</h3>
            <p className="text-lg">Loan Amount: PKR {loanBreakdown.loanAmount}</p>
            <p className="text-lg">Monthly Installment: PKR {loanBreakdown.monthlyInstallment}</p>
            <p className="text-lg">Loan Period: {loanBreakdown.loanPeriod} year(s)</p>
        </Modal>
    );
};

const Features = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [isCalculatorModalVisible, setIsCalculatorModalVisible] = useState(false);
    const [isLoanBreakdownModalVisible, setIsLoanBreakdownModalVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [loanBreakdown, setLoanBreakdown] = useState(null);

    const showCalculatorModal = (service) => {
        setSelectedService(service);
        setIsCalculatorModalVisible(true);
    };

    const handleCalculate = ({ loanAmount, monthlyInstallment, loanPeriod, subcategory }) => {
        setLoanBreakdown({
            loanAmount,
            monthlyInstallment,
            loanPeriod,
            subcategory,
        });
        setIsLoanBreakdownModalVisible(true);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-gray-100 to-blue-50">
            <div className="container mx-auto px-4">
                {/* Features Section */}
                <h2 className="text-3xl font-bold text-center mb-16">
                    Our <span className="text-blue-600">Features</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {featureData.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                {/* Decorative element */}
                <div className="w-24 h-1 bg-blue-500 mx-auto mb-16"></div>

                {/* Detailed Services Section */}
                <h2 className="text-3xl font-bold text-center mb-12">
                    Detailed <span className="text-blue-600">Services</span>
                </h2>
                <div className="mb-8">
                    <div className="flex justify-center space-x-4">
                        {serviceDetails.map((service) => (
                            <button
                                key={service.key}
                                className={`px-4 py-2 rounded-full transition-all duration-300 ${activeTab === service.key ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                onClick={() => setActiveTab(service.key)}
                            >
                                {service.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    {serviceDetails.map((service) => (
                        <div
                            key={service.key}
                            className={`transition-all duration-500 ${activeTab === service.key ? "opacity-100" : "opacity-0 hidden"
                                }`}
                        >
                            <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4 text-blue-600">{service.title}</h3>
                                <p className="text-gray-600 mb-4">{service.details}</p>
                                <div className="space-y-4">
                                    {service.subcategories.map((sub, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-xl">
                                            <h4 className="text-xl font-semibold text-blue-500">{sub.name}</h4>
                                            <p className="text-gray-600">{sub.description}</p>
                                            <Button
                                                type="primary"
                                                className="mt-2"
                                                onClick={() => showCalculatorModal(service)}
                                            >
                                                show loan details
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loan Calculation Modal */}
            {selectedService && (
                <LoanCalculatorModal
                    isVisible={isCalculatorModalVisible}
                    onClose={() => setIsCalculatorModalVisible(false)}
                    service={selectedService}
                    onCalculate={handleCalculate}
                />
            )}

            {/* Loan Breakdown Modal */}
            {loanBreakdown && (
                <LoanBreakdownModal
                    isVisible={isLoanBreakdownModalVisible}
                    onClose={() => setIsLoanBreakdownModalVisible(false)}
                    loanBreakdown={loanBreakdown}
                />
            )}
        </section>
    );
};

export default Features;
