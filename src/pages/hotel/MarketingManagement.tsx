import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Tabs,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Radio,
  message,
  Row,
  Col,
  Statistic,
  Badge,
  Divider,
  Tooltip,
  Progress,
  Alert
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  GiftOutlined,
  UserOutlined,
  FlagOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const MarketingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [loading, setLoading] = useState(false);
  
  // 营销活动数据
  const [campaigns, setCampaigns] = useState([
    {
      id: 'camp001',
      name: '春季住宿优惠活动',
      type: '折扣优惠',
      status: '进行中',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      budget: 50000,
      spent: 32500,
      targetAudience: '新用户',
      reach: 12000,
      conversions: 450,
      revenue: 150000,
      description: '针对新用户的春季住宿优惠活动，提供7折优惠'
    },
    {
      id: 'camp002',
      name: '积分双倍活动',
      type: '积分活动',
      status: '进行中',
      startDate: '2024-03-10',
      endDate: '2024-03-20',
      budget: 30000,
      spent: 18000,
      targetAudience: '会员用户',
      reach: 8500,
      conversions: 320,
      revenue: 95000,
      description: '会员入住获得双倍积分'
    }
  ]);

  // 优惠券数据
  const [coupons, setCoupons] = useState([
    {
      id: 'coupon001',
      name: '新用户专享7折券',
      type: '30%折扣',
      minAmount: 200,
      maxDiscount: 100,
      totalCount: 1000,
      usedCount: 456,
      validFrom: '2024-03-01',
      validTo: '2024-03-31',
      status: '有效',
      description: '新用户首次入住专享优惠'
    },
    {
      id: 'coupon002',
      name: '满500减100券',
      type: '¥100减免',
      minAmount: 500,
      totalCount: 500,
      usedCount: 234,
      validFrom: '2024-03-01',
      validTo: '2024-03-31',
      status: '有效',
      description: '满500元立减100元'
    }
  ]);

  const [campaignModalVisible, setCampaignModalVisible] = useState(false);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [campaignForm] = Form.useForm();
  const [couponForm] = Form.useForm();

  // 营销活动列配置
  const campaignColumns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.status === '进行中' && <Badge status="processing" />}
        </Space>
      )
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: { [key: string]: string } = {
          '折扣优惠': 'orange',
          '积分活动': 'blue',
          '会员专享': 'purple',
          '套餐活动': 'green',
          '推荐活动': 'cyan'
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          '草稿': 'default',
          '进行中': 'success',
          '已暂停': 'warning',
          '已完成': 'default',
          '已过期': 'error'
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      }
    },
    {
      title: '活动时间',
      key: 'period',
      render: (_: any, record: any) => (
        <div>
          <div>{record.startDate}</div>
          <div style={{ color: '#666' }}>至 {record.endDate}</div>
        </div>
      )
    },
    {
      title: '预算/支出',
      key: 'budget',
      render: (_: any, record: any) => (
        <div>
          <Text>¥{record.spent.toLocaleString()}</Text>
          <Text type="secondary"> / ¥{record.budget.toLocaleString()}</Text>
          <Progress 
            percent={Math.round((record.spent / record.budget) * 100)} 
            size="small" 
            showInfo={false}
            style={{ marginTop: 4 }}
          />
        </div>
      )
    },
    {
      title: '效果数据',
      key: 'performance',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>触达: {record.reach.toLocaleString()}</Text>
          <Text style={{ fontSize: 12 }}>转化: {record.conversions}</Text>
          <Text style={{ fontSize: 12 }}>收入: ¥{record.revenue.toLocaleString()}</Text>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 优惠券列配置
  const couponColumns = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.status === '有效' && <Badge status="success" />}
        </Space>
      )
    },
    {
      title: '优惠类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: '使用条件',
      key: 'condition',
      render: (_: any, record: any) => (
        <div>
          <Text style={{ fontSize: 12 }}>满¥{record.minAmount}</Text>
          {record.maxDiscount && (
            <div style={{ fontSize: 12, color: '#666' }}>
              最高减¥{record.maxDiscount}
            </div>
          )}
        </div>
      )
    },
    {
      title: '发放/使用',
      key: 'usage',
      render: (_: any, record: any) => (
        <div>
          <Text>{record.usedCount} / {record.totalCount}</Text>
          <Progress 
            percent={Math.round((record.usedCount / record.totalCount) * 100)} 
            size="small" 
            showInfo={false}
            style={{ marginTop: 4 }}
          />
        </div>
      )
    },
    {
      title: '有效期',
      key: 'validity',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontSize: 12 }}>{record.validFrom}</div>
          <div style={{ fontSize: 12, color: '#666' }}>至 {record.validTo}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          '有效': 'success',
          '无效': 'default',
          '已过期': 'error'
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleAddCampaign = () => {
    campaignForm.resetFields();
    setCampaignModalVisible(true);
  };

  const handleAddCoupon = () => {
    couponForm.resetFields();
    setCouponModalVisible(true);
  };

  const handleCampaignSubmit = async () => {
    try {
      const values = await campaignForm.validateFields();
      message.success('营销活动创建成功');
      setCampaignModalVisible(false);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCouponSubmit = async () => {
    try {
      const values = await couponForm.validateFields();
      message.success('优惠券创建成功');
      setCouponModalVisible(false);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 渲染概览数据
  const renderOverview = () => (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="进行中活动"
            value={campaigns.filter(c => c.status === '进行中').length}
            prefix={<FlagOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="有效优惠券"
            value={coupons.filter(c => c.status === '有效').length}
            prefix={<GiftOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="总触达用户"
            value={campaigns.reduce((sum, c) => sum + c.reach, 0)}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="营销收入"
            value={campaigns.reduce((sum, c) => sum + c.revenue, 0)}
            prefix="¥"
            precision={0}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>营销管理</Title>
        <Text type="secondary">管理酒店营销活动、优惠券和会员营销</Text>
      </div>

      {renderOverview()}

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            activeTab === 'campaigns' ? (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCampaign}>
                新建活动
              </Button>
            ) : activeTab === 'coupons' ? (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCoupon}>
                新建优惠券
              </Button>
            ) : (
              <Button type="primary" icon={<PlusOutlined />}>
                新建营销
              </Button>
            )
          }
        >
          <TabPane tab={<span><FlagOutlined />营销活动</span>} key="campaigns">
            <Table
              columns={campaignColumns}
              dataSource={campaigns}
              loading={loading}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
            />
          </TabPane>

          <TabPane tab={<span><GiftOutlined />优惠券管理</span>} key="coupons">
            <Table
              columns={couponColumns}
              dataSource={coupons}
              loading={loading}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
            />
          </TabPane>

          <TabPane tab={<span><TeamOutlined />会员营销</span>} key="members">
            <Alert
              message="会员营销功能"
              description="针对不同等级会员进行精准营销推送，提升会员粘性和转化率。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Row gutter={16}>
              <Col span={8}>
                <Card title="生日营销" hoverable>
                  <Text>自动向生日月会员发送专属优惠</Text>
                  <Divider />
                  <Space>
                    <Button type="primary" size="small">配置规则</Button>
                    <Button size="small">查看效果</Button>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="升级通知" hoverable>
                  <Text>会员等级提升时自动发送通知</Text>
                  <Divider />
                  <Space>
                    <Button type="primary" size="small">配置规则</Button>
                    <Button size="small">查看效果</Button>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="流失挽回" hoverable>
                  <Text>识别流失会员并发送挽回优惠</Text>
                  <Divider />
                  <Space>
                    <Button type="primary" size="small">配置规则</Button>
                    <Button size="small">查看效果</Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 营销活动创建模态框 */}
      <Modal
        title="新建营销活动"
        open={campaignModalVisible}
        onCancel={() => setCampaignModalVisible(false)}
        onOk={handleCampaignSubmit}
        width={800}
        destroyOnClose
      >
        <Form form={campaignForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="活动名称"
                name="name"
                rules={[{ required: true, message: '请输入活动名称' }]}
              >
                <Input placeholder="请输入活动名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="活动类型"
                name="type"
                rules={[{ required: true, message: '请选择活动类型' }]}
              >
                <Select placeholder="请选择活动类型">
                  <Option value="discount">折扣优惠</Option>
                  <Option value="points">积分活动</Option>
                  <Option value="member">会员专享</Option>
                  <Option value="package">套餐活动</Option>
                  <Option value="referral">推荐活动</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="活动时间"
                name="dateRange"
                rules={[{ required: true, message: '请选择活动时间' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="活动预算"
                name="budget"
                rules={[{ required: true, message: '请输入活动预算' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入活动预算"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="活动描述"
            name="description"
            rules={[{ required: true, message: '请输入活动描述' }]}
          >
            <TextArea rows={4} placeholder="请输入活动描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 优惠券创建模态框 */}
      <Modal
        title="新建优惠券"
        open={couponModalVisible}
        onCancel={() => setCouponModalVisible(false)}
        onOk={handleCouponSubmit}
        width={800}
        destroyOnClose
      >
        <Form form={couponForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="优惠券名称"
                name="name"
                rules={[{ required: true, message: '请输入优惠券名称' }]}
              >
                <Input placeholder="请输入优惠券名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="优惠类型"
                name="type"
                rules={[{ required: true, message: '请选择优惠类型' }]}
              >
                <Select placeholder="请选择优惠类型">
                  <Option value="percentage">百分比折扣</Option>
                  <Option value="amount">固定金额减免</Option>
                  <Option value="nights">免费住宿</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="优惠力度"
                name="value"
                rules={[{ required: true, message: '请输入优惠力度' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="优惠数值"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="最低消费"
                name="minAmount"
                rules={[{ required: true, message: '请输入最低消费金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="最低消费金额"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="发放数量"
                name="totalCount"
                rules={[{ required: true, message: '请输入发放数量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="发放数量"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="有效期"
            name="validRange"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="优惠券描述"
            name="description"
            rules={[{ required: true, message: '请输入优惠券描述' }]}
          >
            <TextArea rows={3} placeholder="请输入优惠券描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MarketingManagement; 