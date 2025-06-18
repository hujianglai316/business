import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Form,
  Select,
  DatePicker,
  Button,
  Space,
  Table,
  Progress,
  Divider
} from 'antd';
import {
  ShoppingCartOutlined,
  MoneyCollectOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface StatisticsData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderAmount: number;
  cancellationRate: number;
  revenueTrend: { date: string; value: number }[];
  orderSource: { type: string; value: number }[];
  roomTypeAnalysis: { roomType: string; orders: number; revenue: number }[];
}

const OrderStatistics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadStatisticsData();
  }, []);

  const loadStatisticsData = async () => {
    setLoading(true);
    
    // 模拟数据
    const mockData: StatisticsData = {
      totalRevenue: 128560,
      totalOrders: 156,
      avgOrderAmount: 824,
      cancellationRate: 3.2,
      revenueTrend: [
        { date: '2024-04-01', value: 12000 },
        { date: '2024-04-02', value: 15000 },
        { date: '2024-04-03', value: 18000 },
        { date: '2024-04-04', value: 22000 },
        { date: '2024-04-05', value: 19000 },
        { date: '2024-04-06', value: 25000 },
        { date: '2024-04-07', value: 28000 }
      ],
      orderSource: [
        { type: '官网', value: 45 },
        { type: 'APP', value: 30 },
        { type: '微信小程序', value: 15 },
        { type: 'OTA平台', value: 10 }
      ],
      roomTypeAnalysis: [
        { roomType: '标准大床房', orders: 45, revenue: 35000 },
        { roomType: '豪华大床房', orders: 38, revenue: 42000 },
        { roomType: '豪华双床房', orders: 32, revenue: 38000 },
        { roomType: '行政套房', orders: 15, revenue: 28000 }
      ]
    };

    setTimeout(() => {
      setStatisticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = async () => {
    const values = await form.validateFields();
    console.log('搜索条件:', values);
    await loadStatisticsData();
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleExport = () => {
    console.log('导出报表');
  };

  // 营业额趋势图配置
  const revenueConfig = {
    data: statisticsData?.revenueTrend || [],
    xField: 'date',
    yField: 'value',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    color: '#1890ff',
  };

  // 订单来源分布图配置
  const sourceConfig = {
    appendPadding: 10,
    data: statisticsData?.orderSource || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  // 房型分析图配置
  const roomTypeConfig = {
    data: statisticsData?.roomTypeAnalysis.map(item => ({
      roomType: item.roomType,
      value: item.orders,
      type: '订单数'
    })) || [],
    xField: 'roomType',
    yField: 'value',
    seriesField: 'type',
    color: '#52c41a',
  };

  const roomTypeColumns = [
    {
      title: '房型',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: '订单数',
      dataIndex: 'orders',
      key: 'orders',
      render: (value: number) => `${value}间`,
    },
    {
      title: '营业额',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '平均单价',
      key: 'avgPrice',
      render: (_: any, record: any) => 
        `¥${Math.round(record.revenue / record.orders).toLocaleString()}`,
    },
    {
      title: '占比',
      key: 'percentage',
      render: (_: any, record: any) => {
        const total = statisticsData?.roomTypeAnalysis.reduce((sum, item) => sum + item.revenue, 0) || 0;
        const percentage = ((record.revenue / total) * 100).toFixed(1);
        return (
          <div>
            <Progress 
              percent={parseFloat(percentage)} 
              size="small" 
              showInfo={false}
              strokeColor="#1890ff"
            />
            <Text style={{ fontSize: 12 }}>{percentage}%</Text>
          </div>
        );
      },
    },
  ];

  if (!statisticsData) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>订单统计</Title>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Form form={form} layout="inline">
          <Form.Item name="period" label="统计周期">
            <Select defaultValue="month" style={{ width: 120 }}>
              <Option value="today">今日</Option>
              <Option value="yesterday">昨日</Option>
              <Option value="week">本周</Option>
              <Option value="month">本月</Option>
              <Option value="quarter">本季度</Option>
              <Option value="year">本年</Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Form.Item>

          <Form.Item name="dateRange" label="日期范围">
            <RangePicker />
          </Form.Item>

          <Form.Item name="roomType" label="房型">
            <Select placeholder="全部房型" style={{ width: 150 }} allowClear>
              <Option value="standard">标准大床房</Option>
              <Option value="deluxe">豪华大床房</Option>
              <Option value="twin">豪华双床房</Option>
              <Option value="executive">行政套房</Option>
            </Select>
          </Form.Item>

          <Form.Item name="source" label="订单来源">
            <Select placeholder="全部来源" style={{ width: 150 }} allowClear>
              <Option value="website">官网</Option>
              <Option value="app">APP</Option>
              <Option value="wechat">微信小程序</Option>
              <Option value="ota">OTA平台</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="订单状态">
            <Select placeholder="全部状态" style={{ width: 150 }} allowClear>
              <Option value="pending">待确认</Option>
              <Option value="confirmed">已确认</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出报表
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总营业额"
              value={statisticsData.totalRevenue}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <span style={{ fontSize: 12, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 12.5%
                </span>
              }
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              较上月增长
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={statisticsData.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <span style={{ fontSize: 12, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 8.3%
                </span>
              }
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              较上月增长
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均订单金额"
              value={statisticsData.avgOrderAmount}
              prefix="¥"
              valueStyle={{ color: '#13c2c2' }}
              suffix={
                <span style={{ fontSize: 12, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 3.9%
                </span>
              }
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              较上月增长
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="取消率"
              value={statisticsData.cancellationRate}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
              prefix={
                <span style={{ fontSize: 12, color: '#f5222d' }}>
                  <ArrowDownOutlined /> 0.8%
                </span>
              }
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              较上月下降
            </div>
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="营业额趋势" loading={loading}>
            <Line {...revenueConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="订单来源分布" loading={loading}>
            <Pie {...sourceConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 房型分析 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="房型销售分析" loading={loading}>
            <Column {...roomTypeConfig} height={300} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="房型详细数据" loading={loading}>
            <Table
              columns={roomTypeColumns}
              dataSource={statisticsData.roomTypeAnalysis}
              rowKey="roomType"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatistics; 