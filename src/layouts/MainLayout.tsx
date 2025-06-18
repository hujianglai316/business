import React, { useState } from 'react';
import { Layout, Menu, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  HomeOutlined,
  ShopOutlined,
  NotificationOutlined,
  MessageOutlined,
  CalendarOutlined,
  TeamOutlined,
  SettingOutlined,
  FileOutlined,
  MoneyCollectOutlined,
  StarOutlined,
  BarChartOutlined,
  PictureOutlined,
  UnorderedListOutlined,
  ToolOutlined,
  BellOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import HeaderUser from '../components/HeaderUser';
import HeaderNotification from '../components/HeaderNotification';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  businessType: 'rental' | 'hotel';
}

// 自定义样式组件
const StyledSider = styled(Sider)`
  .ant-layout-sider-children {
    background: #001529;
  }
  
  .ant-menu {
    background: #001529;
    color: rgba(255, 255, 255, 0.65);
  }

  .ant-menu-item {
    color: rgba(255, 255, 255, 0.65);
    &:hover {
      color: #fff;
    }
    &.ant-menu-item-selected {
      background-color: #1890ff;
      color: #fff;
    }
  }

  .ant-menu-submenu {
    color: rgba(255, 255, 255, 0.65);
    &:hover > .ant-menu-submenu-title {
      color: #fff;
    }
  }

  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #fff;
  }

  .ant-menu-item-icon {
    color: rgba(255, 255, 255, 0.65);
  }

  .ant-menu-item-selected .ant-menu-item-icon {
    color: #fff;
  }

  .ant-layout-sider-trigger {
    background: #002140;
  }
`;

const MainLayout: React.FC<MainLayoutProps> = ({ businessType }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 租房商家菜单配置
  const rentalMenuItems = [
    {
      key: '/rental/dashboard',
      icon: <DashboardOutlined />,
      label: '首页概览',
    },
    {
      key: '/rental/room-status',
      icon: <HomeOutlined />,
      label: '房态管理',
    },
    {
      key: '/rental/property',
      icon: <ShopOutlined />,
      label: '房源管理',
    },
    {
      key: '/rental/promotion',
      icon: <NotificationOutlined />,
      label: '推广中心',
    },
    {
      key: '/rental/consultation',
      icon: <MessageOutlined />,
      label: '租赁咨询',
    },
    {
      key: '/rental/appointment',
      icon: <CalendarOutlined />,
      label: '预约看房',
    },
    {
      key: '/rental/tenant',
      icon: <TeamOutlined />,
      label: '租客管理',
    },
    {
      key: '/rental/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 酒店商家菜单配置
  const hotelMenuItems = [
    {
      key: '/hotel/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: 'orders',
      icon: <FileOutlined />,
      label: '订单管理',
      children: [
        {
          key: '/hotel/orders',
          label: '订单列表',
        },
        {
          key: '/hotel/orders/statistics',
          label: '订单统计',
        },
      ],
    },
    {
      key: 'room-management',
      icon: <HomeOutlined />,
      label: '房价房态管理',
      children: [
        {
          key: '/hotel/room-status',
          label: '房态日历',
        },
        {
          key: '/hotel/batch-room-status',
          label: '批量设置房态房量',
        },
        {
          key: '/hotel/price-calendar',
          label: '房价日历',
        },
        {
          key: '/hotel/sales-products',
          label: '售卖产品',
        },
        {
          key: '/hotel/price-settings',
          label: '房价设置',
        },
      ],
    },
    {
      key: 'basic-info',
      icon: <UnorderedListOutlined />,
      label: '基础信息管理',
      children: [
        {
          key: '/hotel/basic-info',
          label: '酒店基本信息',
        },
        {
          key: '/hotel/room-management',
          label: '房型管理',
        },
        {
          key: '/hotel/image-management',
          label: '图片管理',
        },
        {
          key: '/hotel/policy-management',
          label: '政策信息',
        },
        {
          key: '/hotel/facility-management',
          label: '设施管理',
        },
      ],
    },
    {
      key: 'reviews',
      icon: <StarOutlined />,
      label: '评价管理',
      children: [
        {
          key: '/hotel/reviews',
          label: '评价列表',
        },
        {
          key: '/hotel/reviews/settings',
          label: '评价管理设置',
        },
      ],
    },
    {
      key: 'finance',
      icon: <MoneyCollectOutlined />,
      label: '财务管理',
      children: [
        {
          key: '/hotel/bills',
          label: '账单管理',
        },
        {
          key: '/hotel/invoices',
          label: '发票管理',
        },
      ],
    },
    {
      key: 'marketing',
      icon: <BellOutlined />,
      label: '营销管理',
      children: [
        {
          key: '/hotel/marketing',
          label: '营销活动',
        },
      ],
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: '营收统计报表',
      children: [
        {
          key: '/hotel/revenue-report',
          label: '营收报表',
        },
      ],
    },
  ];

  const menuItems = businessType === 'rental' ? rentalMenuItems : hotelMenuItems;
  const businessName = businessType === 'rental' ? '租房管理后台' : '酒店管理后台';
  const businessShortName = businessType === 'rental' ? '租管' : '酒管';

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <StyledSider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 14 : 16,
        }}>
          {collapsed ? businessShortName : businessName}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </StyledSider>
      <Layout>
        <Header style={{ 
          padding: 0, 
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ paddingLeft: 24, fontSize: 16, fontWeight: 'bold', color: '#333' }}>
            {businessName}
          </div>
          <Space size={0} style={{ height: '100%' }}>
            <HeaderNotification businessType={businessType} />
            <HeaderUser businessType={businessType} />
          </Space>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff',
          borderRadius: 6,
          minHeight: 280,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 