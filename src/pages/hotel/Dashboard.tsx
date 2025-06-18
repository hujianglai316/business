import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Statistic,
  Badge,
  List,
  Avatar,
  Tag,
  Progress,
  Tooltip,
  Alert,
  Tabs,
  notification
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  HomeOutlined,
  StarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BellOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface DashboardMetrics {
  todayOrders: number;
  todayRevenue: number;
  occupancyRate: number;
  satisfaction: number;
  orderGrowth: number;
  revenueGrowth: number;
  occupancyGrowth: number;
  satisfactionGrowth: number;
}

interface RoomStatus {
  total: number;
  occupied: number;
  reserved: number;
  available: number;
}

interface NotificationItem {
  id: string;
  type: 'order' | 'review' | 'refund' | 'system' | 'todo';
  title: string;
  content: string;
  time: string;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface TodoItem {
  id: string;
  title: string;
  priority: 'urgent' | 'important' | 'normal' | 'completed';
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderData, setOrderData] = useState<any[]>([]);

  useEffect(() => {
    generateMockData();
  }, [activeTab]);

  const generateMockData = () => {
    // 生成核心指标数据
    const mockMetrics: DashboardMetrics = {
      todayOrders: 128,
      todayRevenue: 12562,
      occupancyRate: 85,
      satisfaction: 4.8,
      orderGrowth: 12,
      revenueGrowth: 8,
      occupancyGrowth: -3,
      satisfactionGrowth: 0.2
    };

    // 生成房态数据
    const mockRoomStatus: RoomStatus = {
      total: 110,
      occupied: 85,
      reserved: 12,
      available: 13
    };

    // 生成通知数据
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'order',
        title: '新订单提醒',
        content: '订单 #12345 已支付成功',
        time: '10分钟前',
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'review',
        title: '新客户评价',
        content: '客户对房间服务给出5星好评',
        time: '30分钟前',
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'refund',
        title: '退款申请',
        content: '订单 #12340 申请退款，请处理',
        time: '1小时前',
        read: false,
        priority: 'high'
      },
      {
        id: '4',
        type: 'system',
        title: '系统更新通知',
        content: '系统将于今晚23:00进行维护更新',
        time: '2小时前',
        read: true,
        priority: 'low'
      },
      {
        id: '5',
        type: 'todo',
        title: '待处理事项',
        content: '有3个待处理的客户服务请求',
        time: '3小时前',
        read: false,
        priority: 'medium'
      }
    ];

    // 生成待办事项
    const mockTodos: TodoItem[] = [
      {
        id: '1',
        title: '处理退款申请 #12340',
        priority: 'urgent',
        completed: false
      },
      {
        id: '2',
        title: '更新房间价格信息',
        priority: 'important',
        completed: false
      },
      {
        id: '3',
        title: '回复客户评价',
        priority: 'normal',
        completed: false
      },
      {
        id: '4',
        title: '检查房间设施',
        priority: 'completed',
        completed: true
      }
    ];

    // 生成图表数据
    const days = activeTab === 'today' ? 24 : activeTab === 'week' ? 7 : 30;
    const mockRevenueData = [];
    const mockOrderData = [];

    for (let i = 0; i < days; i++) {
      const date = activeTab === 'today' 
        ? `${i}:00`
        : dayjs().subtract(days - i - 1, activeTab === 'week' ? 'day' : 'day').format('MM-DD');
      
      const revenue = Math.floor(Math.random() * 5000) + 3000;
      const orders = Math.floor(Math.random() * 50) + 20;
      
      mockRevenueData.push({ date, revenue });
      mockOrderData.push({ date, orders, revenue });
    }

    setMetrics(mockMetrics);
    setRoomStatus(mockRoomStatus);
    setNotifications(mockNotifications);
    setTodos(mockTodos);
    setRevenueData(mockRevenueData);
    setOrderData(mockOrderData);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCartOutlined style={{ color: '#1890ff' }} />;
      case 'review':
        return <StarOutlined style={{ color: '#faad14' }} />;
      case 'refund':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'system':
        return <BellOutlined style={{ color: '#52c41a' }} />;
      case 'todo':
        return <ClockCircleOutlined style={{ color: '#722ed1' }} />;
      default:
        return <BellOutlined />;
    }
  };

  const getTodoPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { color: 'red', text: '紧急' };
      case 'important':
        return { color: 'orange', text: '重要' };
      case 'normal':
        return { color: 'blue', text: '普通' };
      case 'completed':
        return { color: 'green', text: '已完成' };
      default:
        return { color: 'default', text: '普通' };
    }
  };

  const renderTrendIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpOutlined style={{ color: '#52c41a' }} />
    ) : (
      <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
    );
  };

  const renderTrendText = (growth: number, suffix = '%') => {
    const color = growth >= 0 ? '#52c41a' : '#ff4d4f';
    const prefix = growth >= 0 ? '+' : '';
    return (
      <Text style={{ color, fontSize: 12 }}>
        {renderTrendIcon(growth)} {prefix}{growth}{suffix} 较昨日
      </Text>
    );
  };

  // 营收图表配置
  const revenueLineConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'revenue',
    height: 250,
    smooth: true,
    point: {
      size: 3,
      shape: 'circle'
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '营收',
        value: `¥${datum.revenue.toLocaleString()}`
      })
    },
    yAxis: {
      label: {
        formatter: (value: string) => `¥${Number(value).toLocaleString()}`
      }
    }
  };

  // 订单图表配置
  const orderColumnConfig = {
    data: orderData,
    xField: 'date',
    yField: 'orders',
    height: 250,
    columnWidthRatio: 0.6,
    tooltip: {
      formatter: (datum: any) => ({
        name: '订单量',
        value: `${datum.orders}单`
      })
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(item => 
        item.id === notificationId ? { ...item, read: true } : item
      )
    );
  };

  const handleTodoToggle = (todoId: string) => {
    setTodos(prev =>
      prev.map(item =>
        item.id === todoId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  if (!metrics || !roomStatus) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>工作台</Title>
          <Text type="secondary">欢迎回来，今天是 {dayjs().format('YYYY年MM月DD日')}</Text>
        </Col>
        <Col>
          <Space>
            <Badge count={notifications.filter(n => !n.read).length}>
              <Button icon={<BellOutlined />}>
                通知中心
              </Button>
            </Badge>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 左侧主要内容区域 */}
        <Col xs={24} lg={18}>
          {/* 核心指标卡片 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="今日订单"
                  value={metrics.todayOrders}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                  suffix={
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      {renderTrendText(metrics.orderGrowth)}
                    </div>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="今日营收"
                  value={metrics.todayRevenue}
                  prefix="¥"
                  precision={0}
                  valueStyle={{ color: '#52c41a' }}
                  suffix={
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      {renderTrendText(metrics.revenueGrowth)}
                    </div>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="入住率"
                  value={metrics.occupancyRate}
                  suffix="%"
                  prefix={<HomeOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  {renderTrendText(metrics.occupancyGrowth)}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="客户满意度"
                  value={metrics.satisfaction}
                  precision={1}
                  prefix={<StarOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                  suffix={
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      {renderTrendText(metrics.satisfactionGrowth, '')}
                    </div>
                  }
                />
              </Card>
            </Col>
          </Row>

          {/* 房态概览 */}
          <Card title="房态概览" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#1890ff', color: 'white' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>总售卖房间数</span>}
                    value={roomStatus.total}
                    valueStyle={{ color: 'white', fontSize: 32 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#52c41a', color: 'white' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>已入住房间数</span>}
                    value={roomStatus.occupied}
                    valueStyle={{ color: 'white', fontSize: 32 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#1890ff', color: 'white' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>已预订房间数</span>}
                    value={roomStatus.reserved}
                    valueStyle={{ color: 'white', fontSize: 32 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#faad14', color: 'white' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>剩余可售房间数</span>}
                    value={roomStatus.available}
                    valueStyle={{ color: 'white', fontSize: 32 }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          {/* 营收数据看板 */}
          <Card 
            title="营收数据看板"
            extra={
              <Space>
                <Button 
                  type={activeTab === 'today' ? 'primary' : 'default'}
                  onClick={() => setActiveTab('today')}
                >
                  今日
                </Button>
                <Button 
                  type={activeTab === 'week' ? 'primary' : 'default'}
                  onClick={() => setActiveTab('week')}
                >
                  本周
                </Button>
                <Button 
                  type={activeTab === 'month' ? 'primary' : 'default'}
                  onClick={() => setActiveTab('month')}
                >
                  本月
                </Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Line {...revenueLineConfig} />
              </Col>
              <Col xs={24} lg={8}>
                <div style={{ padding: 16 }}>
                  <div style={{ marginBottom: 24 }}>
                    <Text type="secondary">总订单量</Text>
                    <div style={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }}>1,286</div>
                    <Text style={{ color: '#52c41a', fontSize: 12 }}>
                      <ArrowUpOutlined /> +15% 较上期
                    </Text>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <Text type="secondary">总销售额</Text>
                    <div style={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }}>¥125,680</div>
                    <Text style={{ color: '#52c41a', fontSize: 12 }}>
                      <ArrowUpOutlined /> +12% 较上期
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">平均客单价</Text>
                    <div style={{ fontSize: 24, fontWeight: 600, color: '#fa8c16' }}>¥978</div>
                    <Text style={{ color: '#ff4d4f', fontSize: 12 }}>
                      <ArrowDownOutlined /> -3% 较上期
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 订单与营收趋势 */}
          <Card 
            title="订单与营收趋势"
            extra={
              <Space>
                <span style={{ fontSize: 12 }}>
                  <span style={{ color: '#1890ff' }}>●</span> 订单量
                </span>
                <span style={{ fontSize: 12 }}>
                  <span style={{ color: '#52c41a' }}>●</span> 销售额
                </span>
              </Space>
            }
          >
            <Column {...orderColumnConfig} />
          </Card>
        </Col>

        {/* 右侧通知和待办 */}
        <Col xs={24} lg={6}>
          {/* 通知中心 */}
          <Card 
            title="通知中心" 
            extra={<Badge count={notifications.filter(n => !n.read).length} />}
            style={{ marginBottom: 16 }}
          >
            <List
              size="small"
              dataSource={notifications.slice(0, 5)}
              renderItem={(item) => (
                <List.Item
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: item.read ? 'transparent' : '#f6f8fa',
                    padding: '8px 0',
                    borderRadius: 4
                  }}
                  onClick={() => handleNotificationClick(item.id)}
                >
                  <List.Item.Meta
                    avatar={getNotificationIcon(item.type)}
                    title={
                      <div style={{ fontSize: 13, fontWeight: item.read ? 'normal' : 600 }}>
                        {item.title}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: 12, marginBottom: 4 }}>{item.content}</div>
                        <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Button type="link" size="small">查看全部通知</Button>
            </div>
          </Card>

          {/* 待办事项 */}
          <Card title="待办事项">
            <List
              size="small"
              dataSource={todos}
              renderItem={(item) => {
                const priorityConfig = getTodoPriorityConfig(item.priority);
                return (
                  <List.Item
                    style={{ padding: '8px 0' }}
                    actions={[
                      <Button
                        type="text"
                        size="small"
                        icon={item.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                        onClick={() => handleTodoToggle(item.id)}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Tag color={priorityConfig.color} style={{ margin: 0, fontSize: 10 }}>
                            {priorityConfig.text}
                          </Tag>
                          <span 
                            style={{ 
                              fontSize: 13,
                              textDecoration: item.completed ? 'line-through' : 'none',
                              color: item.completed ? '#999' : 'inherit'
                            }}
                          >
                            {item.title}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 