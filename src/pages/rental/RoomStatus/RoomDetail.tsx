import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Tag,
  Descriptions,
  Image,
  Timeline,
  Button,
  Space,
  Divider,
  Typography,
  Empty,
  Spin
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  AreaChartOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  EditOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { DetailLayout } from '../../../components';

const { Title, Text } = Typography;

// 房间状态类型
type RoomStatus = 'vacant' | 'occupied' | 'reserved' | 'maintenance';

// 房间详细信息接口
interface RoomDetailInfo {
  id: string;
  roomNumber: string;
  type: string;
  floor: string;
  status: RoomStatus;
  tenant?: {
    name: string;
    phone: string;
    email: string;
    idCard: string;
    checkInDate: string;
    leaseEndDate: string;
  };
  price: number;
  area: number;
  storeId: string;
  storeName: string;
  address: string;
  facilities: string[];
  description: string;
  images: string[];
  rentHistory: {
    tenant: string;
    startDate: string;
    endDate: string;
    rent: number;
    status: 'completed' | 'current';
  }[];
  maintenanceHistory: {
    date: string;
    type: string;
    description: string;
    cost: number;
    status: 'completed' | 'pending';
  }[];
}

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomDetail, setRoomDetail] = useState<RoomDetailInfo | null>(null);

  // 获取房间详情
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockRoomDetail: RoomDetailInfo = {
        id: roomId,
        roomNumber: '101',
        type: '一室一厅',
        floor: '1层',
        status: 'occupied',
        tenant: {
          name: '张三',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          idCard: '440101199001011234',
          checkInDate: '2024-01-01',
          leaseEndDate: '2024-12-31'
        },
        price: 3500,
        area: 65,
        storeId: 'store1',
        storeName: '天河城店',
        address: '广州市天河区天河路208号',
        facilities: ['空调', '洗衣机', '冰箱', '热水器', 'WiFi', '燃气灶', '微波炉'],
        description: '精装修，拎包入住。房间朝南，采光良好，交通便利，周边配套设施齐全。',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
          'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=400',
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400'
        ],
        rentHistory: [
          {
            tenant: '张三',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            rent: 3500,
            status: 'current'
          },
          {
            tenant: '李四',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            rent: 3200,
            status: 'completed'
          },
          {
            tenant: '王五',
            startDate: '2022-06-01',
            endDate: '2022-12-31',
            rent: 3000,
            status: 'completed'
          }
        ],
        maintenanceHistory: [
          {
            date: '2024-03-15',
            type: '空调维修',
            description: '空调制冷效果不佳，更换压缩机',
            cost: 800,
            status: 'completed'
          },
          {
            date: '2024-02-01',
            type: '墙面修补',
            description: '客厅墙面有轻微裂缝，进行修补和重新粉刷',
            cost: 500,
            status: 'completed'
          },
          {
            date: '2023-12-20',
            type: '水管维修',
            description: '厨房水管漏水，更换水管接头',
            cost: 200,
            status: 'completed'
          }
        ]
      };

      setRoomDetail(mockRoomDetail);
      setLoading(false);
    }, 1000);
  }, [roomId]);

  // 获取状态标签
  const getStatusTag = (status: RoomStatus) => {
    const statusConfig = {
      vacant: { color: 'success', text: '空置', icon: <CheckCircleOutlined /> },
      occupied: { color: 'error', text: '已租', icon: <UserOutlined /> },
      reserved: { color: 'warning', text: '已预订', icon: <ClockCircleOutlined /> },
      maintenance: { color: 'default', text: '维护中', icon: <ToolOutlined /> }
    };
    const config = statusConfig[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 编辑房间信息
  const handleEdit = () => {
    // TODO: 跳转到编辑页面或打开编辑弹窗
    console.log('编辑房间信息');
  };

  // 联系租客
  const handleContactTenant = () => {
    if (roomDetail?.tenant?.phone) {
      window.open(`tel:${roomDetail.tenant.phone}`);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!roomDetail) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Empty description="房间信息不存在" />
      </div>
    );
  }

  return (
    <DetailLayout
      breadcrumbs={[
        { title: '首页', path: '/' },
        { title: '房态管理', path: '/rental/room-status' },
        { title: `房间 ${roomDetail.roomNumber}` }
      ]}
      title={`房间 ${roomDetail.roomNumber}`}
      subtitle={`${roomDetail.storeName} - ${roomDetail.address}`}
      actions={[
        {
          key: 'edit',
          label: '编辑信息',
          type: 'primary',
          icon: <EditOutlined />,
          onClick: handleEdit
        },
        ...(roomDetail.tenant ? [{
          key: 'contact',
          label: '联系租客',
          icon: <PhoneOutlined />,
          onClick: handleContactTenant
        }] : [])
      ]}
    >
      <Row gutter={[24, 24]}>
        {/* 基本信息 */}
        <Col span={24}>
          <Card title="基本信息">
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="房间号">
                    <Text strong>{roomDetail.roomNumber}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="房型">
                    {roomDetail.type}
                  </Descriptions.Item>
                  <Descriptions.Item label="楼层">
                    {roomDetail.floor}
                  </Descriptions.Item>
                  <Descriptions.Item label="面积">
                    <Text strong>{roomDetail.area}㎡</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="租金">
                    <Text strong style={{ color: '#ff4d4f', fontSize: '16px' }}>
                      ¥{roomDetail.price}/月
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    {getStatusTag(roomDetail.status)}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <div>
                  <Title level={5}>房间描述</Title>
                  <Text>{roomDetail.description}</Text>
                </div>
                <Divider />
                <div>
                  <Title level={5}>设施配置</Title>
                  <Space wrap>
                    {roomDetail.facilities.map(facility => (
                      <Tag key={facility} color="blue">{facility}</Tag>
                    ))}
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 房间图片 */}
        <Col span={24}>
          <Card title="房间图片">
            <Row gutter={[16, 16]}>
              {roomDetail.images.map((image, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Image
                    src={image}
                    alt={`房间图片${index + 1}`}
                    style={{ borderRadius: 8 }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 租客信息 */}
        {roomDetail.tenant && (
          <Col span={24}>
            <Card 
              title="当前租客信息"
              extra={
                <Button 
                  type="link" 
                  icon={<PhoneOutlined />}
                  onClick={handleContactTenant}
                >
                  联系租客
                </Button>
              }
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="姓名">
                  {roomDetail.tenant.name}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  {roomDetail.tenant.phone}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  {roomDetail.tenant.email}
                </Descriptions.Item>
                <Descriptions.Item label="身份证号">
                  {roomDetail.tenant.idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')}
                </Descriptions.Item>
                <Descriptions.Item label="入住时间">
                  {roomDetail.tenant.checkInDate}
                </Descriptions.Item>
                <Descriptions.Item label="租约到期">
                  <Text type="warning">{roomDetail.tenant.leaseEndDate}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* 租赁历史 */}
        <Col span={12}>
          <Card title="租赁历史">
            <Timeline
              items={roomDetail.rentHistory.map(record => ({
                color: record.status === 'current' ? 'green' : 'blue',
                children: (
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {record.tenant}
                      {record.status === 'current' && (
                        <Tag color="green" style={{ marginLeft: 8 }}>当前租客</Tag>
                      )}
                    </div>
                    <div style={{ color: '#666' }}>
                      租期: {record.startDate} 至 {record.endDate}
                    </div>
                    <div style={{ color: '#666' }}>
                      租金: ¥{record.rent}/月
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>

        {/* 维护记录 */}
        <Col span={12}>
          <Card title="维护记录">
            <Timeline
              items={roomDetail.maintenanceHistory.map(record => ({
                color: record.status === 'completed' ? 'green' : 'orange',
                children: (
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {record.type}
                      <Tag 
                        color={record.status === 'completed' ? 'green' : 'orange'}
                        style={{ marginLeft: 8 }}
                      >
                        {record.status === 'completed' ? '已完成' : '进行中'}
                      </Tag>
                    </div>
                    <div style={{ color: '#666', marginBottom: 4 }}>
                      {record.description}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>{record.date}</span>
                      <span style={{ color: '#ff4d4f' }}>费用: ¥{record.cost}</span>
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>
    </DetailLayout>
  );
};

export default RoomDetail; 