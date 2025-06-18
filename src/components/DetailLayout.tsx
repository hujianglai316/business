import React from 'react';
import { Breadcrumb, Button, Space, Card } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

// 面包屑项配置
export interface BreadcrumbItem {
  title: string;
  path?: string;
}

// 页面操作按钮配置
export interface DetailAction {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

// 详情页面布局组件属性
export interface DetailLayoutProps {
  // 面包屑导航
  breadcrumbs: BreadcrumbItem[];
  
  // 页面标题
  title: string;
  
  // 页面副标题或描述
  subtitle?: string;
  
  // 返回路径
  backPath?: string;
  
  // 返回按钮文本
  backText?: string;
  
  // 头部右侧操作按钮
  actions?: DetailAction[];
  
  // 主要内容
  children: React.ReactNode;
  
  // 页面加载状态
  loading?: boolean;
  
  // 额外的页面容器样式
  containerStyle?: React.CSSProperties;
  
  // 是否显示返回按钮
  showBackButton?: boolean;
}

const DetailLayout: React.FC<DetailLayoutProps> = ({
  breadcrumbs,
  title,
  subtitle,
  backPath,
  backText = '返回',
  actions = [],
  children,
  loading = false,
  containerStyle = {},
  showBackButton = true,
}) => {
  const navigate = useNavigate();

  // 默认页面容器样式
  const defaultContainerStyle: React.CSSProperties = {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '24px',
    ...containerStyle,
  };

  // 处理返回按钮点击
  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  // 渲染面包屑导航
  const renderBreadcrumb = () => {
    const items = [
      {
        title: (
          <Link to="/rental/dashboard">
            <HomeOutlined />
          </Link>
        ),
      },
      ...breadcrumbs.map(item => ({
        title: item.path ? (
          <Link to={item.path}>{item.title}</Link>
        ) : (
          item.title
        ),
      })),
    ];

    return (
      <Breadcrumb
        items={items}
        style={{ marginBottom: 16 }}
      />
    );
  };

  // 渲染页面头部
  const renderPageHeader = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: 24 
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          {showBackButton && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ marginRight: 12, padding: '4px 8px' }}
            >
              {backText}
            </Button>
          )}
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
            {title}
          </h2>
        </div>
        {subtitle && (
          <p style={{ margin: 0, color: '#666', fontSize: 14, marginLeft: showBackButton ? 56 : 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      
      {actions.length > 0 && (
        <Space>
          {actions.map(action => (
            <Button
              key={action.key}
              type={action.type || 'default'}
              icon={action.icon}
              onClick={action.onClick}
              danger={action.danger}
              loading={loading}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      )}
    </div>
  );

  return (
    <div style={defaultContainerStyle}>
      {renderBreadcrumb()}
      {renderPageHeader()}
      <div style={{ minHeight: 200 }}>
        {children}
      </div>
    </div>
  );
};

export default DetailLayout; 