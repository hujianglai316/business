import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Space,
  Tag,
  Badge,
  Drawer,
  Descriptions,
  Timeline,
  Modal,
  message,
  Pagination,
  Switch,
  Tooltip,
  Divider
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
  DollarOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Order {
  id: string;
  orderNumber: string;
  roomType: string;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'partially_paid' | 'refunded';
  customerName: string;
  customerPhone: string;
  orderSource: 'app' | 'website' | 'ota' | 'walk_in' | 'phone';
  orderDate: string;
  isHourlyRoom?: boolean;
  specialRequests?: string;
  roomNumber?: string;
}

interface OrderDetail extends Order {
  customerInfo: {
    name: string;
    phone: string;
    idCard: string;
    email?: string;
  };
  roomInfo: {
    roomNumber: string;
    floor: number;
    bedType: string;
    area: number;
  };
  priceBredown: {
    basePrice: number;
    serviceFee: number;
    tax: number;
    discount: number;
    total: number;
  };
  timeline: Array<{
    time: string;
    title: string;
    description: string;
    type: 'success' | 'processing' | 'error' | 'default';
  }>;
}

const OrderManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD202403150001',
      roomType: 'deluxe_king',
      roomTypeName: '豪华大床房',
      checkInDate: '2024-03-15',
      checkOutDate: '2024-03-17',
      nights: 2,
      totalPrice: 1200,
      status: 'pending',
      paymentStatus: 'unpaid',
      customerName: '孙悟空',
      customerPhone: '18000000000',
      orderSource: 'app',
      orderDate: '2024-03-14',
      isHourlyRoom: true,
      specialRequests: '需要安静的房间'
    },
    {
      id: '2',
      orderNumber: 'ORD202403140002',
      roomType: 'superior_twin',
      roomTypeName: '高级双床房',
      checkInDate: '2024-03-20',
      checkOutDate: '2024-03-22',
      nights: 2,
      totalPrice: 980,
      status: 'confirmed',
      paymentStatus: 'paid',
      customerName: '猪八戒',
      customerPhone: '18000000001',
      orderSource: 'website',
      orderDate: '2024-03-13'
    },
    {
      id: '3',
      orderNumber: 'ORD202403130003',
      roomType: 'luxury_suite',
      roomTypeName: '豪华套房',
      checkInDate: '2024-03-13',
      checkOutDate: '2024-03-15',
      nights: 2,
      totalPrice: 2500,
      status: 'checked_in',
      paymentStatus: 'paid',
      customerName: '沙和尚',
      customerPhone: '18000000002',
      orderSource: 'ota',
      orderDate: '2024-03-12',
      roomNumber: '1208'
    },
    {
      id: '4',
      orderNumber: 'ORD202403120004',
      roomType: 'standard_single',
      roomTypeName: '标准单人间',
      checkInDate: '2024-03-12',
      checkOutDate: '2024-03-13',
      nights: 1,
      totalPrice: 580,
      status: 'checked_out',
      paymentStatus: 'paid',
      customerName: '唐僧',
      customerPhone: '18000000003',
      orderSource: 'phone',
      orderDate: '2024-03-11'
    },
    {
      id: '5',
      orderNumber: 'ORD202403110005',
      roomType: 'deluxe_king',
      roomTypeName: '豪华大床房',
      checkInDate: '2024-03-11',
      checkOutDate: '2024-03-12',
      nights: 1,
      totalPrice: 1200,
      status: 'cancelled',
      paymentStatus: 'refunded',
      customerName: '白龙马',
      customerPhone: '18000000004',
      orderSource: 'app',
      orderDate: '2024-03-10'
    }
  ]);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const statusOptions = [
    { key: 'all', label: '全部订单', count: orders.length },
    { key: 'pending', label: '待确认', count: orders.filter(o => o.status === 'pending').length },
    { key: 'confirmed', label: '已预订', count: orders.filter(o => o.status === 'confirmed').length },
    { key: 'checked_in', label: '已入住', count: orders.filter(o => o.status === 'checked_in').length },
    { key: 'checked_out', label: '已退房', count: orders.filter(o => o.status === 'checked_out').length },
    { key: 'cancelled', label: '已取消', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  useEffect(() => {
    filterOrders();
  }, [activeStatus, showTodayOnly, sortOrder, orders]);

  const filterOrders = () => {
    let filtered = orders;

    // 按状态筛选
    if (activeStatus !== 'all') {
      filtered = filtered.filter(order => order.status === activeStatus);
    }

    // 今日订单筛选
    if (showTodayOnly) {
      const today = dayjs().format('YYYY-MM-DD');
      filtered = filtered.filter(order => order.orderDate === today);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return dayjs(b.orderDate).valueOf() - dayjs(a.orderDate).valueOf();
        case 'oldest':
          return dayjs(a.orderDate).valueOf() - dayjs(b.orderDate).valueOf();
        case 'highest':
          return b.totalPrice - a.totalPrice;
        case 'lowest':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (values: any) => {
    setLoading(true);
    
    setTimeout(() => {
      let filtered = orders;
      
      if (values.orderNumber) {
        filtered = filtered.filter(order => 
          order.orderNumber.toLowerCase().includes(values.orderNumber.toLowerCase())
        );
      }
      
      if (values.customerInfo) {
        filtered = filtered.filter(order => 
          order.customerName.includes(values.customerInfo) || 
          order.customerPhone.includes(values.customerInfo)
        );
      }
      
      if (values.roomType) {
        filtered = filtered.filter(order => order.roomType === values.roomType);
      }
      
      if (values.paymentStatus) {
        filtered = filtered.filter(order => order.paymentStatus === values.paymentStatus);
      }
      
      if (values.orderSource) {
        filtered = filtered.filter(order => order.orderSource === values.orderSource);
      }
      
      if (values.dateRange && values.dateRange.length === 2) {
        const [start, end] = values.dateRange;
        filtered = filtered.filter(order => {
          const orderDate = dayjs(order.orderDate);
          return orderDate.isAfter(start.subtract(1, 'day')) && orderDate.isBefore(end.add(1, 'day'));
        });
      }
      
      setFilteredOrders(filtered);
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    setFilteredOrders(orders);
    setCurrentPage(1);
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待确认' },
      confirmed: { color: 'blue', text: '已预订' },
      checked_in: { color: 'green', text: '已入住' },
      checked_out: { color: 'default', text: '已退房' },
      cancelled: { color: 'red', text: '已取消' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      unpaid: { status: 'error', text: '未支付' },
      paid: { status: 'success', text: '已支付' },
      partially_paid: { status: 'warning', text: '部分支付' },
      refunded: { status: 'default', text: '已退款' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge status={config.status as any} text={config.text} />;
  };

  const getOrderSourceText = (source: string) => {
    const sourceMap = {
      app: 'APP预订',
      website: '官网预订',
      ota: 'OTA平台',
      walk_in: '到店预订',
      phone: '电话预订'
    };
    return sourceMap[source as keyof typeof sourceMap] || source;
  };

  const handleViewOrder = (order: Order) => {
    // 模拟获取订单详情
    const orderDetail: OrderDetail = {
      ...order,
      customerInfo: {
        name: order.customerName,
        phone: order.customerPhone,
        idCard: '110101199001011234',
        email: 'customer@example.com'
      },
      roomInfo: {
        roomNumber: order.roomNumber || '1208',
        floor: 12,
        bedType: '1.8m大床',
        area: 28
      },
      priceBredown: {
        basePrice: order.totalPrice * 0.85,
        serviceFee: order.totalPrice * 0.1,
        tax: order.totalPrice * 0.05,
        discount: 0,
        total: order.totalPrice
      },
      timeline: [
        {
          time: order.orderDate + ' 14:30',
          title: '订单创建',
          description: '客户通过' + getOrderSourceText(order.orderSource) + '创建订单',
          type: 'success'
        },
        {
          time: order.orderDate + ' 14:35',
          title: '等待支付',
          description: '订单等待客户支付',
          type: order.paymentStatus === 'paid' ? 'success' : 'processing'
        }
      ]
    };

    if (order.paymentStatus === 'paid') {
      orderDetail.timeline.push({
        time: order.orderDate + ' 15:00',
        title: '支付完成',
        description: '客户完成支付，订单确认',
        type: 'success'
      });
    }

    if (order.status === 'checked_in') {
      orderDetail.timeline.push({
        time: order.checkInDate + ' 14:00',
        title: '办理入住',
        description: '客户已办理入住手续',
        type: 'success'
      });
    }

    setSelectedOrder(orderDetail);
    setDrawerVisible(true);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
    message.success('订单状态更新成功');
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: 24 }}>
      {/* 订单状态切换 */}
      <Card style={{ marginBottom: 16 }}>
        <Radio.Group 
          value={activeStatus} 
          onChange={(e) => setActiveStatus(e.target.value)}
          style={{ width: '100%' }}
        >
          <Row gutter={[16, 16]}>
            {statusOptions.map(option => (
              <Col key={option.key}>
                <Radio.Button value={option.key} style={{ minWidth: 120, textAlign: 'center' }}>
                  {option.label}
                  <Badge 
                    count={option.count} 
                    style={{ marginLeft: 8, backgroundColor: '#f0f0f0', color: '#666' }}
                  />
                </Radio.Button>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Card>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={[16, 16]}>
            <Col md={6}>
              <Form.Item label="订单号" name="orderNumber">
                <Input placeholder="请输入订单号" />
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="客户信息" name="customerInfo">
                <Input placeholder="姓名/手机号" />
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item label="房型" name="roomType">
                <Select placeholder="请选择房型" allowClear>
                  <Option value="deluxe_king">豪华大床房</Option>
                  <Option value="superior_twin">高级双床房</Option>
                  <Option value="luxury_suite">豪华套房</Option>
                  <Option value="standard_single">标准单人间</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item label="支付状态" name="paymentStatus">
                <Select placeholder="支付状态" allowClear>
                  <Option value="unpaid">未支付</Option>
                  <Option value="paid">已支付</Option>
                  <Option value="partially_paid">部分支付</Option>
                  <Option value="refunded">已退款</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                    搜索
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          {/* 高级筛选 */}
          <div style={{ marginTop: 16 }}>
            <Button 
              type="link" 
              icon={<FilterOutlined />}
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            >
              {showAdvancedFilter ? '收起' : '展开'}高级筛选
            </Button>
          </div>

          {showAdvancedFilter && (
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col md={6}>
                <Form.Item label="订单来源" name="orderSource">
                  <Select placeholder="请选择来源" allowClear>
                    <Option value="app">APP预订</Option>
                    <Option value="website">官网预订</Option>
                    <Option value="ota">OTA平台</Option>
                    <Option value="walk_in">到店预订</Option>
                    <Option value="phone">电话预订</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="下单日期" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      {/* 订单列表 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="订单列表"
            extra={
              <Space>
                <span>排序：</span>
                <Select 
                  value={sortOrder} 
                  onChange={setSortOrder}
                  style={{ width: 120 }}
                  size="small"
                >
                  <Option value="newest">最新订单</Option>
                  <Option value="oldest">最早订单</Option>
                  <Option value="highest">价格从高到低</Option>
                  <Option value="lowest">价格从低到高</Option>
                </Select>
                <Switch 
                  checked={showTodayOnly}
                  onChange={setShowTodayOnly}
                  checkedChildren="今日订单"
                  unCheckedChildren="全部订单"
                />
              </Space>
            }
          >
            <div style={{ minHeight: 400 }}>
              {paginatedOrders.map(order => (
                <Card 
                  key={order.id}
                  size="small"
                  style={{ marginBottom: 16, cursor: 'pointer' }}
                  onClick={() => handleViewOrder(order)}
                  hoverable
                >
                  <Row>
                    <Col span={24}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Space>
                          <span style={{ fontWeight: 600, fontSize: 16 }}>{order.orderNumber}</span>
                          <span style={{ color: '#666' }}>{order.roomTypeName}</span>
                          {order.isHourlyRoom && (
                            <Tag icon={<ClockCircleOutlined />} color="blue">钟点房</Tag>
                          )}
                        </Space>
                        <Space>
                          {getStatusTag(order.status)}
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </Space>
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={[16, 8]}>
                    <Col md={6}>
                      <Space direction="vertical" size={4}>
                        <div>
                          <span style={{ color: '#666' }}>房型：</span>
                          <span>{order.roomTypeName}</span>
                        </div>
                        <div>
                          <span style={{ color: '#666' }}>房间号：</span>
                          <span>{order.roomNumber || '待分配'}</span>
                        </div>
                      </Space>
                    </Col>
                    <Col md={8}>
                      <Space direction="vertical" size={4}>
                        <div>
                          <CalendarOutlined style={{ marginRight: 4, color: '#666' }} />
                          <span>{order.checkInDate} 至 {order.checkOutDate}</span>
                        </div>
                        <div>
                          <span style={{ color: '#666' }}>间夜数：</span>
                          <span>{order.nights}晚</span>
                        </div>
                      </Space>
                    </Col>
                    <Col md={6}>
                      <Space direction="vertical" size={4}>
                        <div>
                          <UserOutlined style={{ marginRight: 4, color: '#666' }} />
                          <span>{order.customerName}</span>
                        </div>
                        <div>
                          <PhoneOutlined style={{ marginRight: 4, color: '#666' }} />
                          <span>{order.customerPhone}</span>
                        </div>
                      </Space>
                    </Col>
                    <Col md={4} style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#f5222d' }}>
                        ¥{order.totalPrice.toFixed(2)}
                      </div>
                      <div style={{ color: '#666', fontSize: 12 }}>
                        {getOrderSourceText(order.orderSource)}
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>

            {/* 分页 */}
            {filteredOrders.length > pageSize && (
              <Row justify="center" style={{ marginTop: 24 }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredOrders.length}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
                />
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      {/* 订单详情抽屉 */}
      <Drawer
        title="订单详情"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={
          <Space>
            <Button type="primary" icon={<EditOutlined />}>
              编辑订单
            </Button>
          </Space>
        }
      >
        {selectedOrder && (
          <div>
            <Descriptions title="基本信息" bordered column={2} size="small">
              <Descriptions.Item label="订单号">{selectedOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="订单状态">{getStatusTag(selectedOrder.status)}</Descriptions.Item>
              <Descriptions.Item label="支付状态">{getPaymentStatusBadge(selectedOrder.paymentStatus)}</Descriptions.Item>
              <Descriptions.Item label="订单来源">{getOrderSourceText(selectedOrder.orderSource)}</Descriptions.Item>
              <Descriptions.Item label="下单时间">{selectedOrder.orderDate}</Descriptions.Item>
              <Descriptions.Item label="入住时间">{selectedOrder.checkInDate} 至 {selectedOrder.checkOutDate}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="客户信息" bordered column={2} size="small">
              <Descriptions.Item label="姓名">{selectedOrder.customerInfo.name}</Descriptions.Item>
              <Descriptions.Item label="手机号">{selectedOrder.customerInfo.phone}</Descriptions.Item>
              <Descriptions.Item label="身份证号">{selectedOrder.customerInfo.idCard}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{selectedOrder.customerInfo.email || '未提供'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="房间信息" bordered column={2} size="small">
              <Descriptions.Item label="房型">{selectedOrder.roomTypeName}</Descriptions.Item>
              <Descriptions.Item label="房间号">{selectedOrder.roomInfo.roomNumber}</Descriptions.Item>
              <Descriptions.Item label="楼层">{selectedOrder.roomInfo.floor}楼</Descriptions.Item>
              <Descriptions.Item label="床型">{selectedOrder.roomInfo.bedType}</Descriptions.Item>
              <Descriptions.Item label="面积">{selectedOrder.roomInfo.area}㎡</Descriptions.Item>
              <Descriptions.Item label="间夜数">{selectedOrder.nights}晚</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="价格明细" bordered column={1} size="small">
              <Descriptions.Item label="房费">¥{selectedOrder.priceBredown.basePrice.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="服务费">¥{selectedOrder.priceBredown.serviceFee.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="税费">¥{selectedOrder.priceBredown.tax.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="优惠">-¥{selectedOrder.priceBredown.discount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="总计">
                <span style={{ fontSize: 16, fontWeight: 600, color: '#f5222d' }}>
                  ¥{selectedOrder.priceBredown.total.toFixed(2)}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
              <h4>订单时间线</h4>
              <Timeline>
                {selectedOrder.timeline.map((item, index) => (
                  <Timeline.Item key={index} color={item.type === 'success' ? 'green' : item.type === 'error' ? 'red' : 'blue'}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ color: '#666', fontSize: 12 }}>{item.time}</div>
                      <div style={{ marginTop: 4 }}>{item.description}</div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            {selectedOrder.specialRequests && (
              <>
                <Divider />
                <div>
                  <h4>特殊要求</h4>
                  <p>{selectedOrder.specialRequests}</p>
                </div>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default OrderManagement; 