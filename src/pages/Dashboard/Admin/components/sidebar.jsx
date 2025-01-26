import { useState, useEffect } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    LogoutOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Button, Image, Layout, Menu, Dropdown, Avatar, Space, ConfigProvider, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router";
import Cookies from "js-cookie";
import { AppRoutes } from "../../../../constant/constant";

const { Header, Sider, Content } = Layout;

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = Cookies.get("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserImage(parsedUser.imageUrl);
        }
    }, []);

    const handleLogout = () => {
        const authToken = Cookies.get("authToken");

        fetch(AppRoutes.logout, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    message.success("Successfully logged out");
                    Cookies.remove("user");
                    Cookies.remove("authToken");

                    const user = Cookies.get("user");
                    const authToken = Cookies.get("authToken");
                    window.location.reload();
                    if (!user && !authToken) {
                        navigate("/signin");
                    } else {
                        message.error("Logout failed, please try again.");
                    }
                } else {
                    message.error(data.message || "Logout failed");
                }
            })
            .catch((error) => {
                message.error("An error occurred while logging out");
                console.error(error);
            });
    };


    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<EditOutlined />} onClick={() => navigate("/admin/edit-profile")}>
                Manage Profile
            </Menu.Item>
            <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        headerBg: "#ffffff",
                        headerColor: "#000000",
                    },
                },
            }}
        >
            <Layout className="min-h-screen">
                <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white h-screen" theme="light">
                    <div className="demo-logo-vertical py-2 ps-2">
                        <span>
                            {collapsed ? (
                                <Image
                                    preview={false}
                                    src="https://res.cloudinary.com/dd2alel5h/image/upload/v1737803880/sayl_qsabxv.png"
                                    height={55}
                                />
                            ) : (
                                <Image
                                    preview={false}
                                    src="https://res.cloudinary.com/dd2alel5h/image/upload/v1737360953/logo_saylaniwelfare.22bf709605809177256c_fm7fvu.png"
                                    height={50}
                                />
                            )}
                        </span>
                    </div>
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        items={[
                            {
                                key: "1",
                                icon: <UserOutlined />,
                                label: "Admin Dashboard",
                                onClick: () => navigate("/admin/dashboard"),
                            },
                            {
                                key: "2",
                                icon: <UploadOutlined />,
                                label: "Add loans",
                                onClick: () => navigate("/admin/addloans"),
                            },
                            {
                                key: "3",
                                icon: <UploadOutlined />,
                                label: "Manage loans",
                                onClick: () => navigate("/admin/getloans"),
                            },
                        ]}
                        className="mt-4"
                    />
                </Sider>
                <Layout>
                    <Header className="flex justify-between items-center p-0 shadow-md">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-xl w-16 h-16"
                        />
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Avatar src={userImage || <UserOutlined />} />
                                </Space>
                            </a>
                        </Dropdown>
                    </Header>
                    <Content className="m-6 p-6 bg-white rounded-lg shadow-md">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AdminSidebar;
