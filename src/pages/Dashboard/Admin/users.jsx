import { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import { AppRoutes } from '../../../constant/constant';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => handleEdit(record)}>
                    Edit
                </Button>
            ),
        },
    ];

    const fetchUsers = async () => {
        try {
            const response = await axios.get(AppRoutes.users);
            setUsers(response.data.data);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch users', error);
            setLoading(false);
        }
    };

    // Edit handler (for demo purposes)
    const handleEdit = (record) => {
        message.info(`Edit user: ${record.name}`);
        // You can add your logic to open an edit modal or route to another page.
    };

    // Use useEffect to fetch users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);  // Empty array ensures this only runs once when component mounts

    return (
        <div style={{ padding: '24px' }}>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"  // Assuming you have '_id' for each user
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default UsersTable;
