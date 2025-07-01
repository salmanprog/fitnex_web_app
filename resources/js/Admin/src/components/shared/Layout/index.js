import { Layout } from 'antd';
import React, { useState } from 'react';
import Header from './header';
import Sidebar from './sidebar';

const { Content } = Layout;

function LayoutComp({children}) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout>
            {/* sidbar */}
            {
                !collapsed &&
                <Sidebar collapsed={collapsed} />
            }
            <Layout className="site-layout">
                {/* header */}
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content className='content'>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutComp;