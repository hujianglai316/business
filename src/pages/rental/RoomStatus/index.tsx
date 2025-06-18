import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Select, 
  Table, 
  Tag, 
  Typography, 
  Row, 
  Col, 
  Statistic,
  Tooltip,
  Badge,
  Radio,
  Space,
  Button
} from 'antd';
import { 
  HomeOutlined, 
  ShopOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  TableOutlined,
  AppstoreOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';
import { PageLayout } from '../../../components';

const { Title, Text } = Typography;
const { Option } = Select;

// 定义房间状态类型
type RoomStatus = 'vacant' | 'occupied' | 'reserved' | 'maintenance';

// 定义视图类型
type ViewType = 'table' | 'grid';

// 添加 RoomCardProps 接口
interface RoomCardProps {
  status: RoomStatus;
}

// 样式组件
const RoomCard = styled.div<RoomCardProps>`
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 16px;
  height: 160px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: ${(props: RoomCardProps) => {
    switch (props.status) {
      case 'vacant':
        return '#f6ffed';
      case 'occupied':
        return '#fff1f0';
      case 'reserved':
        return '#fffbe6';
      case 'maintenance':
        return '#f5f5f5';
      default:
        return '#ffffff';
    }
  }};
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const RoomNumber = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const RoomInfo = styled.div`
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.65);
`;

// 定义房间信息接口
interface RoomInfo {
  id: string;
  roomNumber: string;
  type: string;
  floor: string;
  status: RoomStatus;
  tenant?: string;
  leaseEndDate?: string;
  price: number;
  area: number;
  storeId: string;
  storeName: string;
  address: string;
  facilities?: string[];
  description?: string;
  images?: string[];
}

// 定义门店信息接口
interface Store {
  id: string;
  name: string;
  address: string;
  roomCount: number;
}

const RoomStatus: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [viewType, setViewType] = useState<ViewType>('table');
  const [statistics, setStatistics] = useState({
    total: 0,
    vacant: 0,
    occupied: 0,
    reserved: 0,
    maintenance: 0
  });

  // 获取门店列表
  useEffect(() => {
    // 模拟API调用
    const mockStores: Store[] = [
      {
        id: 'store1',
        name: '天河城店',
        address: '广州市天河区天河路208号',
        roomCount: 50
      },
      {
        id: 'store2',
        name: '珠江新城店',
        address: '广州市天河区珠江新城花城汇',
        roomCount: 35
      },
      {
        id: 'store3',
        name: '北京路店',
        address: '广州市越秀区北京路374号',
        roomCount: 42
      }
    ];
    setStores(mockStores);
    setSelectedStore(mockStores[0].id);
  }, []);

  // 获取房态数据
  useEffect(() => {
    if (!selectedStore) return;

    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const selectedStoreInfo = stores.find(s => s.id === selectedStore);
      const mockRooms: RoomInfo[] = Array.from({ length: 20 }, (_, index) => ({
        id: `room${index + 1}`,
        roomNumber: `${Math.floor(index / 5) + 1}0${index % 5 + 1}`,
        type: ['一室一厅', '两室一厅', '三室两厅'][Math.floor(Math.random() * 3)],
        floor: `${Math.floor(index / 5) + 1}层`,
        status: ['vacant', 'occupied', 'reserved', 'maintenance'][Math.floor(Math.random() * 4)] as RoomStatus,
        tenant: Math.random() > 0.5 ? '张三' : undefined,
        leaseEndDate: Math.random() > 0.5 ? '2024-12-31' : undefined,
        price: 3000 + Math.floor(Math.random() * 5000),
        area: 50 + Math.floor(Math.random() * 100),
        storeId: selectedStore,
        storeName: selectedStoreInfo?.name || '',
        address: selectedStoreInfo?.address || '',
        facilities: ['空调', '洗衣机', '冰箱', '热水器', 'WiFi'],
        description: '精装修，拎包入住',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300',
          'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=300'
        ]
      }));

      setRooms(mockRooms);
      
      // 计算统计数据
      const stats = mockRooms.reduce((acc, room) => {
        acc.total++;
        acc[room.status]++;
        return acc;
      }, {
        total: 0,
        vacant: 0,
        occupied: 0,
        reserved: 0,
        maintenance: 0
      });
      
      setStatistics(stats);
      setLoading(false);
    }, 1000);
  }, [selectedStore, stores]);

  // 跳转到房间详情页
  const handleViewDetail = (roomId: string) => {
    navigate(`/rental/room-status/detail/${roomId}`);
  };

  // 获取状态标签
  const getStatusTag = (status: RoomStatus) => {
    const statusConfig = {
      vacant: { color: 'success', text: '空置' },
      occupied: { color: 'error', text: '已租' },
      reserved: { color: 'warning', text: '已预订' },
      maintenance: { color: 'default', text: '维护中' }
    };
    return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
  };

  // 表格列配置
  const columns: ColumnsType<RoomInfo> = [
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 100,
    },
    {
      title: '楼层',
      dataIndex: 'floor',
      key: 'floor',
      width: 80,
    },
    {
      title: '房型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      render: (area: number) => `${area}㎡`,
    },
    {
      title: '租金',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `¥${price}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: RoomStatus) => getStatusTag(status),
    },
    {
      title: '租客',
      dataIndex: 'tenant',
      key: 'tenant',
      width: 100,
      render: (tenant: string) => tenant || '-',
    },
    {
      title: '到期时间',
      dataIndex: 'leaseEndDate',
      key: 'leaseEndDate',
      width: 120,
      render: (date: string) => date || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}
        >
          查看详情
        </Button>
      ),
    }
  ];

  // 渲染图块视图
  const renderGridView = () => {
    return (
      <Row gutter={[16, 16]}>
        {rooms.map(room => (
          <Col key={room.id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <RoomCard 
              status={room.status}
              onClick={() => handleViewDetail(room.id)}
            >
              <RoomNumber>
                {room.roomNumber}
                <span style={{ float: 'right' }}>{getStatusTag(room.status)}</span>
              </RoomNumber>
              <RoomInfo>{room.floor} | {room.type}</RoomInfo>
              <RoomInfo>{room.area}㎡ | ¥{room.price}/月</RoomInfo>
              <RoomInfo>
                {room.tenant ? (
                  <Tooltip title={`到期时间: ${room.leaseEndDate || '未知'}`}>
                    租客: {room.tenant}
                  </Tooltip>
                ) : '空置中'}
              </RoomInfo>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <Button type="link" size="small" icon={<EyeOutlined />}>
                  查看详情
                </Button>
              </div>
            </RoomCard>
          </Col>
        ))}
      </Row>
    );
  };

  // 统计卡片配置
  const statisticsData = [
    {
      title: '总数',
      value: statistics.total,
      prefix: <HomeOutlined />
    },
    {
      title: '空置',
      value: statistics.vacant,
      valueStyle: { color: '#52c41a' }
    },
    {
      title: '已租',
      value: statistics.occupied,
      valueStyle: { color: '#ff4d4f' }
    },
    {
      title: '预订',
      value: statistics.reserved,
      valueStyle: { color: '#faad14' }
    },
    {
      title: '维护',
      value: statistics.maintenance,
      valueStyle: { color: '#d9d9d9' }
    }
  ];

  return (
    <PageLayout
      breadcrumbs={[
        { title: '首页', path: '/' },
        { title: '房态管理' }
      ]}
      title="房态管理"
      subtitle="实时查看各门店房间状态信息"
      headerExtra={
        <Space size="middle">
          <Radio.Group
            value={viewType}
            onChange={e => setViewType(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="table">
              <TableOutlined /> 表格
            </Radio.Button>
            <Radio.Button value="grid">
              <AppstoreOutlined /> 图块
            </Radio.Button>
          </Radio.Group>
          <Select
            value={selectedStore}
            onChange={setSelectedStore}
            style={{ width: 160 }}
            placeholder="选择门店"
            size="small"
          >
            {stores.map(store => (
              <Option key={store.id} value={store.id}>
                <ShopOutlined /> {store.name}
              </Option>
            ))}
          </Select>
        </Space>
      }
      statistics={statisticsData}
      showFilter={false}
    >
      {/* 房态图 */}
      <Card title={
        <span>
          <HomeOutlined /> 房态图
          {selectedStore && 
            <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '16px' }}>
              {stores.find(s => s.id === selectedStore)?.name} - 
              {stores.find(s => s.id === selectedStore)?.address}
            </span>
          }
        </span>
      }>
        {viewType === 'table' ? (
          <Table
            columns={columns}
            dataSource={rooms}
            loading={loading}
            rowKey="id"
            pagination={false}
            scroll={{ y: 500 }}
            bordered
          />
        ) : (
          renderGridView()
        )}
      </Card>
    </PageLayout>
  );
};

export default RoomStatus; 