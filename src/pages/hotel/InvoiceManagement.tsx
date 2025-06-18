import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
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
  message,
  Row,
  Col,
  Statistic,
  Divider,
  Tooltip,
  Badge,
  Descriptions,
  Upload,
  Progress,
  Steps
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

interface Invoice {
  id: string;
  invoiceNo: string;
  type: 'normal' | 'special' | 'electronic';
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  orderNo: string;
  customerName: string;
  customerPhone: string;
  companyName?: string;
  taxNo?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  content: string;
  applyDate: string;
  issueDate?: string;
  remark?: string;
  attachments?: string[];
}

const InvoiceManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 初始化数据
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    setLoading(true);
    setTimeout(() => {
      const mockInvoices: Invoice[] = [
        {
          id: 'inv001',
          invoiceNo: 'INV2024030001',
          type: 'electronic',
          status: 'completed',
          orderNo: 'ORD2024030001',
          customerName: '张三',
          customerPhone: '13800138000',
          companyName: '上海科技有限公司',
          taxNo: '91310000000000000X',
          amount: 500.00,
          taxAmount: 30.00,
          totalAmount: 530.00,
          content: '住宿费',
          applyDate: '2024-03-01 09:00:00',
          issueDate: '2024-03-01 14:30:00',
          remark: '商务住宿费用发票'
        },
        {
          id: 'inv002',
          invoiceNo: '',
          type: 'normal',
          status: 'processing',
          orderNo: 'ORD2024030002',
          customerName: '李四',
          customerPhone: '13900139000',
          amount: 800.00,
          taxAmount: 48.00,
          totalAmount: 848.00,
          content: '住宿费',
          applyDate: '2024-03-02 10:30:00',
          remark: '个人住宿费用发票'
        },
        {
          id: 'inv003',
          invoiceNo: '',
          type: 'special',
          status: 'pending',
          orderNo: 'ORD2024030003',
          customerName: '王五',
          customerPhone: '13700137000',
          companyName: '北京贸易有限公司',
          taxNo: '91110000000000000Y',
          amount: 1200.00,
          taxAmount: 72.00,
          totalAmount: 1272.00,
          content: '住宿费',
          applyDate: '2024-03-03 15:20:00',
          remark: '会议住宿费用发票'
        }
      ];
      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);
  };

  // 获取状态标签
  const getStatusTag = (status: Invoice['status']) => {
    const statusMap = {
      pending: { color: 'orange', text: '待处理', icon: <ClockCircleOutlined /> },
      processing: { color: 'blue', text: '处理中', icon: <ClockCircleOutlined /> },
      completed: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
      rejected: { color: 'red', text: '已拒绝', icon: <ExclamationCircleOutlined /> },
      cancelled: { color: 'default', text: '已取消', icon: <ExclamationCircleOutlined /> }
    };
    const config = statusMap[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 获取发票类型标签
  const getTypeTag = (type: Invoice['type']) => {
    const typeMap = {
      normal: { color: 'blue', text: '普通发票' },
      special: { color: 'purple', text: '专用发票' },
      electronic: { color: 'cyan', text: '电子发票' }
    };
    const config = typeMap[type];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列配置
  const columns = [
    {
      title: '发票编号',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      render: (text: string, record: Invoice) => (
        <Space>
          {text || <Text type="secondary">-</Text>}
          {record.status === 'completed' && <Badge status="success" />}
        </Space>
      )
    },
    {
      title: '发票类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: Invoice['type']) => getTypeTag(type)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Invoice['status']) => getStatusTag(status)
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string) => (
        <Button type="link" size="small">{text}</Button>
      )
    },
    {
      title: '客户信息',
      key: 'customer',
      render: (_: any, record: Invoice) => (
        <div>
          <div><Text strong>{record.customerName}</Text></div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.customerPhone}</div>
          {record.companyName && (
            <div style={{ fontSize: 12, color: '#666' }}>{record.companyName}</div>
          )}
        </div>
      )
    },
    {
      title: '发票金额',
      key: 'amount',
      render: (_: any, record: Invoice) => (
        <div>
          <div><Text strong>¥{record.totalAmount.toFixed(2)}</Text></div>
          <div style={{ fontSize: 12, color: '#666' }}>
            含税: ¥{record.taxAmount.toFixed(2)}
          </div>
        </div>
      )
    },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      key: 'applyDate',
      render: (text: string) => (
        <div>
          <div>{dayjs(text).format('YYYY-MM-DD')}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {dayjs(text).format('HH:mm:ss')}
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Invoice) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {record.status === 'completed' && (
            <Tooltip title="下载发票">
              <Button 
                type="text" 
                icon={<DownloadOutlined />} 
                size="small"
                onClick={() => handleDownload(record)}
              />
            </Tooltip>
          )}
          {record.status === 'pending' && (
            <Tooltip title="处理">
              <Button 
                type="text" 
                size="small"
                onClick={() => handleProcess(record)}
              >
                处理
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // 处理函数
  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('发票申请数据:', values);
      message.success('发票申请提交成功');
      setModalVisible(false);
      loadInvoices();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleViewDetail = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setDetailModalVisible(true);
  };

  const handleDownload = (invoice: Invoice) => {
    message.success(`正在下载发票 ${invoice.invoiceNo}`);
  };

  const handleProcess = (invoice: Invoice) => {
    Modal.confirm({
      title: '处理发票申请',
      content: `确定要处理发票申请 ${invoice.orderNo} 吗？`,
      onOk: () => {
        message.success('发票申请已进入处理状态');
        loadInvoices();
      }
    });
  };

  const handleSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      console.log('搜索条件:', values);
      message.info('搜索功能演示');
    } catch (error) {
      console.error('Search validation failed:', error);
    }
  };

  const handleReset = () => {
    searchForm.resetFields();
  };

  // 渲染统计数据
  const renderStats = () => {
    const stats = {
      total: invoices.length,
      pending: invoices.filter(i => i.status === 'pending').length,
      processing: invoices.filter(i => i.status === 'processing').length,
      completed: invoices.filter(i => i.status === 'completed').length,
      totalAmount: invoices.reduce((sum, i) => sum + i.totalAmount, 0)
    };

    return (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="发票总数"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总金额"
              value={stats.totalAmount}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>发票管理</Title>
        <Text type="secondary">管理酒店发票申请、开具和下载</Text>
      </div>

      {renderStats()}

      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline">
          <Form.Item name="keyword">
            <Input 
              placeholder="搜索发票号、订单号、客户姓名" 
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
          </Form.Item>
          <Form.Item name="type">
            <Select placeholder="发票类型" style={{ width: 120 }} allowClear>
              <Option value="normal">普通发票</Option>
              <Option value="special">专用发票</Option>
              <Option value="electronic">电子发票</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" style={{ width: 120 }} allowClear>
              <Option value="pending">待处理</Option>
              <Option value="processing">处理中</Option>
              <Option value="completed">已完成</Option>
              <Option value="rejected">已拒绝</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange">
            <RangePicker placeholder={['开始日期', '结束日期']} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 发票列表 */}
      <Card 
        title="发票列表" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建发票申请
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={invoices}
          loading={loading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      {/* 新建发票申请模态框 */}
      <Modal
        title="新建发票申请"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="发票类型"
                name="type"
                rules={[{ required: true, message: '请选择发票类型' }]}
              >
                <Select placeholder="请选择发票类型">
                  <Option value="normal">普通发票</Option>
                  <Option value="special">专用发票</Option>
                  <Option value="electronic">电子发票</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="关联订单"
                name="orderNo"
                rules={[{ required: true, message: '请输入订单号' }]}
              >
                <Input placeholder="请输入订单号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="客户姓名"
                name="customerName"
                rules={[{ required: true, message: '请输入客户姓名' }]}
              >
                <Input placeholder="请输入客户姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="customerPhone"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="公司名称"
                name="companyName"
              >
                <Input placeholder="请输入公司名称（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="税号"
                name="taxNo"
              >
                <Input placeholder="请输入税号（专票必填）" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="发票金额"
                name="amount"
                rules={[{ required: true, message: '请输入发票金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="请输入金额"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="税额"
                name="taxAmount"
                rules={[{ required: true, message: '请输入税额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="请输入税额"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="价税合计"
                name="totalAmount"
                rules={[{ required: true, message: '请输入价税合计' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="请输入价税合计"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="发票内容"
            name="content"
            rules={[{ required: true, message: '请输入发票内容' }]}
          >
            <Input placeholder="请输入发票内容，如：住宿费" />
          </Form.Item>

          <Form.Item
            label="备注"
            name="remark"
          >
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 发票详情模态框 */}
      <Modal
        title="发票详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          currentInvoice?.status === 'completed' && (
            <Button 
              key="download" 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(currentInvoice)}
            >
              下载发票
            </Button>
          )
        ]}
        width={700}
      >
        {currentInvoice && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="发票编号" span={2}>
                {currentInvoice.invoiceNo || <Text type="secondary">待生成</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="发票类型">
                {getTypeTag(currentInvoice.type)}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(currentInvoice.status)}
              </Descriptions.Item>
              <Descriptions.Item label="订单号">
                {currentInvoice.orderNo}
              </Descriptions.Item>
              <Descriptions.Item label="客户姓名">
                {currentInvoice.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {currentInvoice.customerPhone}
              </Descriptions.Item>
              <Descriptions.Item label="公司名称">
                {currentInvoice.companyName || <Text type="secondary">-</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="税号">
                {currentInvoice.taxNo || <Text type="secondary">-</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="发票金额">
                ¥{currentInvoice.amount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="税额">
                ¥{currentInvoice.taxAmount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="价税合计">
                ¥{currentInvoice.totalAmount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="发票内容">
                {currentInvoice.content}
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {currentInvoice.applyDate}
              </Descriptions.Item>
              <Descriptions.Item label="开票时间">
                {currentInvoice.issueDate || <Text type="secondary">-</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {currentInvoice.remark || <Text type="secondary">-</Text>}
              </Descriptions.Item>
            </Descriptions>

            {currentInvoice.status !== 'pending' && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}>处理进度</Title>
                <Steps
                  current={
                    currentInvoice.status === 'processing' ? 1 :
                    currentInvoice.status === 'completed' ? 2 : 0
                  }
                  status={currentInvoice.status === 'rejected' ? 'error' : 'process'}
                >
                  <Step title="申请提交" description="发票申请已提交" />
                  <Step title="审核处理" description="正在审核开票信息" />
                  <Step title="开票完成" description="发票已生成并可下载" />
                </Steps>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceManagement;
