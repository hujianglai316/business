import React from 'react';
import { Breadcrumb, Row, Col, Card, Statistic, Button, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

// 面包屑项配置
export interface BreadcrumbItem {
  title: string;
  path?: string;
}

// 统计卡片配置
export interface StatisticItem {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  valueStyle?: React.CSSProperties;
}

// 页面头部操作按钮配置
export interface HeaderAction {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

// 页面布局组件属性
export interface PageLayoutProps {
  // 面包屑导航
  breadcrumbs: BreadcrumbItem[];
  
  // 页面标题
  title: string;
  
  // 页面副标题或描述
  subtitle?: string;
  
  // 头部右侧操作按钮
  headerActions?: HeaderAction[];
  
  // 头部右侧自定义内容（替代headerActions）
  headerExtra?: React.ReactNode;
  
  // 统计卡片数据
  statistics?: StatisticItem[];
  
  // 筛选区域内容
  filterContent?: React.ReactNode;
  
  // 主要内容
  children: React.ReactNode;
  
  // 是否显示统计卡片
  showStatistics?: boolean;
  
  // 是否显示筛选区域
  showFilter?: boolean;
  
  // 页面加载状态
  loading?: boolean;
  
  // 额外的页面容器样式
  containerStyle?: React.CSSProperties;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  breadcrumbs,
  title,
  subtitle,
  headerActions = [],
  headerExtra,
  statistics = [],
  filterContent,
  children,
  showStatistics = true,
  showFilter = true,
  loading = false,
  containerStyle = {},
}) => {
  const navigate = useNavigate();

  // 默认页面容器样式
  const defaultContainerStyle: React.CSSProperties = {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '24px',
    ...containerStyle,
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
      <div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>
            {subtitle}
          </p>
        )}
      </div>
      {(headerExtra || headerActions.length > 0) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {headerExtra || (
            <Space>
              {headerActions.map(action => (
                <Button
                  key={action.key}
                  type={action.type || 'default'}
                  icon={action.icon}
                  onClick={action.onClick}
                  danger={action.danger}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          )}
        </div>
      )}
    </div>
  );

  // 渲染统计卡片
  const renderStatistics = () => {
    if (!showStatistics || statistics.length === 0) return null;

    // 根据统计项数量动态设置列宽，确保一行显示且紧凑
    const getColProps = (total: number, index: number) => {
      if (total <= 3) return { span: 8 }; // 3个或更少：每个8列
      if (total === 4) return { span: 6 }; // 4个：每个6列
      if (total === 5) return { xs: 24, sm: 12, md: 8, lg: 4, xl: 4 }; // 5个：响应式布局
      return { xs: 24, sm: 12, md: 8, lg: 6, xl: 4 }; // 更多：固定布局
    };

    return (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statistics.map((stat, index) => (
          <Col {...getColProps(statistics.length, index)} key={index}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  ...stat.valueStyle
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // 渲染筛选区域
  const renderFilter = () => {
    if (!showFilter || !filterContent) return null;

    return (
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
        {filterContent}
      </Card>
    );
  };

  return (
    <div style={defaultContainerStyle}>
      {renderBreadcrumb()}
      {renderPageHeader()}
      {renderStatistics()}
      {renderFilter()}
      <div style={{ minHeight: 200 }}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 