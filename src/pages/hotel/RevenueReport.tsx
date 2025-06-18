import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Table,
  Space,
  Typography,
  Tabs,
  Statistic,
  Progress,
  Tag,
  Tooltip,
  Divider
} from 'antd';
import {
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  occupancyRate: number;
  averagePrice: number;
}

interface RoomTypeRevenue {
  roomType: string;
  revenue: number;
  orders: number;
  percentage: number;
}

const RevenueReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');
  const [dateRange, setDateRange] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [roomTypeData, setRoomTypeData] = useState<RoomTypeRevenue[]>([]);
  const [loading, setLoading] = useState(false);

  const timeRangeOptions = [
    { key: '7days', label: '最近7天', days: 7 },
    { key: '30days', label: '最近30天', days: 30 },
    { key: '90days', label: '最近90天', days: 90 },
    { key: 'custom', label: '自定义', days: 0 }
  ];

  useEffect(() => {
    generateMockData();
  }, [timeRange, dateRange]);

  const generateMockData = () => {
    setLoading(true);
    
    let days = 30;
    let startDate = dayjs().subtract(30, 'day');
    
    if (timeRange !== 'custom') {
      const option = timeRangeOptions.find(opt => opt.key === timeRange);
      days = option?.days || 30;
      startDate = dayjs().subtract(days, 'day');
    } else if (dateRange && dateRange[0] && dateRange[1]) {
      startDate = dateRange[0];
      days = dateRange[1].diff(dateRange[0], 'day') + 1;
    }

    // 生成营收数据
    const mockRevenueData: RevenueData[] = [];
    for (let i = 0; i < days; i++) {
      const date = startDate.add(i, 'day');
      const isWeekend = date.day() === 0 || date.day() === 6;
      
      const baseRevenue = 15000 + Math.random() * 10000;
      const weekendMultiplier = isWeekend ? 1.3 : 1;
      const revenue = Math.round(baseRevenue * weekendMultiplier);
      
      const orders = Math.floor(revenue / (300 + Math.random() * 200));
      const occupancyRate = Math.round((60 + Math.random() * 35) * 10) / 10;
      const averagePrice = Math.round(revenue / orders);
      
      mockRevenueData.push({
        date: date.format('YYYY-MM-DD'),
        revenue,
        orders,
        occupancyRate,
        averagePrice
      });
    }
    
    // 生成房型营收数据
    const roomTypes = [
      { name: '标准大床房', baseRevenue: 8000 },
      { name: '豪华双床房', baseRevenue: 6000 },
      { name: '行政套房', baseRevenue: 4000 },
      { name: '商务大床房', baseRevenue: 3000 }
    ];
    
    const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
    
    const mockRoomTypeData: RoomTypeRevenue[] = roomTypes.map(room => {
      const revenue = Math.round(room.baseRevenue * days * (0.8 + Math.random() * 0.4));
      const orders = Math.floor(revenue / (room.baseRevenue / 20));
      const percentage = Math.round((revenue / totalRevenue) * 100 * 10) / 10;
      
      return {
        roomType: room.name,
        revenue,
        orders,
        percentage
      };
    });
    
    setRevenueData(mockRevenueData);
    setRoomTypeData(mockRoomTypeData);
    setLoading(false);
  };

  const getStatistics = () => {
    if (revenueData.length === 0) return null;
    
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
    const averageOccupancy = revenueData.reduce((sum, item) => sum + item.occupancyRate, 0) / revenueData.length;
    const averagePrice = totalRevenue / totalOrders;
    
    // 计算同比增长（模拟数据）
    const revenueGrowth = (Math.random() - 0.5) * 20;
    const orderGrowth = (Math.random() - 0.5) * 15;
    const occupancyGrowth = (Math.random() - 0.5) * 10;
    const priceGrowth = (Math.random() - 0.5) * 8;
    
    return {
      totalRevenue,
      totalOrders,
      averageOccupancy,
      averagePrice,
      revenueGrowth,
      orderGrowth,
      occupancyGrowth,
      priceGrowth
    };
  };

  const renderTrendIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpOutlined style={{ color: '#52c41a' }} />
    ) : (
      <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
    );
  };

  const renderTrendText = (growth: number) => {
    const color = growth >= 0 ? '#52c41a' : '#ff4d4f';
    const prefix = growth >= 0 ? '+' : '';
    return (
      <Text style={{ color, fontSize: 12 }}>
        {prefix}{growth.toFixed(1)}%
      </Text>
    );
  };

  // 营收趋势图配置
  const revenueLineConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'revenue',
    height: 300,
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
    xAxis: {
      tickCount: Math.min(revenueData.length, 10)
    },
    yAxis: {
      label: {
        formatter: (value: string) => `¥${Number(value).toLocaleString()}`
      }
    }
  };

  // 订单量柱状图配置
  const orderColumnConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'orders',
    height: 300,
    columnWidthRatio: 0.6,
    tooltip: {
      formatter: (datum: any) => ({
        name: '订单量',
        value: `${datum.orders}单`
      })
    },
    xAxis: {
      tickCount: Math.min(revenueData.length, 10)
    }
  };

  // 房型营收饼图配置
  const roomTypePieConfig = {
    data: roomTypeData,
    angleField: 'revenue',
    colorField: 'roomType',
    height: 300,
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}\n{percentage}%'
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.roomType,
        value: `¥${datum.revenue.toLocaleString()}`
      })
    },
    legend: {
      position: 'bottom'
    }
  };

  const statistics = getStatistics();

  const tabItems = [
    {
      key: 'overview',
      label: '营收概览',
      icon: <BarChartOutlined />
    },
    {
      key: 'trend',
      label: '趋势分析',
      icon: <LineChartOutlined />
    },
    {
      key: 'breakdown',
      label: '分类统计',
      icon: <PieChartOutlined />
    }
  ];

  const renderOverviewTab = () => (
    <div>
      {/* 核心指标卡片 */}
      {statistics && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总营收"
                value={statistics.totalRevenue}
                prefix="¥"
                precision={0}
                valueStyle={{ color: '#1890ff' }}
                suffix={
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {renderTrendIcon(statistics.revenueGrowth)}
                    {renderTrendText(statistics.revenueGrowth)}
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="订单总数"
                value={statistics.totalOrders}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix={
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {renderTrendIcon(statistics.orderGrowth)}
                    {renderTrendText(statistics.orderGrowth)}
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="平均入住率"
                value={statistics.averageOccupancy}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#722ed1' }}
                prefix={
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {renderTrendIcon(statistics.occupancyGrowth)}
                    {renderTrendText(statistics.occupancyGrowth)}
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="平均房价"
                value={statistics.averagePrice}
                prefix="¥"
                precision={0}
                valueStyle={{ color: '#fa8c16' }}
                suffix={
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {renderTrendIcon(statistics.priceGrowth)}
                    {renderTrendText(statistics.priceGrowth)}
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 营收趋势图 */}
      <Card title="营收趋势" style={{ marginBottom: 16 }}>
        <Line {...revenueLineConfig} />
      </Card>

      {/* 详细数据表格 */}
      <Card title="详细数据">
        <Table
          dataSource={revenueData}
          rowKey="date"
          size="small"
          pagination={{ pageSize: 10 }}
          columns={[
            {
              title: '日期',
              dataIndex: 'date',
              key: 'date',
              render: (date: string) => dayjs(date).format('MM-DD')
            },
            {
              title: '营收',
              dataIndex: 'revenue',
              key: 'revenue',
              render: (value: number) => `¥${value.toLocaleString()}`,
              sorter: (a, b) => a.revenue - b.revenue
            },
            {
              title: '订单量',
              dataIndex: 'orders',
              key: 'orders',
              render: (value: number) => `${value}单`,
              sorter: (a, b) => a.orders - b.orders
            },
            {
              title: '入住率',
              dataIndex: 'occupancyRate',
              key: 'occupancyRate',
              render: (value: number) => (
                <div>
                  <Progress 
                    percent={value} 
                    size="small" 
                    format={(percent) => `${percent}%`}
                  />
                </div>
              ),
              sorter: (a, b) => a.occupancyRate - b.occupancyRate
            },
            {
              title: '平均房价',
              dataIndex: 'averagePrice',
              key: 'averagePrice',
              render: (value: number) => `¥${value.toLocaleString()}`,
              sorter: (a, b) => a.averagePrice - b.averagePrice
            }
          ]}
        />
      </Card>
    </div>
  );

  const renderTrendTab = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="营收趋势">
            <Line {...revenueLineConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="订单量趋势">
            <Column {...orderColumnConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderBreakdownTab = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="房型营收分布">
            <Pie {...roomTypePieConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="房型营收明细">
            <div style={{ padding: 16 }}>
              {roomTypeData.map((item, index) => (
                <div key={item.roomType} style={{ marginBottom: 16 }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>{item.roomType}</Text>
                    </Col>
                    <Col>
                      <Text style={{ color: '#1890ff' }}>
                        ¥{item.revenue.toLocaleString()}
                      </Text>
                    </Col>
                  </Row>
                  <Row justify="space-between" style={{ marginTop: 4 }}>
                    <Col>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.orders}单 · {item.percentage}%
                      </Text>
                    </Col>
                    <Col>
                      <Progress 
                        percent={item.percentage} 
                        size="small" 
                        showInfo={false}
                        strokeColor={`hsl(${index * 60}, 70%, 50%)`}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题和操作区 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>营收报表</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />}>
              导出报表
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 时间筛选器 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Text strong>时间范围：</Text>
          </Col>
          <Col>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              {timeRangeOptions.map(option => (
                <Option key={option.key} value={option.key}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          {timeRange === 'custom' && (
            <Col>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder={['开始日期', '结束日期']}
              />
            </Col>
          )}
        </Row>
      </Card>

      {/* 标签页内容 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map(item => ({
            key: item.key,
            label: (
              <span>
                {item.icon}
                {item.label}
              </span>
            ),
            children: (
              <div style={{ minHeight: 400 }}>
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'trend' && renderTrendTab()}
                {activeTab === 'breakdown' && renderBreakdownTab()}
              </div>
            )
          }))}
        />
      </Card>
    </div>
  );
};

export default RevenueReport;
