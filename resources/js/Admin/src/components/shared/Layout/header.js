import React, { useState } from 'react';
import { Layout, Space, Badge } from 'antd';
import { FaExchangeAlt } from 'react-icons/fa';
import { ShoppingCartOutlined } from '@ant-design/icons';  // Import the cart icon
import BreadCrum from './breadcrum';
import { useSelector } from 'react-redux';
import { useFetch } from "../../../hooks/request";
import { useNavigate } from 'react-router';

const { Header } = Layout;

function HeaderComp({ setCollapsed, collapsed }) {
    let navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const user = useSelector(state => state?.auth?.data);
    const {  data } = useFetch("get_cart");
    const cartQuantity = data?.length || 0;  // Calculate cart quantity

    const handleMenuClick = (e) => {
        if (e.key === '3') {
            setOpen(false);
        }
    };

    const handleOpenChange = (flag) => {
        setOpen(flag);
    };

    const handleCartClick = () => {
        // Navigate to the cart page when cart icon is clicked
        navigate('/admin/cart');  // Adjust the path to match your cart page route
    };

    return (
        <>
            <Header theme="light" className='bg-dark' style={{ padding: 0 }}>
                <div className='d-flex justify-content-between'>
                    <div className='mx-3'>
                        <FaExchangeAlt
                            style={{ color: '#fff', fontSize: 25 }}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    </div>
                    <div className='mx-3 text-white'>
                        <a className='mx-3 mb-2' onClick={(e) => e.preventDefault()}>
                            <Space>
                                {/* Avatar if needed */}
                                {/* <Avatar size={56} src={user?.image_url} /> */}
                                <span className='text-white'>Welcome : {user?.name}</span>
                                {/* Add the ShoppingCart icon with Badge */}
                                <Badge count={cartQuantity} showZero>
                                    <ShoppingCartOutlined style={{ color: '#fff', fontSize: 20 }} onClick={handleCartClick} />
                                </Badge>
                            </Space>
                        </a>
                    </div>
                </div>
            </Header>
            <BreadCrum />
        </>
    );
}

export default HeaderComp;
