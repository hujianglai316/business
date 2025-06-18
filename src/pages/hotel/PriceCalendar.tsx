import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Modal,
  Form,
  Space,
  Table,
  Tag,
  Drawer,
  Statistic,
  Alert,
  message,
  Tooltip,
  Typography,
  Divider
} from 'antd';
import {
  CalendarOutlined,
  EditOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  LeftOutlined,
  RightOutlined,
  BarChartOutlined,
  SettingOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text, Title } = Typography;

interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  products: RoomProduct[];
}

interface RoomProduct {
  id: string;
  name: string;
  roomTypeId: string;
  basePrice: number;
}

interface PriceData {
  date: string;
  roomProductId: string;
  price: number;
  previousPrice?: number;
  availability: number;
  isWeekend: boolean;
  isHoliday: boolean;
}

interface PriceTrend {
  date: string;
  price: number;
  change: number;
  changePercent: number;
}

const PriceCalendar: React.FC = () => {
  const [form] = Form.useForm();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [trendDrawerVisible, setTrendDrawerVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ date: string; productId: string } | null>(null);
  const [batchEditModalVisible, setBatchEditModalVisible] = useState(false);
  const [expandedRoomTypes, setExpandedRoomTypes] = useState<Set<string>>(new Set());

  const [roomTypes] = useState<RoomType[]>([
    {
      id: '1',
      name: '标准大床房',
      basePrice: 299,
      products: [
        { id: '1-1', name: '标准大床房-含早', roomTypeId: '1', basePrice: 329 },
        { id: '1-2', name: '标准大床房-不含早', roomTypeId: '1', basePrice: 299 }
      ]
    },
    {
      id: '2',
      name: '豪华双床房',
      basePrice: 399,
      products: [
        { id: '2-1', name: '豪华双床房-含早', roomTypeId: '2', basePrice: 429 },
        { id: '2-2', name: '豪华双床房-不含早', roomTypeId: '2', basePrice: 399 }
      ]
    },
    {
      id: '3',
      name: '行政套房',
      basePrice: 699,
      products: [
        { id: '3-1', name: '行政套房-含早+行政酒廊', roomTypeId: '3', basePrice: 799 },
        { id: '3-2', name: '行政套房-含早', roomTypeId: '3', basePrice: 729 }
      ]
    }
  ]);

  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<RoomProduct | null>(null);

  const timeRangeOptions = [
    { key: '7days', label: '7天', days: 7 },
    { key: '14days', label: '14天', days: 14 },
    { key: '30days', label: '30天', days: 30 },
    { key: '90days', label: '90天', days: 90 }
  ];

  useEffect(() => {
    generateMockPriceData();
  }, [currentDate, selectedTimeRange]);

  const generateMockPriceData = () => {
    const range = timeRangeOptions.find(r => r.key === selectedTimeRange)?.days || 7;
    const data: PriceData[] = [];
    
    roomTypes.forEach(roomType => {
      roomType.products.forEach(product => {
        for (let i = 0; i < range; i++) {
          const date = currentDate.add(i, 'day');
          const isWeekend = date.day() === 0 || date.day() === 6;
          const isHoliday = Math.random() < 0.1; // 10% 概率是节假日
          
          let price = product.basePrice;
          if (isWeekend) price *= 1.2;
          if (isHoliday) price *= 1.5;
          
          // 添加一些随机波动
          price += (Math.random() - 0.5) * 100;
          price = Math.round(price);
          
          data.push({
            date: date.format('YYYY-MM-DD'),
            roomProductId: product.id,
            price,
            previousPrice: price - Math.round((Math.random() - 0.5) * 50),
            availability: Math.floor(Math.random() * 10) + 1,
            isWeekend,
            isHoliday
          });
        }
      });
    });
    
    setPriceData(data);
  };

  const getDateRange = () => {
    const range = timeRangeOptions.find(r => r.key === selectedTimeRange)?.days || 7;
    const dates = [];
    for (let i = 0; i < range; i++) {
      dates.push(currentDate.add(i, 'day'));
    }
    return dates;
  };

  const getPriceForCell = (date: string, productId: string) => {
    return priceData.find(p => p.date === date && p.roomProductId === productId);
  };

  const getPriceTrend = (currentPrice: number, previousPrice?: number) => {
    if (!previousPrice) return { trend: 'unchanged', change: 0, percent: 0 };
    
    const change = currentPrice - previousPrice;
    const percent = Math.round((change / previousPrice) * 100);
    
    if (change > 0) return { trend: 'up', change, percent };
    if (change < 0) return { trend: 'down', change, percent };
    return { trend: 'unchanged', change: 0, percent: 0 };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpOutlined style={{ color: '#ff4d4f' }} />;
      case 'down':
        return <ArrowDownOutlined style={{ color: '#52c41a' }} />;
      default:
        return <MinusOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const handleCellClick = (date: string, productId: string) => {
    setSelectedCell({ date, productId });
    setEditModalVisible(true);
    
    const priceInfo = getPriceForCell(date, productId);
    const product = roomTypes.flatMap(rt => rt.products).find(p => p.id === productId);
    
    form.setFieldsValue({
      date: dayjs(date),
      price: priceInfo?.price || 0,
      availability: priceInfo?.availability || 0
    });
  };

  const handlePriceUpdate = async (values: any) => {
    if (!selectedCell) return;
    
    const updatedData = priceData.map(item => {
      if (item.date === selectedCell.date && item.roomProductId === selectedCell.productId) {
        return {
          ...item,
          price: values.price,
          availability: values.availability
        };
      }
      return item;
    });
    
    setPriceData(updatedData);
    setEditModalVisible(false);
    message.success('价格更新成功');
  };

  const handleBatchEdit = () => {
    setBatchEditModalVisible(true);
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
  };

  const handlePrevPeriod = () => {
    const range = timeRangeOptions.find(r => r.key === selectedTimeRange)?.days || 7;
    setCurrentDate(currentDate.subtract(range, 'day'));
  };

  const handleNextPeriod = () => {
    const range = timeRangeOptions.find(r => r.key === selectedTimeRange)?.days || 7;
    setCurrentDate(currentDate.add(range, 'day'));
  };

  const toggleRoomTypeExpansion = (roomTypeId: string) => {
    const newExpanded = new Set(expandedRoomTypes);
    if (newExpanded.has(roomTypeId)) {
      newExpanded.delete(roomTypeId);
    } else {
      newExpanded.add(roomTypeId);
    }
    setExpandedRoomTypes(newExpanded);
  };

  const handleShowTrend = (product: RoomProduct) => {
    setSelectedProduct(product);
    setTrendDrawerVisible(true);
  };

  const getTrendData = () => {
    if (!selectedProduct) return [];
    
    return priceData
      .filter(p => p.roomProductId === selectedProduct.id)
      .map(p => ({
        date: p.date,
        price: p.price,
        availability: p.availability
      }))
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  };

  const renderCalendarHeader = () => {
    const dates = getDateRange();
    
    return (
      <thead>
        <tr>
          <th style={{ minWidth: 200, position: 'sticky', left: 0, backgroundColor: '#fafafa', zIndex: 10 }}>
            房型/产品
          </th>
          {dates.map(date => (
            <th key={date.format('YYYY-MM-DD')} className={date.day() === 0 || date.day() === 6 ? 'weekend' : ''}>
              <div style={{ fontSize: 12, lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600 }}>{date.format('MM-DD')}</div>
                <div>{date.format('ddd')}</div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderRoomTypeRow = (roomType: RoomType) => {
    const dates = getDateRange();
    const isExpanded = expandedRoomTypes.has(roomType.id);
    
    return (
      <React.Fragment key={roomType.id}>
        <tr>
          <td 
            style={{ 
              position: 'sticky', 
              left: 0, 
              backgroundColor: '#fafafa', 
              zIndex: 10,
              cursor: 'pointer',
              padding: '12px 16px'
            }}
            onClick={() => toggleRoomTypeExpansion(roomType.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RightOutlined 
                style={{ 
                  fontSize: 12, 
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                }} 
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{roomType.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>基础价格: ¥{roomType.basePrice}</div>
              </div>
            </div>
          </td>
          {dates.map(date => (
            <td key={date.format('YYYY-MM-DD')} style={{ backgroundColor: '#f8f9fa', textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>展开查看</Text>
            </td>
          ))}
        </tr>
        
        {isExpanded && roomType.products.map(product => (
          <tr key={product.id}>
            <td 
              style={{ 
                position: 'sticky', 
                left: 0, 
                backgroundColor: '#fff', 
                zIndex: 10,
                padding: '8px 16px 8px 32px',
                borderLeft: '3px solid #e6f7ff'
              }}
            >
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{product.name}</div>
                <div style={{ fontSize: 11, color: '#666' }}>基础价: ¥{product.basePrice}</div>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<BarChartOutlined />}
                  onClick={() => handleShowTrend(product)}
                  style={{ padding: 0, height: 'auto', fontSize: 11 }}
                >
                  趋势
                </Button>
              </div>
            </td>
            {dates.map(date => {
              const priceInfo = getPriceForCell(date.format('YYYY-MM-DD'), product.id);
              const trend = priceInfo ? getPriceTrend(priceInfo.price, priceInfo.previousPrice) : null;
              
              return (
                <td 
                  key={date.format('YYYY-MM-DD')}
                  style={{ 
                    cursor: 'pointer',
                    padding: 8,
                    backgroundColor: priceInfo?.isHoliday ? '#fff2e8' : priceInfo?.isWeekend ? '#f6ffed' : '#fff'
                  }}
                  onClick={() => handleCellClick(date.format('YYYY-MM-DD'), product.id)}
                >
                  {priceInfo && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 600, color: '#52c41a', fontSize: 14 }}>
                        ¥{priceInfo.price}
                      </div>
                      <div style={{ fontSize: 11, color: '#666' }}>
                        余{priceInfo.availability}间
                      </div>
                      {trend && trend.trend !== 'unchanged' && (
                        <div style={{ fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                          {getTrendIcon(trend.trend)}
                          <span style={{ color: trend.trend === 'up' ? '#ff4d4f' : '#52c41a' }}>
                            {Math.abs(trend.change)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </React.Fragment>
    );
  };

  const config = {
    data: getTrendData(),
    xField: 'date',
    yField: 'price',
    smooth: true,
    point: {
      size: 4,
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '价格',
          value: `¥${datum.price}`,
        };
      },
    },
    xAxis: {
      type: 'time',
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${v}`,
      },
    },
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题和操作区 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>房价日历</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<CopyOutlined />} onClick={handleBatchEdit}>
              批量设置
            </Button>
            <Button icon={<SettingOutlined />}>
              价格策略
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 时间范围选择器 */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button icon={<LeftOutlined />} onClick={handlePrevPeriod} />
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                {currentDate.format('YYYY年MM月DD日')} - {currentDate.add(timeRangeOptions.find(r => r.key === selectedTimeRange)?.days || 7, 'day').subtract(1, 'day').format('MM月DD日')}
              </span>
              <Button icon={<RightOutlined />} onClick={handleNextPeriod} />
            </Space>
          </Col>
          <Col>
            <Space>
              {timeRangeOptions.map(option => (
                <Button
                  key={option.key}
                  type={selectedTimeRange === option.key ? 'primary' : 'default'}
                  onClick={() => handleTimeRangeChange(option.key)}
                >
                  {option.label}
                </Button>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 价格日历表格 */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            {renderCalendarHeader()}
            <tbody>
              {roomTypes.map(roomType => renderRoomTypeRow(roomType))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 价格编辑弹窗 */}
      <Modal
        title="编辑价格"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        width={400}
      >
        <Form form={form} onFinish={handlePriceUpdate} layout="vertical">
          <Form.Item label="日期" name="date">
            <DatePicker disabled style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item 
            label="价格" 
            name="price" 
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={0}
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/¥\s?|(,*)/g, '') as any}
            />
          </Form.Item>
          <Form.Item 
            label="可售房间数" 
            name="availability"
            rules={[{ required: true, message: '请输入可售房间数' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量设置弹窗 */}
      <Modal
        title="批量设置价格"
        open={batchEditModalVisible}
        onCancel={() => setBatchEditModalVisible(false)}
        width={600}
        footer={null}
      >
        <Alert
          message="批量设置功能"
          description="选择日期范围和房型产品，批量设置价格和房量。"
          type="info"
          style={{ marginBottom: 16 }}
        />
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="开始日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="结束日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="房型产品">
            <Select mode="multiple" placeholder="选择房型产品" style={{ width: '100%' }}>
              {roomTypes.map(roomType => 
                roomType.products.map(product => (
                  <Option key={product.id} value={product.id}>
                    {roomType.name} - {product.name}
                  </Option>
                ))
              )}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设置价格">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={0}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/¥\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设置房量">
                <InputNumber style={{ width: '100%' }} min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary">批量设置</Button>
              <Button onClick={() => setBatchEditModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 价格趋势抽屉 */}
      <Drawer
        title={`价格趋势 - ${selectedProduct?.name}`}
        placement="right"
        width={600}
        open={trendDrawerVisible}
        onClose={() => setTrendDrawerVisible(false)}
      >
        {selectedProduct && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Statistic
                  title="平均价格"
                  value={getTrendData().reduce((sum, item) => sum + item.price, 0) / getTrendData().length || 0}
                  precision={0}
                  prefix="¥"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="最高价格"
                  value={Math.max(...getTrendData().map(item => item.price)) || 0}
                  precision={0}
                  prefix="¥"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="最低价格"
                  value={Math.min(...getTrendData().map(item => item.price)) || 0}
                  precision={0}
                  prefix="¥"
                />
              </Col>
            </Row>

            <Divider />

            <div style={{ height: 300, marginBottom: 24 }}>
              <Line {...config} />
            </div>

            <Divider />

            <Title level={5}>价格历史</Title>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {getTrendData().map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <span>{dayjs(item.date).format('MM-DD dddd')}</span>
                  <Space>
                    <span style={{ fontWeight: 600 }}>¥{item.price}</span>
                    <span style={{ color: '#666', fontSize: 12 }}>余{item.availability}间</span>
                  </Space>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default PriceCalendar;
