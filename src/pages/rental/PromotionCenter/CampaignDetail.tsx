import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Tabs, 
  Button, 
  Table, 
  Tag, 
  Divider, 
  Space, 
  Alert,
  Descriptions,
  Progress,
  Tooltip
} from 'antd';
import { 
  LineChartOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  PauseCircleOutlined,
  EditOutlined,
  RollbackOutlined,
  DollarOutlined,
  RocketOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface CampaignDetail {
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
  description: string;
  dailyData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    leads: number;
    spent: number;
    appointments: number;
    cost: number;
  }>;
  metrics: {
    costPerClick: number;
    costPerAppointment: number;
  };
  properties: Array<{
    id: string;
    name: string;
    impressions: number;
    clicks: number;
    appointments: number;
  }>;
  creatives: {
    title: string;
    description: string;
    format: 'image' | 'video' | 'carousel';
    callToAction: string;
  };
}

// 活动详情页面
const CampaignDetail: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // 模拟获取活动数据
  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      const mockData: CampaignDetail = {
        id: id!,
        name: '示例推广活动',
        type: '房源推广',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        budget: 10000,
        spent: 3500,
        impressions: 50000,
        clicks: 2500,
        leads: 100,
        description: '这是一个示例推广活动的详细描述...',
        dailyData: Array.from({ length: 30 }, (_, index) => ({
          date: dayjs().subtract(29 - index, 'days').format('YYYY-MM-DD'),
          impressions: 1000 + Math.floor(Math.random() * 1000),
          clicks: 50 + Math.floor(Math.random() * 50),
          leads: 2 + Math.floor(Math.random() * 5),
          spent: 100 + Math.floor(Math.random() * 100),
          appointments: 1 + Math.floor(Math.random() * 3),
          cost: 50 + Math.floor(Math.random() * 50),
        })),
        metrics: {
          costPerClick: 1.4,
          costPerAppointment: 35,
        },
        properties: Array.from({ length: 5 }, (_, index) => ({
          id: `property-${index + 1}`,
          name: `示例房源 ${index + 1}`,
          impressions: 1000 + Math.floor(Math.random() * 1000),
          clicks: 50 + Math.floor(Math.random() * 50),
          appointments: 1 + Math.floor(Math.random() * 3),
        })),
        creatives: {
          title: '精品房源推广',
          description: '高品质房源，优质生活选择',
          format: 'image',
          callToAction: '立即查看',
        },
      };
      setCampaign(mockData);
      setLoading(false);
    }, 1000);
  }, [id]);

  // 返回列表页
  const handleBack = () => {
          navigate('/rental/promotion');
  };

  // 编辑活动
  const handleEdit = () => {
          navigate(`/rental/promotion/edit/${id}`);
  };

  // 更改活动状态（暂停/激活）
  const handleStatusChange = () => {
    // 实际项目中这里应该是调用API
    setCampaign(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: prev.status === 'active' ? 'paused' : 'active'
      };
    });
  };

  // 渲染活动状态标签
  const renderStatusTag = (status: CampaignDetail['status']) => {
    const statusConfig = {
      active: { color: '#52c41a', text: '进行中' },
      paused: { color: '#faad14', text: '已暂停' },
      ended: { color: '#d9d9d9', text: '已结束' },
    };
    return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
  };

  if (loading || !campaign) {
    return <Card loading={true}></Card>;
  }

  // 配置趋势图
  const lineConfig = {
    data: campaign.dailyData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
    legend: {
      position: 'top',
    },
    xAxis: {
      title: {
        text: '日期',
      },
    },
    yAxis: {
      title: {
        text: '数量',
      },
      grid: {
        line: {
          style: {
            stroke: '#e8e8e8',
            lineWidth: 1,
            lineDash: [4, 5],
            strokeOpacity: 0.7,
          },
        },
      },
    },
    color: {
      '曝光量': '#1890ff',
      '点击量': '#52c41a',
      '获取线索': '#fa8c16',
      '花费金额': '#f5222d'
    },
    tooltip: {
      shared: true,
    },
    point: {
      size: 4,
      shape: 'circle',
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <RollbackOutlined 
          onClick={handleBack} 
          style={{ fontSize: 16, marginRight: 8, cursor: 'pointer' }}
        />
        <Title level={3} style={{ margin: 0 }}>{campaign.name}</Title>
        <div style={{ marginLeft: 'auto' }}>
          <Space>
            <Button 
              type={campaign.status === 'active' ? 'primary' : 'default'} 
              danger={campaign.status === 'active'}
              onClick={handleStatusChange}
            >
              {campaign.status === 'active' ? '暂停活动' : '激活活动'}
            </Button>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              编辑活动
            </Button>
          </Space>
        </div>
      </div>

      {/* 活动概览卡片 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="活动状态"
              value={campaign.status === 'active' ? '进行中' : campaign.status === 'paused' ? '已暂停' : '已结束'}
              valueStyle={{ 
                color: campaign.status === 'active' ? '#52c41a' : 
                       campaign.status === 'paused' ? '#faad14' : '#d9d9d9' 
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活动类型"
              value={campaign.type}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活动周期"
              value={`${campaign.startDate} 至 ${campaign.endDate}`}
              valueStyle={{ fontSize: '14px' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="每日预算"
              value={campaign.budget}
              precision={2}
              prefix="￥"
              suffix="元"
            />
          </Col>
        </Row>
      </Card>

      {/* 活动数据指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="预算使用"
              value={campaign.spent}
              suffix={` / ${campaign.budget}`}
              prefix="￥"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={Math.round((campaign.spent / campaign.budget) * 100)} 
              size="small" 
              status={campaign.spent > campaign.budget ? 'exception' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="展示次数"
              value={campaign.impressions}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="点击次数"
              value={campaign.clicks}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="获取线索"
              value={campaign.leads}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 活动详细信息 */}
      <Card 
        style={{ marginBottom: 24 }}
        tabList={[
          { key: 'overview', tab: '概览数据' },
          { key: 'trend', tab: '趋势分析' },
          { key: 'property', tab: '房源表现' },
          { key: 'creative', tab: '创意素材' },
          { key: 'setting', tab: '活动设置' },
        ]}
        activeTabKey={activeTab}
        onTabChange={(key) => setActiveTab(key)}
      >
        {activeTab === 'overview' && (
          <div>
            <Row gutter={16}>
              <Col span={16}>
                <Title level={5}>活动效果趋势</Title>
                <Line {...lineConfig} height={300} />
              </Col>
              <Col span={8}>
                <Title level={5}>预算使用情况</Title>
                <Statistic 
                  title="已使用预算" 
                  value={campaign.spent} 
                  precision={2}
                  prefix="￥" 
                  suffix={`/ ${campaign.budget}元`}
                  valueStyle={{ color: '#1890ff' }}
                />
                <Progress 
                  percent={parseFloat(((campaign.spent / campaign.budget) * 100).toFixed(1))} 
                  status="active" 
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  style={{ marginTop: 16 }}
                />
                <Divider />
                
                <Title level={5}>成本效率</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="平均点击成本"
                      value={campaign.metrics.costPerClick}
                      precision={2}
                      prefix="￥"
                      valueStyle={{ fontSize: '20px', color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="平均预约成本"
                      value={campaign.metrics.costPerAppointment}
                      precision={2}
                      prefix="￥"
                      valueStyle={{ fontSize: '20px', color: '#52c41a' }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            
            <Divider />
            
            <Title level={5}>受众洞察</Title>
            <Alert
              message="活动受众表现良好"
              description="目标受众群体对活动响应度较高，点击率高于平台平均水平28%。"
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </div>
        )}
        
        {activeTab === 'trend' && (
          <div>
            <Title level={5}>每日活动表现</Title>
            <Table 
              dataSource={campaign.dailyData} 
              columns={[
                {
                  title: '日期',
                  dataIndex: 'date',
                  key: 'date',
                },
                {
                  title: '展示次数',
                  dataIndex: 'impressions',
                  key: 'impressions',
                  sorter: (a, b) => a.impressions - b.impressions,
                },
                {
                  title: '点击次数',
                  dataIndex: 'clicks',
                  key: 'clicks',
                  sorter: (a, b) => a.clicks - b.clicks,
                },
                {
                  title: '点击率',
                  key: 'clickRate',
                  render: (_, record) => (
                    <span>{((record.clicks / record.impressions) * 100).toFixed(2)}%</span>
                  ),
                  sorter: (a, b) => (a.clicks / a.impressions) - (b.clicks / b.impressions),
                },
                {
                  title: '预约量',
                  dataIndex: 'appointments',
                  key: 'appointments',
                  sorter: (a, b) => a.appointments - b.appointments,
                },
                {
                  title: '花费',
                  dataIndex: 'cost',
                  key: 'cost',
                  render: (cost: number) => `￥${cost.toFixed(2)}`,
                  sorter: (a, b) => a.cost - b.cost,
                },
              ]}
              rowKey="date"
              pagination={false}
              scroll={{ y: 400 }}
            />
          </div>
        )}
        
        {activeTab === 'property' && (
          <div>
            <Title level={5}>房源表现分析</Title>
            <Table 
              dataSource={campaign.properties} 
              columns={[
                {
                  title: '房源名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '展示次数',
                  dataIndex: 'impressions',
                  key: 'impressions',
                  sorter: (a, b) => a.impressions - b.impressions,
                },
                {
                  title: '点击次数',
                  dataIndex: 'clicks',
                  key: 'clicks',
                  sorter: (a, b) => a.clicks - b.clicks,
                },
                {
                  title: '点击率',
                  key: 'clickRate',
                  render: (_, record) => (
                    <span>{((record.clicks / record.impressions) * 100).toFixed(2)}%</span>
                  ),
                  sorter: (a, b) => (a.clicks / a.impressions) - (b.clicks / b.impressions),
                },
                {
                  title: '预约量',
                  dataIndex: 'appointments',
                  key: 'appointments',
                  sorter: (a, b) => a.appointments - b.appointments,
                },
              ]}
              rowKey="id"
            />
          </div>
        )}
        
        {activeTab === 'creative' && (
          <div>
            <Title level={5}>创意素材详情</Title>
            <Card>
              <Descriptions title="创意信息" bordered column={1}>
                <Descriptions.Item label="创意标题">{campaign.creatives.title}</Descriptions.Item>
                <Descriptions.Item label="创意描述">{campaign.creatives.description}</Descriptions.Item>
                <Descriptions.Item label="展示形式">
                  {campaign.creatives.format === 'image' ? '图片广告' : 
                  campaign.creatives.format === 'video' ? '视频广告' : '轮播广告'}
                </Descriptions.Item>
                <Descriptions.Item label="行动号召">{campaign.creatives.callToAction}</Descriptions.Item>
              </Descriptions>
              
              <Divider />
              
              <Alert
                message="创意表现分析"
                description="当前创意点击率高于行业平均水平15%，建议继续使用当前创意。"
                type="info"
                showIcon
              />
            </Card>
          </div>
        )}
        
        {activeTab === 'setting' && (
          <div>
            <Title level={5}>活动配置信息</Title>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="活动名称">{campaign.name}</Descriptions.Item>
              <Descriptions.Item label="活动状态">{renderStatusTag(campaign.status)}</Descriptions.Item>
              <Descriptions.Item label="活动类型">{campaign.type}</Descriptions.Item>
              <Descriptions.Item label="开始时间">{campaign.startDate}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{campaign.endDate}</Descriptions.Item>
              <Descriptions.Item label="总预算">￥{campaign.budget}</Descriptions.Item>
              <Descriptions.Item label="活动描述" span={2}>
                {campaign.description}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Space>
              <Button type="primary" onClick={handleEdit}>
                编辑设置
              </Button>
              <Button onClick={handleStatusChange}>
                {campaign.status === 'active' ? '暂停活动' : '激活活动'}
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CampaignDetail; 