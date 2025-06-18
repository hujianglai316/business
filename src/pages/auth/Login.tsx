import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, Space, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { Title, Text } = Typography;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border: none;
  
  .ant-card-body {
    padding: 32px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled.div`
  width: 64px;
  height: 64px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 28px;
`;

const BusinessTypeTab = styled.div`
  text-align: center;
  padding: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f5f5f5;
  }
  
  .icon {
    font-size: 32px;
    margin-bottom: 8px;
    color: #1890ff;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    justify-content: center;
    padding: 8px 24px;
  }
  
  .ant-tabs-content {
    padding-top: 24px;
  }
`;

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [businessType, setBusinessType] = useState<'rental' | 'hotel'>('rental');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    
    // 移除所有登录限制，直接允许登录
    console.log('登录信息:', { ...values, businessType });
    
    // 简化登录逻辑，移除延时和错误处理
    setTimeout(() => {
      // 设置用户信息到localStorage，确保登录状态正确
      const username = values.username || 'demo_user'; // 如果没有输入用户名，使用默认值
      const userInfo = {
        id: '1',
        username: username,
        businessType: businessType,
        name: businessType === 'rental' ? '租房商家' : '酒店商家',
        email: `${username}@example.com`,
        role: businessType === 'rental' ? '租房运营专员' : '酒店管理员',
      };
      
      const token = 'mock-token-' + Date.now(); // 生成模拟token
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('token', token);
      
      // 根据业务类型跳转到对应的后台
      if (businessType === 'rental') {
        message.success('租房商家登录成功！');
        navigate('/rental/dashboard');
      } else {
        message.success('酒店商家登录成功！');
        navigate('/hotel/dashboard');
      }
      setLoading(false);
    }, 300); // 进一步减少延时时间
  };

  const tabItems = [
    {
      key: 'rental',
      label: (
        <Space>
          <HomeOutlined />
          租房商家
        </Space>
      ),
      children: (
        <Form
          name="rental-login"
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名（可选）"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码（可选）"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              登录租房管理后台
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'hotel',
      label: (
        <Space>
          <ShopOutlined />
          酒店商家
        </Space>
      ),
      children: (
        <Form
          name="hotel-login"
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名（可选）"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码（可选）"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              登录酒店管理后台
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <LoginCard>
      <LogoContainer>
        <Logo>
          <HomeOutlined />
        </Logo>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          商家管理平台
        </Title>
        <Text type="secondary">选择您的商家类型进行登录</Text>
      </LogoContainer>

      <StyledTabs
        activeKey={businessType}
        onChange={(key) => setBusinessType(key as 'rental' | 'hotel')}
        items={tabItems}
        centered
      />
    </LoginCard>
  );
};

export default Login; 