import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  DatePicker,
  Table,
  Tag,
  Space,
  Typography,
  Modal,
  Form,
  message,
  Statistic,
  Tooltip,
  Badge,
  Divider
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  MoneyCollectOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

interface Bill {
  id: string;
  billNo: string;
  orderId: string;
  hotelName: string;
  roomType: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'failed';
  billDate: string;
  paymentDate?: string;
  paymentMethod?: string;
  remark?: string;
}

const BillManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<any>(null);

  const billStatuses = [
    { key: 'pending', label: '待确认', color: '#faad14', icon: <ClockCircleOutlined /> },
    { key: 'confirmed', label: '已确认', color: '#1890ff', icon: <CheckCircleOutlined /> },
    { key: 'processing', label: '处理中', color: '#722ed1', icon: <ClockCircleOutlined /> },
    { key: 'completed', label: '已完成', color: '#52c41a', icon: <CheckCircleOutlined /> },
    { key: 'failed', label: '失败', color: '#ff4d4f', icon: <CloseCircleOutlined /> }
  ];

  useEffect(() => {
    generateMockBills();
  }, []);

  const generateMockBills = () => {
    setLoading(true);
    
    const mockBills: Bill[] = [];
    const guestNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
    const roomTypes = ['标准大床房', '豪华双床房', '行政套房', '商务大床房'];
    const paymentMethods = ['支付宝', '微信支付', '银行卡', '现金'];
    
    for (let i = 1; i <= 100; i++) {
      const amount = Math.floor(Math.random() * 1000) + 200;
      const commission = Math.floor(amount * 0.15);
      const netAmount = amount - commission;
      const statusKeys = billStatuses.map(s => s.key);
      const randomStatus = statusKeys[Math.floor(Math.random() * statusKeys.length)] as any;
      
      const billDate = dayjs().subtract(Math.floor(Math.random() * 60), 'day');
      const checkInDate = billDate.add(Math.floor(Math.random() * 30), 'day');
      const checkOutDate = checkInDate.add(Math.floor(Math.random() * 5) + 1, 'day');
      
      mockBills.push({
        id: `bill-${i}`,
        billNo: `BILL${dayjs().format('YYYYMM')}${String(i).padStart(4, '0')}`,
        orderId: `ORDER-${1000 + i}`,
        hotelName: '瞬寻酒店（北京朝阳店）',
        roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
        guestName: guestNames[Math.floor(Math.random() * guestNames.length)],
        checkInDate: checkInDate.format('YYYY-MM-DD'),
        checkOutDate: checkOutDate.format('YYYY-MM-DD'),
        amount,
        commission,
        netAmount,
        status: randomStatus,
        billDate: billDate.format('YYYY-MM-DD'),
        paymentDate: randomStatus === 'completed' ? billDate.add(Math.floor(Math.random() * 7), 'day').format('YYYY-MM-DD') : undefined,
        paymentMethod: randomStatus === 'completed' ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
        remark: Math.random() > 0.8 ? '特殊要求处理' : undefined
      });
    }
    
    setBills(mockBills);
    setLoading(false);
  };

  const getFilteredBills = () => {
    let filtered = bills;
    
    // 按状态筛选
    if (statusFilter) {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }
    
    // 按关键词筛选
    if (searchKeyword) {
      filtered = filtered.filter(bill => 
        bill.billNo.includes(searchKeyword) ||
        bill.orderId.includes(searchKeyword) ||
        bill.guestName.includes(searchKeyword)
      );
    }
    
    // 按日期范围筛选
    if (dateRange) {
      filtered = filtered.filter(bill => {
        const billDate = dayjs(bill.billDate);
        return billDate.isAfter(dateRange[0].subtract(1, 'day')) && 
               billDate.isBefore(dateRange[1].add(1, 'day'));
      });
    }
    
    return filtered;
  };

  const getStatistics = () => {
    const filteredBills = getFilteredBills();
    
    return {
      totalBills: filteredBills.length,
      totalAmount: filteredBills.reduce((sum, bill) => sum + bill.amount, 0),
      totalCommission: filteredBills.reduce((sum, bill) => sum + bill.commission, 0),
      totalNetAmount: filteredBills.reduce((sum, bill) => sum + bill.netAmount, 0),
      pendingBills: filteredBills.filter(bill => bill.status === 'pending').length,
      completedBills: filteredBills.filter(bill => bill.status === 'completed').length
    };
  };

  const getStatusConfig = (status: string) => {
    return billStatuses.find(s => s.key === status) || billStatuses[0];
  };

  const handleViewDetail = (bill: Bill) => {
    setSelectedBill(bill);
    setDetailModalVisible(true);
  };

  const handleExport = () => {
    message.success('账单导出功能开发中...');
  };

  const columns = [
    {
      title: '账单编号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 140,
      render: (text: string) => (
        <Text copyable style={{ fontSize: 12, fontFamily: 'monospace' }}>
          {text}
        </Text>
      )
    },
    {
      title: '订单信息',
      key: 'orderInfo',
      width: 200,
      render: (record: Bill) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>
            订单：{record.orderId}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            客人：{record.guestName}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            房型：{record.roomType}
          </div>
        </div>
      )
    },
    {
      title: '入住信息',
      key: 'stayInfo',
      width: 140,
      render: (record: Bill) => (
        <div style={{ fontSize: 12 }}>
          <div>入住：{record.checkInDate}</div>
          <div>离店：{record.checkOutDate}</div>
          <div style={{ color: '#666' }}>
            {dayjs(record.checkOutDate).diff(dayjs(record.checkInDate), 'day')} 晚
          </div>
        </div>
      )
    },
    {
      title: '金额信息',
      key: 'amountInfo',
      width: 120,
      render: (record: Bill) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#ff4d4f' }}>
            ¥{record.amount.toLocaleString()}
          </div>
          <div style={{ color: '#666' }}>
            佣金：¥{record.commission.toLocaleString()}
          </div>
          <div style={{ color: '#52c41a', fontWeight: 600 }}>
            净额：¥{record.netAmount.toLocaleString()}
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      }
    },
    {
      title: '账单日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 100,
      render: (date: string) => (
        <div style={{ fontSize: 12 }}>
          {dayjs(date).format('MM-DD')}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (record: Bill) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="下载账单">
            <Button 
              type="text" 
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => message.info('下载功能开发中...')}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const statistics = getStatistics();
  const filteredBills = getFilteredBills();

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>账单管理</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出账单
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="账单总数"
              value={statistics.totalBills}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总金额"
              value={statistics.totalAmount}
              prefix="¥"
              precision={0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总佣金"
              value={statistics.totalCommission}
              prefix="¥"
              precision={0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="净收入"
              value={statistics.totalNetAmount}
              prefix="¥"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} lg={6}>
            <Input
              placeholder="搜索账单编号、订单号或客人姓名"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="账单状态"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              {billStatuses.map(status => (
                <Option key={status.key} value={status.key}>
                  <Space>
                    {status.icon}
                    {status.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
          <Col>
            <Space>
              <Badge count={filteredBills.length} offset={[10, 0]}>
                <Button icon={<FilterOutlined />}>
                  筛选结果
                </Button>
              </Badge>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 账单表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredBills}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredBills.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>

      {/* 账单详情弹窗 */}
      <Modal
        title="账单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            下载账单
          </Button>
        ]}
        width={700}
      >
        {selectedBill && (
          <div>
            {/* 基本信息 */}
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>账单编号：</Text>
                  <Text copyable>{selectedBill.billNo}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>订单编号：</Text>
                  <Text copyable>{selectedBill.orderId}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>酒店名称：</Text>
                  <Text>{selectedBill.hotelName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>房型：</Text>
                  <Text>{selectedBill.roomType}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>客人姓名：</Text>
                  <Text>{selectedBill.guestName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>账单状态：</Text>
                  <Tag color={getStatusConfig(selectedBill.status).color}>
                    {getStatusConfig(selectedBill.status).label}
                  </Tag>
                </Col>
              </Row>
            </Card>

            {/* 入住信息 */}
            <Card title="入住信息" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text strong>入住日期：</Text>
                  <div>{selectedBill.checkInDate}</div>
                </Col>
                <Col span={8}>
                  <Text strong>离店日期：</Text>
                  <div>{selectedBill.checkOutDate}</div>
                </Col>
                <Col span={8}>
                  <Text strong>住宿天数：</Text>
                  <div>{dayjs(selectedBill.checkOutDate).diff(dayjs(selectedBill.checkInDate), 'day')} 晚</div>
                </Col>
              </Row>
            </Card>

            {/* 费用明细 */}
            <Card title="费用明细" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>房费总额：</Text>
                    <Text style={{ fontSize: 16, fontWeight: 600, color: '#ff4d4f' }}>
                      ¥{selectedBill.amount.toLocaleString()}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>平台佣金：</Text>
                    <Text style={{ color: '#faad14' }}>
                      -¥{selectedBill.commission.toLocaleString()}
                    </Text>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>净收入：</Text>
                    <Text style={{ fontSize: 18, fontWeight: 600, color: '#52c41a' }}>
                      ¥{selectedBill.netAmount.toLocaleString()}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 支付信息 */}
            {selectedBill.paymentDate && (
              <Card title="支付信息" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>支付日期：</Text>
                    <div>{selectedBill.paymentDate}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>支付方式：</Text>
                    <div>{selectedBill.paymentMethod}</div>
                  </Col>
                </Row>
              </Card>
            )}

            {/* 备注信息 */}
            {selectedBill.remark && (
              <Card title="备注信息" size="small">
                <Text>{selectedBill.remark}</Text>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BillManagement;
