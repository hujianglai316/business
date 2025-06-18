import React, { useState } from 'react';
import { Avatar, Dropdown, Space, Typography, Button, Modal, message } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, UserSwitchOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  businessType: 'rental' | 'hotel';
}

interface HeaderUserProps {
  businessType: 'rental' | 'hotel';
}

const HeaderUser: React.FC<HeaderUserProps> = ({ businessType }) => {
  const navigate = useNavigate();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // 模拟用户信息
  const userInfo: UserInfo = {
    id: '1',
    name: businessType === 'rental' ? '张三' : '李经理',
    email: businessType === 'rental' ? 'zhangsan@rental.com' : 'limanager@hotel.com',
    role: businessType === 'rental' ? '租房运营专员' : '酒店管理员',
    businessType,
  };

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    // 清除用户信息
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    message.success('退出登录成功');
    navigate('/auth/login');
  };

  const handleSwitchBusiness = () => {
    const targetType = businessType === 'rental' ? 'hotel' : 'rental';
    const targetPath = targetType === 'rental' ? '/rental/dashboard' : '/hotel/dashboard';
    navigate(targetPath);
    message.success(`已切换到${targetType === 'rental' ? '租房' : '酒店'}管理后台`);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => {
        message.info('个人信息功能开发中');
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
      onClick: () => {
        message.info('账户设置功能开发中');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'switch',
      icon: <UserSwitchOutlined />,
      label: `切换到${businessType === 'rental' ? '酒店' : '租房'}管理`,
      onClick: handleSwitchBusiness,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
        <div style={{ 
          cursor: 'pointer',
          padding: '0 16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        >
          <Space>
            <Avatar 
              size="small" 
              icon={<UserOutlined />}
              style={{ 
                backgroundColor: businessType === 'rental' ? '#1677ff' : '#52c41a',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>{userInfo.name}</Text>
              <Text style={{ fontSize: 12, color: '#999' }}>{userInfo.role}</Text>
            </div>
          </Space>
        </div>
      </Dropdown>

      <Modal
        title="确认退出"
        open={isLogoutModalVisible}
        onOk={confirmLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
        okText="确认退出"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要退出登录吗？退出后需要重新登录才能访问系统。</p>
      </Modal>
    </>
  );
};

export default HeaderUser; 