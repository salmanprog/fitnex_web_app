import React, { ReactNode } from 'react';
import { Layout, Menu } from 'antd';

const { Header, Footer, Content } = Layout;

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
        <div style={{ fontWeight: 'bold', fontSize: 20 }}>My Website</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ marginLeft: 'auto' }}
          items={[
            { key: '1', label: 'Home' },
            { key: '2', label: 'About' },
            { key: '3', label: 'Contact' },
          ]}
        />
      </Header>

      <Content style={{ padding: '24px', minHeight: '80vh' }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        © {new Date().getFullYear()} My Website. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default AppLayout;
