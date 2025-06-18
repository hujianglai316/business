import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Tooltip, Row, Col, Statistic } from 'antd';
import { 
  PlusOutlined, 
  RocketOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'ended';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
}

const PromotionCenter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // 模拟API调用获取推广活动数据
    setLoading(true);
    setTimeout(() => {
      const mockCampaigns: Campaign[] = Array.from({ length: 10 }, (_, index) => ({
        id: `campaign-${index + 1}`,
        name: `推广活动 ${index + 1}`,
        type: ['房源推广', '品牌推广', '活动推广'][Math.floor(Math.random() * 3)],
        status: ['active', 'paused', 'ended'][Math.floor(Math.random() * 3)] as Campaign['status'],
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        budget: 10000 + Math.floor(Math.random() * 90000),
        spent: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 100000),
        clicks: Math.floor(Math.random() * 1000),
        leads: Math.floor(Math.random() * 100),
      }));
      setCampaigns(mockCampaigns);
      setLoading(false);
    }, 1000);
  }, []);

  const columns: ColumnsType<Campaign> = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => navigate(`/rental/promotion/detail/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Campaign['status']) => {
        const statusConfig = {
          active: { color: 'success', text: '进行中' },
          paused: { color: 'warning', text: '已暂停' },
          ended: { color: 'default', text: '已结束' },
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
    },
    {
      title: '时间',
      key: 'date',
      render: (_, record) => (
        <span>{record.startDate} 至 {record.endDate}</span>
      ),
    },
    {
      title: '预算/支出',
      key: 'budget',
      render: (_, record) => (
        <span>¥{record.spent} / ¥{record.budget}</span>
      ),
    },
    {
      title: '数据',
      key: 'data',
      render: (_, record) => (
        <Space>
          <Tooltip title="展示次数">
            <span>展示: {record.impressions}</span>
          </Tooltip>
          <Tooltip title="点击次数">
            <span>点击: {record.clicks}</span>
          </Tooltip>
          <Tooltip title="获取线索">
            <span>线索: {record.leads}</span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/rental/promotion/detail/${record.id}`)} 
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/rental/promotion/edit/${record.id}`)} 
            />
          </Tooltip>
          <Tooltip title="数据分析">
            <Button 
              type="text" 
              icon={<LineChartOutlined />} 
              onClick={() => navigate(`/rental/promotion/analytics/${record.id}`)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 如果是子路由，渲染子组件
  if (location.pathname !== '/rental/promotion') {
    return <Outlet />;
  }

  return (
    <div>
      <Card>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic
              title="总推广活动"
              value={campaigns.length}
              prefix={<RocketOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="进行中活动"
              value={campaigns.filter(c => c.status === 'active').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总展示次数"
              value={campaigns.reduce((sum, c) => sum + c.impressions, 0)}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总获取线索"
              value={campaigns.reduce((sum, c) => sum + c.leads, 0)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>
      </Card>

      <Card 
        title="推广活动列表" 
        style={{ marginTop: 24 }}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/rental/promotion/create')}
          >
            新建活动
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={campaigns}
          loading={loading}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default PromotionCenter; 