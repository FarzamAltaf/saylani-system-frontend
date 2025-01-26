import { useState, useEffect } from "react";
import axios from "axios";
import { Table, notification, Button, Modal, Input, Select } from "antd";
import { AppRoutes } from "../../../constant/constant";

const { Option } = Select;

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [subcategoryTitle, setSubcategoryTitle] = useState("");
    const [selectedLoanId, setSelectedLoanId] = useState(null);

    // Fetch loans and loan categories (subcategories)
    useEffect(() => {
        const fetchLoansAndCategories = async () => {
            try {
                // Fetch Loans first
                const loanResponse = await axios.get(AppRoutes.AdminGetLoan);
                if (loanResponse.data.success) {
                    const loansData = loanResponse.data.data;

                    // Now, fetch loan categories (subcategories)
                    const categoryResponse = await axios.get(AppRoutes.AdminGetLoanCategory);
                    if (categoryResponse.data.success) {
                        // Loop through loans and add subcategories to each loan
                        const updatedLoans = loansData.map((loan) => {
                            const subcategories = categoryResponse.data.data.filter(
                                (category) => category.loanId === loan._id
                            );
                            return {
                                ...loan,
                                subcategories: subcategories,
                            };
                        });

                        setLoans(updatedLoans); // Set loan data with subcategories
                    } else {
                        notification.error({
                            message: "Failed to Fetch Loan Categories",
                            description: categoryResponse.data.message || "Something went wrong.",
                        });
                    }
                } else {
                    notification.error({
                        message: "Failed to Fetch Loans",
                        description: loanResponse.data.message || "Something went wrong.",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: error.response?.data?.message || "An error occurred while fetching data.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLoansAndCategories();
    }, []);

    // Table columns with dropdown for subcategories
    const columns = [
        {
            title: "Loan Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Maximum Loan",
            dataIndex: "maxLoan",
            key: "maxLoan",
        },
        {
            title: "Loan Period",
            dataIndex: "loanPeriod",
            key: "loanPeriod",
            render: (text) => `${text} years`, // Add "years" suffix to loan period
        },
        {
            title: "Subcategories",
            key: "subcategories",
            render: (_, record) => (
                <Select
                    placeholder="Select Subcategory"
                    style={{ width: 200 }}
                    defaultValue={record.selectedSubcategoryId || ""}
                    onChange={(value) => handleSubcategorySelect(value, record._id)}
                >
                    {record.subcategories?.map((subcategory) => (
                        <Option key={subcategory._id} value={subcategory._id}>
                            {subcategory.title}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleAddSubcategory(record._id)}
                >
                    Add Subcategory
                </Button>
            ),
        },
    ];

    // Handle Add Subcategory button click
    const handleAddSubcategory = (loanId) => {
        setSelectedLoanId(loanId);
        setIsModalVisible(true);
    };

    // Handle subcategory selection from dropdown
    const handleSubcategorySelect = (value, loanId) => {
        // You can handle selection of subcategory, e.g., update the record
        console.log("Selected Subcategory:", value, "for Loan ID:", loanId);
    };

    // Handle the 'Ok' button click in modal (to add a new subcategory)
    const handleOk = async () => {
        if (!subcategoryTitle) {
            notification.error({
                message: "Title is required",
                description: "Please enter a title for the subcategory.",
            });
            return;
        }

        try {
            const response = await axios.post(AppRoutes.AdminAddLoanCategory, {
                loanId: selectedLoanId,
                title: subcategoryTitle,
            });

            if (response.data.success) {
                notification.success({
                    message: "Subcategory Added",
                    description: "The subcategory has been successfully added.",
                });
                setIsModalVisible(false);
                setSubcategoryTitle("");
                // Optionally, you can re-fetch loans or update the list of subcategories
            } else {
                notification.error({
                    message: "Failed to Add Subcategory",
                    description: response.data.message || "Something went wrong.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response?.data?.message || "An error occurred while adding the subcategory.",
            });
        }
    };

    // Handle Cancel button in modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setSubcategoryTitle("");
    };

    return (
        <div className="p-12">
            <h1 className="text-2xl font-bold mb-4">Loan List</h1>
            <Table
                columns={columns}
                dataSource={loans}
                loading={loading}
                rowKey="_id"
                pagination={false}
            />

            {/* Modal for adding subcategory */}
            <Modal
                title="Add Subcategory"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    placeholder="Enter Subcategory Title"
                    value={subcategoryTitle}
                    onChange={(e) => setSubcategoryTitle(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default LoanList;
