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
  Tag,
  Tooltip,
  Typography,
  Radio,
  Switch,
  message,
  Popover,
  Badge
} from 'antd';
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
  EditOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  RightOutlined as ExpandIcon
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text, Title } = Typography;

interface RoomType {
  id: string;
  name: string;
  totalRooms: number;
  products: RoomProduct[];
}

interface RoomProduct {
  id: string;
  name: string;
  roomTypeId: string;
  basePrice: number;
}

interface RoomStatus {
  date: string;
  roomProductId: string;
  status: 'available' | 'closed' | 'maintenance' | 'overbooking';
  availableRooms: number;
  totalRooms: number;
  price: number;
  restrictions?: string[];
}

const RoomStatusManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [batchEditModalVisible, setBatchEditModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ date: string; productId: string } | null>(null);
  const [expandedRoomTypes, setExpandedRoomTypes] = useState<Set<string>>(new Set());

  const [roomTypes] = useState<RoomType[]>([
    {
      id: '1',
      name: '标准大床房',
      totalRooms: 30,
      products: [
        { id: '1-1', name: '标准大床房-含早', roomTypeId: '1', basePrice: 329 },
        { id: '1-2', name: '标准大床房-不含早', roomTypeId: '1', basePrice: 299 }
      ]
    },
    {
      id: '2',
      name: '豪华双床房',
      totalRooms: 20,
      products: [
        { id: '2-1', name: '豪华双床房-含早', roomTypeId: '2', basePrice: 429 },
        { id: '2-2', name: '豪华双床房-不含早', roomTypeId: '2', basePrice: 399 }
      ]
    },
    {
      id: '3',
      name: '行政套房',
      totalRooms: 10,
      products: [
        { id: '3-1', name: '行政套房-含早+行政酒廊', roomTypeId: '3', basePrice: 799 },
        { id: '3-2', name: '行政套房-含早', roomTypeId: '3', basePrice: 729 }
      ]
    }
  ]);

  const [roomStatusData, setRoomStatusData] = useState<RoomStatus[]>([]);

  const timeRangeOptions = [
    { key: '7days', label: '7天', days: 7 },
    { key: '14days', label: '14天', days: 14 },
    { key: '30days', label: '30天', days: 30 },
    { key: '90days', label: '90天', days: 90 }
  ];

  const statusOptions = [
    { key: 'available', label: '可售', color: '#52c41a', icon: <CheckCircleOutlined /> },
    { key: 'closed', label: '关房', color: '#8c8c8c', icon: <CloseCircleOutlined /> },
    { key: 'maintenance', label: '维修', color: '#faad14', icon: <WarningOutlined /> },
    { key: 'overbooking', label: '超售', color: '#ff4d4f', icon: <WarningOutlined /> }
  ];

  useEffect(() => {
    generateMockStatusData();
  }, [currentDate, selectedTimeRange]);

  const generateMockStatusData = () => {
    const range = timeRangeOptions.find(r => r.key === selectedTimeRange)?.days || 7;
    const data: RoomStatus[] = [];
    
    roomTypes.forEach(roomType => {
      roomType.products.forEach(product => {
        for (let i = 0; i < range; i++) {
          const date = currentDate.add(i, 'day');
          const isWeekend = date.day() === 0 || date.day() === 6;
          
          // 随机生成房态数据
          const statusKeys = statusOptions.map(s => s.key);
          const randomStatus = statusKeys[Math.floor(Math.random() * statusKeys.length)] as any;
          
          let availableRooms = roomType.totalRooms;
          if (randomStatus === 'closed') availableRooms = 0;
          else if (randomStatus === 'maintenance') availableRooms = Math.floor(roomType.totalRooms * 0.7);
          else availableRooms = Math.floor(Math.random() * roomType.totalRooms) + 1;
          
          let price = product.basePrice;
          if (isWeekend) price *= 1.2;
          price += (Math.random() - 0.5) * 100;
          price = Math.round(price);
          
          data.push({
            date: date.format('YYYY-MM-DD'),
            roomProductId: product.id,
            status: randomStatus,
            availableRooms,
            totalRooms: roomType.totalRooms,
            price,
            restrictions: Math.random() > 0.8 ? ['最少住2晚'] : undefined
          });
        }
      });
    });
    
    setRoomStatusData(data);
  };

  const getDateRange = () => {
    const range = timeRangeOptions.find(r => r.key === selectedTimeRange)?.days || 7;
    const dates = [];
    for (let i = 0; i < range; i++) {
      dates.push(currentDate.add(i, 'day'));
    }
    return dates;
  };

  const getStatusForCell = (date: string, productId: string) => {
    return roomStatusData.find(s => s.date === date && s.roomProductId === productId);
  };

  const getStatusConfig = (status: string) => {
    return statusOptions.find(s => s.key === status) || statusOptions[0];
  };

  const handleCellClick = (date: string, productId: string) => {
    setSelectedCell({ date, productId });
    setEditModalVisible(true);
    
    const statusInfo = getStatusForCell(date, productId);
    const product = roomTypes.flatMap(rt => rt.products).find(p => p.id === productId);
    
    form.setFieldsValue({
      date: dayjs(date),
      status: statusInfo?.status || 'available',
      availableRooms: statusInfo?.availableRooms || 0,
      price: statusInfo?.price || 0,
      restrictions: statusInfo?.restrictions || []
    });
  };

  const handleStatusUpdate = async (values: any) => {
    if (!selectedCell) return;
    
    const updatedData = roomStatusData.map(item => {
      if (item.date === selectedCell.date && item.roomProductId === selectedCell.productId) {
        return {
          ...item,
          status: values.status,
          availableRooms: values.availableRooms,
          price: values.price,
          restrictions: values.restrictions
        };
      }
      return item;
    });
    
    setRoomStatusData(updatedData);
    setEditModalVisible(false);
    message.success('房态更新成功');
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
                <div style={{ color: date.day() === 0 || date.day() === 6 ? '#ff4d4f' : '#666' }}>
                  {date.format('ddd')}
                </div>
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
              <ExpandIcon 
                style={{ 
                  fontSize: 12, 
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                }} 
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{roomType.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>总房间数: {roomType.totalRooms}间</div>
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
              </div>
            </td>
            {dates.map(date => {
              const statusInfo = getStatusForCell(date.format('YYYY-MM-DD'), product.id);
              const statusConfig = statusInfo ? getStatusConfig(statusInfo.status) : statusOptions[0];
              
              return (
                <td 
                  key={date.format('YYYY-MM-DD')}
                  style={{ 
                    cursor: 'pointer',
                    padding: 8,
                    backgroundColor: '#fff'
                  }}
                  onClick={() => handleCellClick(date.format('YYYY-MM-DD'), product.id)}
                >
                  {statusInfo && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 4 }}>
                        <Tag 
                          color={statusConfig.color} 
                          icon={statusConfig.icon}
                          style={{ fontSize: 10, margin: 0 }}
                        >
                          {statusConfig.label}
                        </Tag>
                      </div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
                        {statusInfo.availableRooms}/{statusInfo.totalRooms}间
                      </div>
                      <div style={{ fontWeight: 600, color: '#52c41a', fontSize: 12 }}>
                        ¥{statusInfo.price}
                      </div>
                      {statusInfo.restrictions && statusInfo.restrictions.length > 0 && (
                        <div style={{ fontSize: 10, color: '#faad14', marginTop: 2 }}>
                          <WarningOutlined style={{ marginRight: 2 }} />
                          限制
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

  const renderStatusOptions = () => (
    <Row gutter={[8, 8]}>
      {statusOptions.map(option => (
        <Col span={6} key={option.key}>
          <div
            style={{
              textAlign: 'center',
              padding: '12px 8px',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => form.setFieldsValue({ status: option.key })}
          >
            <div style={{ color: option.color, fontSize: 20, marginBottom: 4 }}>
              {option.icon}
            </div>
            <div style={{ fontSize: 12 }}>{option.label}</div>
          </div>
        </Col>
      ))}
    </Row>
  );

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题和操作区 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>房态日历</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<CopyOutlined />} onClick={handleBatchEdit}>
              批量设置
            </Button>
            <Button icon={<SettingOutlined />}>
              房态策略
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

      {/* 房态图例 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]} align="middle">
          <Col>
            <Text strong>房态图例：</Text>
          </Col>
          {statusOptions.map(option => (
            <Col key={option.key}>
              <Space>
                <Tag color={option.color} icon={option.icon}>
                  {option.label}
                </Tag>
              </Space>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 房态日历表格 */}
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

      {/* 房态编辑弹窗 */}
      <Modal
        title="编辑房态"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        width={500}
      >
        <Form form={form} onFinish={handleStatusUpdate} layout="vertical">
          <Form.Item label="日期" name="date">
            <DatePicker disabled style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="房态状态" name="status">
            <Radio.Group style={{ width: '100%' }}>
              {renderStatusOptions()}
            </Radio.Group>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="可售房间数" 
                name="availableRooms"
                rules={[{ required: true, message: '请输入可售房间数' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} max={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="房价" 
                name="price" 
                rules={[{ required: true, message: '请输入房价' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={0}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/¥\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="销售限制" name="restrictions">
            <Select mode="multiple" placeholder="选择销售限制" allowClear>
              <Option value="最少住2晚">最少住2晚</Option>
              <Option value="最少住3晚">最少住3晚</Option>
              <Option value="不可取消">不可取消</Option>
              <Option value="提前预订">提前预订</Option>
              <Option value="会员专享">会员专享</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量设置弹窗 */}
      <Modal
        title="批量设置房态"
        open={batchEditModalVisible}
        onCancel={() => setBatchEditModalVisible(false)}
        width={600}
        footer={null}
      >
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
          
          <Form.Item label="房态状态">
            <Radio.Group style={{ width: '100%' }}>
              {renderStatusOptions()}
            </Radio.Group>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="可售房间数">
                <InputNumber style={{ width: '100%' }} min={0} max={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房价">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={0}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/¥\s?|(,*)/g, '') as any}
                />
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
    </div>
  );
};

export default RoomStatusManagement; 