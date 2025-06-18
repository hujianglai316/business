import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Descriptions,
  Table,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Divider,
  Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface OrderItem {
  id: string;
  orderNo: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  orderAmount: number;
  commission: number;
  commissionRate: number;
  netIncome: number;
}

interface BillDetail {
  id: string;
  billNo: string;
  period: {
    start: string;
    end: string;
  };
  hotelName: string;
  account: string;
  status: 'pending' | 'confirmed' | 'paid';
  totalAmount: number;
  commission: number;
  serviceFee: number;
  netAmount: number;
  orderCount: number;
  createTime: string;
}

const BillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [billDetail, setBillDetail] = useState<BillDetail | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchForm] = Form.useForm();

  useEffect(() => {
    loadBillDetail();
    loadOrders();
  }, [id]);

  const loadBillDetail = () => {
    setLoading(true);
    setTimeout(() => {
      const mockBill: BillDetail = {
        id: id || 'bill001',
        billNo: 'BILL202404190001',
        period: {
          start: '2024-04-01',
          end: '2024-04-15'
        },
        hotelName: '瞬寻酒店（北京朝阳店）',
        account: '招商银行 **** 8888',
        status: 'pending',
        totalAmount: 12800.00,
        commission: 768.00,
        serviceFee: 100.00,
        netAmount: 11932.00,
        orderCount: 25,
        createTime: '2024-04-16 10:30:00'
      };
      setBillDetail(mockBill);
      setLoading(false);
    }, 1000);
  };

  const loadOrders = () => {
    const mockOrders: OrderItem[] = [
      {
        id: '1',
        orderNo: 'ORDER202404190001',
        roomType: '高级大床房',
        checkInDate: '2024-04-01',
        checkOutDate: '2024-04-03',
        nights: 2,
        orderAmount: 799.00,
        commission: 47.94,
        commissionRate: 6,
        netIncome: 751.06
      },
      {
        id: '2',
        orderNo: 'ORDER202404190002',
        roomType: '豪华套房',
        checkInDate: '2024-04-02',
        checkOutDate: '2024-04-04',
        nights: 2,
        orderAmount: 1299.00,
        commission: 77.94,
        commissionRate: 6,
        netIncome: 1221.06
      },
      {
        id: '3',
        orderNo: 'ORDER202404190003',
        roomType: '标准双床房',
        checkInDate: '2024-04-03',
        checkOutDate: '2024-04-05',
        nights: 2,
        orderAmount: 599.00,
        commission: 35.94,
        commissionRate: 6,
        netIncome: 563.06
      },
      {
        id: '4',
        orderNo: 'ORDER202404190004',
        roomType: '商务套房',
        checkInDate: '2024-04-04',
        checkOutDate: '2024-04-07',
        nights: 3,
        orderAmount: 1899.00,
        commission: 113.94,
        commissionRate: 6,
        netIncome: 1785.06
      }
    ];
    setOrders(mockOrders);
  };

  const getStatusTag = (status: BillDetail['status']) => {
    const statusMap = {
      pending: { color: 'orange', text: '已出账待确认', icon: <ClockCircleOutlined /> },
      confirmed: { color: 'blue', text: '已确认待支付', icon: <ClockCircleOutlined /> },
      paid: { color: 'green', text: '已支付', icon: <CheckCircleOutlined /> }
    };
    const config = statusMap[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const handleSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      console.log('搜索条件:', values);
      // 这里实现搜索逻辑
    } catch (error) {
      console.error('Search validation failed:', error);
    }
  };

  const handleReset = () => {
    searchForm.resetFields();
  };

  const handleDownload = () => {
    // 实现下载账单功能
    console.log('下载账单');
  };

  const handlePrint = () => {
    // 实现打印账单功能
    window.print();
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string) => (
        <Button type="link" size="small">{text}</Button>
      )
    },
    {
      title: '房型',
      dataIndex: 'roomType',
      key: 'roomType'
    },
    {
      title: '入住时间',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '离店时间',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '间夜',
      dataIndex: 'nights',
      key: 'nights',
      render: (nights: number) => `${nights}晚`
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`
    },
    {
      title: '平台佣金',
      key: 'commission',
      render: (_: any, record: OrderItem) => (
        <div>
          <div style={{ color: '#ff4d4f' }}>¥{record.commission.toFixed(2)}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.commissionRate}%</div>
        </div>
      )
    },
    {
      title: '商家净收入',
      dataIndex: 'netIncome',
      key: 'netIncome',
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>¥{amount.toFixed(2)}</Text>
      )
    }
  ];

  if (!billDetail) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
          <Title level={3} style={{ margin: 0 }}>账单详情</Title>
          <div style={{ marginLeft: 16 }}>
            {getStatusTag(billDetail.status)}
          </div>
        </Space>
      </div>

      {/* 账单概览 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={18}>
            <Descriptions column={3} bordered>
              <Descriptions.Item label="账单号" span={1}>
                {billDetail.billNo}
              </Descriptions.Item>
              <Descriptions.Item label="账单周期" span={1}>
                {billDetail.period.start} 至 {billDetail.period.end}
              </Descriptions.Item>
              <Descriptions.Item label="订单数量" span={1}>
                {billDetail.orderCount}笔
              </Descriptions.Item>
              <Descriptions.Item label="酒店名称" span={1}>
                {billDetail.hotelName}
              </Descriptions.Item>
              <Descriptions.Item label="结算账户" span={1}>
                {billDetail.account}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={1}>
                {billDetail.createTime}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={handleDownload}
                block
              >
                下载账单
              </Button>
              <Button 
                icon={<PrinterOutlined />} 
                onClick={handlePrint}
                block
              >
                打印账单
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider />

        {/* 金额计算 */}
        <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 6 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="订单总额"
                value={billDetail.totalAmount}
                prefix="¥"
                precision={2}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="平台佣金"
                value={billDetail.commission}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="平台服务费"
                value={billDetail.serviceFee}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="应结金额"
                value={billDetail.netAmount}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#52c41a', fontSize: 20, fontWeight: 'bold' }}
              />
            </Col>
          </Row>
        </div>

        {billDetail.status === 'pending' && (
          <Alert
            style={{ marginTop: 16 }}
            message="账单待确认"
            description="请核对账单明细，确认无误后联系平台客服进行结算。"
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary">
                确认账单
              </Button>
            }
          />
        )}
      </Card>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline">
          <Form.Item name="orderNo">
            <Input 
              placeholder="请输入订单号" 
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item name="dateRange">
            <RangePicker placeholder={['入住开始日期', '入住结束日期']} />
          </Form.Item>
          <Form.Item name="roomType">
            <Select placeholder="房型" style={{ width: 150 }} allowClear>
              <Option value="">全部房型</Option>
              <Option value="高级大床房">高级大床房</Option>
              <Option value="豪华套房">豪华套房</Option>
              <Option value="标准双床房">标准双床房</Option>
              <Option value="商务套房">商务套房</Option>
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
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 订单明细列表 */}
      <Card title="订单明细">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          summary={(data) => {
            const totalAmount = data.reduce((sum, item) => sum + item.orderAmount, 0);
            const totalCommission = data.reduce((sum, item) => sum + item.commission, 0);
            const totalNetIncome = data.reduce((sum, item) => sum + item.netIncome, 0);

            return (
              <Table.Summary.Row style={{ background: '#fafafa' }}>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <Text strong>合计</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>¥{totalAmount.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text strong style={{ color: '#ff4d4f' }}>¥{totalCommission.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text strong style={{ color: '#52c41a' }}>¥{totalNetIncome.toFixed(2)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default BillDetail;
