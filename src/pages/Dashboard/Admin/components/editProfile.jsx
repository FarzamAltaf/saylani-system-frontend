import { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Avatar, Row, Col, Typography } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AppRoutes, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from "../../../../constant/constant";

const { Title } = Typography;

const EditAdminProfile = () => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = Cookies.get("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            form.setFieldsValue({
                name: parsedUser.name,
            });
            setImageUrl(parsedUser.imageUrl);
        }
    }, [form]);

    const onFinish = (values) => {
        const user = JSON.parse(Cookies.get("user")); // Get the current user object from the cookie
        const updatedUser = {
            ...user, // Keep the rest of the object intact
            name: values.name, // Update only the modified fields
            imageUrl: imageUrl, // Update the imageUrl if it has changed
        };

        // Update the cookie immediately
        Cookies.set("user", JSON.stringify(updatedUser));

        // Make the API request to update the server-side data
        fetch(AppRoutes.updateProfile, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user._id, // Include the user ID
                name: values.name,
                imageUrl: imageUrl,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    message.success("Profile updated successfully");

                    // Sync the cookie with any potential updates from the server
                    Cookies.set("user", JSON.stringify(updatedUser)); // Sync the cookie data again
                } else {
                    message.error(data.message);
                }
            })
            .catch((error) => message.error("Profile update failed", error));
    };

    const handleImageUpload = (info) => {
        if (info.file.status === "done") {
            setImageUrl(info.file.response.secure_url);
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    return (
        <div className="p-6 bg-white">
            <Title level={2} className="mb-6 text-center theme-font">
                Edit Profile
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={24} align="middle">
                    <Col xs={24} sm={8} className="text-center mb-4 sm:mb-0">
                        <Avatar size={120} src={imageUrl} icon={<UserOutlined />} className="mb-4" />
                        <Form.Item name="image">
                            <Upload
                                name="avatar"
                                listType="picture"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={CLOUDINARY_UPLOAD_URL}
                                data={{
                                    file: imageUrl,
                                    upload_preset: CLOUDINARY_UPLOAD_PRESET,
                                }}
                                onChange={handleImageUpload}
                            >
                                <Button icon={<UploadOutlined />}>Change Picture</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={16}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: "Please input your name!" }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" className="mr-4">
                                Update Profile
                            </Button>
                            <Button onClick={() => navigate("/user/change-password")} size="large">
                                Change Password
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default EditAdminProfile;
