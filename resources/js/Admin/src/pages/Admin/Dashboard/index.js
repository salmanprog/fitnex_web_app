import React, { useState, useEffect } from 'react';
import ContentWrapper from '../../../components/shared/Layout/index';
import { useFetch } from "../../../hooks/request";
import { Card, Col, Row, Typography, Space } from "antd";
import { UserOutlined, ToolOutlined, CustomerServiceOutlined, AppstoreAddOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ApplicationDashboard = () => {
  let user = window.helpers.getStorageData('session');
  const { data, loading } = useFetch("get_dashboard");

  // Add loading state and fallback
  if (loading || !data) {
    return (
      <ContentWrapper title='Dashboard'>
        <section className="main-content">
          <div className="row">
            <div className="col-md-12">
              <h2>Loading...</h2>
            </div>
          </div>
        </section>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper title='Dashboard'>
      <section className="main-content">
      {user.user_group_id === 2 && (
        <>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          {/* Jobs Request Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Jobs Request</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#1890ff' }}>
                {data?.job}
              </Title>
              <Text className="text-muted">Jobs Request</Text>
            </Card>
          </Col>

          {/* Orders Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <AppstoreAddOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Orders</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#52c41a' }}>
                {data?.order}
              </Title>
              <Text className="text-muted">Orders</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="margin-top-30" style={{ marginTop: '20px' }}>
          {/* Total Users Widget */}
          <Col span={6}>
            <Card
              title={
                <Space>
                  <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Total Crew</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#1890ff' }}>
                {data?.crew}
              </Title>
              <Text className="text-muted">Active Crew</Text>
            </Card>
          </Col>

          {/* Total Contractors Widget */}
          <Col span={6}>
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ fontSize: 20, color: '#722ed1' }} />
                  <Text type="secondary">Total Contractors</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#722ed1' }}>
                {data?.contractor}
              </Title>
              <Text className="text-muted">Active Contractors</Text>
            </Card>
          </Col>

          {/* Total Customers Widget */}
          <Col span={6}>
            <Card
              title={
                <Space>
                  <CustomerServiceOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Total Customers</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#52c41a' }}>
                {data?.customer}
              </Title>
              <Text className="text-muted">Active Customers</Text>
            </Card>
          </Col>

          {/* Total Managers Widget */}
          <Col span={6}>
            <Card
              title={
                <Space>
                  <AppstoreAddOutlined style={{ fontSize: 20, color: '#faad14' }} />
                  <Text type="secondary">Total Centers</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#faad14' }}>
                {data?.manager}
              </Title>
              <Text className="text-muted">Active Centers</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: '20px' }}>
          {/* Jobs Request Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Category</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#1890ff' }}>
                {data?.category}
              </Title>
              <Text className="text-muted">Product Category</Text>
            </Card>
          </Col>

          {/* Orders Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <AppstoreAddOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Services</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#52c41a' }}>
                {data?.services}
              </Title>
              <Text className="text-muted">Services</Text>
            </Card>
          </Col>
        </Row>
        </>
      )}
      {user.user_group_id === 3 && (
        <>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          {/* Jobs Request Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Jobs Request</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#1890ff' }}>
                {data?.job}
              </Title>
              <Text className="text-muted">Jobs Request</Text>
            </Card>
          </Col>

          {/* Orders Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <AppstoreAddOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Orders</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#52c41a' }}>
                {data?.order}
              </Title>
              <Text className="text-muted">Orders</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="margin-top-30" style={{ marginTop: '20px' }}>
          {/* Total Users Widget */}
          <Col span={8}>
            <Card
              title={
                <Space>
                  <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Total Crew</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#1890ff' }}>
                {data?.crew}
              </Title>
              <Text className="text-muted">Active Crew</Text>
            </Card>
          </Col>

          {/* Total Customers Widget */}
          <Col span={8}>
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ fontSize: 20, color: '#722ed1' }} />
                  <Text type="secondary">Total Customers</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#722ed1' }}>
                {data?.customer}
              </Title>
              <Text className="text-muted">Active Customers</Text>
            </Card>
          </Col>

          {/* Total Managers Widget */}
          <Col span={8}>
            <Card
              title={
                <Space>
                  <CustomerServiceOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Total Centers</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#52c41a' }}>
                {data?.manager}
              </Title>
              <Text className="text-muted">Active Centers</Text>
            </Card>
          </Col>

          
        </Row>
        </>
      )}
      {user.user_group_id === 4 && (
        <>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          {/* Jobs Request Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Jobs Request</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#1890ff' }}>
                {data?.job}
              </Title>
              <Text className="text-muted">Jobs Request</Text>
            </Card>
          </Col>

          {/* Orders Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <AppstoreAddOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Orders</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#52c41a' }}>
                {data?.order}
              </Title>
              <Text className="text-muted">Orders</Text>
            </Card>
          </Col>
        </Row>
        </>
      )}
      {user.user_group_id === 5 && (
        <>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          {/* Jobs Request Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Jobs Request</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#1890ff' }}>
                {data?.job}
              </Title>
              <Text className="text-muted">Jobs Request</Text>
            </Card>
          </Col>

          {/* Orders Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <AppstoreAddOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Orders</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#52c41a' }}>
                {data?.order}
              </Title>
              <Text className="text-muted">Orders</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="margin-top-30" style={{ marginTop: '20px' }}>
          {/* Total Users Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Total Crew</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#1890ff' }}>
                {data?.crew}
              </Title>
              <Text className="text-muted">Active Crew</Text>
            </Card>
          </Col>

          {/* Total Managers Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <CustomerServiceOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Total Centers</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#52c41a' }}>
                {data?.manager}
              </Title>
              <Text className="text-muted">Active Centers</Text>
            </Card>
          </Col>

          
        </Row>
        </>
      )}
      {user.user_group_id === 6 && (
        <>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          {/* Jobs Request Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <ToolOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text type="secondary">Today Jobs</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#1890ff' }}>
                {data?.today_job}
              </Title>
              <Text className="text-muted">Today Jobs Request</Text>
            </Card>
          </Col>

          {/* Orders Widget */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <AppstoreAddOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text type="secondary">Total Jobs</Text>
                </Space>
              }
              bordered={false}
              bodyStyle={{ textAlign: 'center' }}
            >
              <Title level={2} style={{ color: '#52c41a' }}>
                {data?.total_job}
              </Title>
              <Text className="text-muted">Total Jobs Request</Text>
            </Card>
          </Col>
        </Row>
        </>
      )}
      </section>
    </ContentWrapper>
  );
};

export default React.memo(ApplicationDashboard);
