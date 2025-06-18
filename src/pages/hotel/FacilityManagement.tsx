import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Input,
  Select,
  Tree,
  Modal,
  Form,
  message,
  Switch,
  Tag,
  Tooltip,
  Badge,
  Radio,
  Checkbox,
  Upload,
  Image,
  Divider,
  Tabs,
  List,
  Avatar,
  Progress,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  FileTextOutlined,
  ImportOutlined,
  SearchOutlined,
  SettingOutlined,
  CheckOutlined,
  CloseOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  CopyOutlined,
  UploadOutlined
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface FacilityItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  icon: string;
  image?: string;
  status: 'active' | 'inactive';
  isStandard: boolean;
  isPremium: boolean;
  tags: string[];
  roomTypes: string[];
  specifications?: {
    brand?: string;
    model?: string;
    quantity?: number;
    unit?: string;
  };
  createTime: string;
  updateTime: string;
}

interface CategoryNode {
  key: string;
  title: string;
  icon?: string;
  children?: CategoryNode[];
}

const FacilityManagement: React.FC = () => {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<FacilityItem[]>([]);
  const [facilityType, setFacilityType] = useState<'hotel' | 'room'>('hotel');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [operationLogVisible, setOperationLogVisible] = useState(false);
  const [currentFacility, setCurrentFacility] = useState<FacilityItem | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['hotel-public', 'room-basic']);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // 酒店设施分类树
  const hotelCategoryTree: CategoryNode[] = [
    {
      key: 'hotel-public',
      title: '公共区域',
      icon: 'building',
      children: [
        {
          key: 'hotel-public-lobby',
          title: '大堂',
          children: [
            { key: 'hotel-public-lobby-rest', title: '休息区' },
            { key: 'hotel-public-lobby-business', title: '商务中心' },
            { key: 'hotel-public-lobby-luggage', title: '行李寄存' }
          ]
        },
        {
          key: 'hotel-public-restaurant',
          title: '餐厅',
          children: [
            { key: 'hotel-public-restaurant-chinese', title: '中餐厅' },
            { key: 'hotel-public-restaurant-western', title: '西餐厅' },
            { key: 'hotel-public-restaurant-buffet', title: '自助餐厅' },
            { key: 'hotel-public-restaurant-bar', title: '酒吧' }
          ]
        },
        {
          key: 'hotel-public-meeting',
          title: '会议室',
          children: [
            { key: 'hotel-public-meeting-large', title: '大会议室' },
            { key: 'hotel-public-meeting-small', title: '小会议室' },
            { key: 'hotel-public-meeting-multi', title: '多功能厅' }
          ]
        },
        {
          key: 'hotel-public-gym',
          title: '健身房',
          children: [
            { key: 'hotel-public-gym-cardio', title: '有氧区' },
            { key: 'hotel-public-gym-strength', title: '力量区' },
            { key: 'hotel-public-gym-yoga', title: '瑜伽室' }
          ]
        },
        {
          key: 'hotel-public-pool',
          title: '游泳池',
          children: [
            { key: 'hotel-public-pool-indoor', title: '室内泳池' },
            { key: 'hotel-public-pool-outdoor', title: '室外泳池' },
            { key: 'hotel-public-pool-kids', title: '儿童泳池' }
          ]
        }
      ]
    },
    {
      key: 'hotel-transport',
      title: '交通设施',
      icon: 'car',
      children: [
        {
          key: 'hotel-transport-parking',
          title: '停车场',
          children: [
            { key: 'hotel-transport-parking-ground', title: '地面停车场' },
            { key: 'hotel-transport-parking-underground', title: '地下停车场' },
            { key: 'hotel-transport-parking-charging', title: '充电桩' }
          ]
        },
        {
          key: 'hotel-transport-shuttle',
          title: '接送服务',
          children: [
            { key: 'hotel-transport-shuttle-airport', title: '机场接送' },
            { key: 'hotel-transport-shuttle-station', title: '火车站接送' },
            { key: 'hotel-transport-shuttle-business', title: '商务用车' }
          ]
        }
      ]
    },
    {
      key: 'hotel-service',
      title: '服务设施',
      icon: 'customer-service',
      children: [
        {
          key: 'hotel-service-front',
          title: '前台服务',
          children: [
            { key: 'hotel-service-front-24h', title: '24小时前台' },
            { key: 'hotel-service-front-concierge', title: '礼宾服务' },
            { key: 'hotel-service-front-luggage', title: '行李服务' }
          ]
        },
        {
          key: 'hotel-service-business',
          title: '商务服务',
          children: [
            { key: 'hotel-service-business-print', title: '打印复印' },
            { key: 'hotel-service-business-fax', title: '传真服务' },
            { key: 'hotel-service-business-translate', title: '翻译服务' }
          ]
        }
      ]
    }
  ];

  // 房间设施分类树
  const roomCategoryTree: CategoryNode[] = [
    {
      key: 'room-basic',
      title: '基础设施',
      icon: 'home',
      children: [
        {
          key: 'room-basic-bed',
          title: '床具',
          children: [
            { key: 'room-basic-bed-king', title: '大床' },
            { key: 'room-basic-bed-twin', title: '双床' },
            { key: 'room-basic-bed-sofa', title: '沙发床' },
            { key: 'room-basic-bed-baby', title: '婴儿床' }
          ]
        },
        {
          key: 'room-basic-furniture',
          title: '家具',
          children: [
            { key: 'room-basic-furniture-wardrobe', title: '衣柜' },
            { key: 'room-basic-furniture-desk', title: '书桌' },
            { key: 'room-basic-furniture-sofa', title: '沙发' },
            { key: 'room-basic-furniture-table', title: '茶几' }
          ]
        },
        {
          key: 'room-basic-lighting',
          title: '照明',
          children: [
            { key: 'room-basic-lighting-main', title: '主灯' },
            { key: 'room-basic-lighting-bedside', title: '床头灯' },
            { key: 'room-basic-lighting-floor', title: '落地灯' },
            { key: 'room-basic-lighting-reading', title: '阅读灯' }
          ]
        }
      ]
    },
    {
      key: 'room-bathroom',
      title: '卫浴设施',
      icon: 'experiment',
      children: [
        {
          key: 'room-bathroom-shower',
          title: '淋浴',
          children: [
            { key: 'room-bathroom-shower-room', title: '淋浴房' },
            { key: 'room-bathroom-shower-head', title: '花洒' },
            { key: 'room-bathroom-shower-tub', title: '浴缸' }
          ]
        },
        {
          key: 'room-bathroom-amenities',
          title: '洗漱用品',
          children: [
            { key: 'room-bathroom-amenities-towel', title: '毛巾' },
            { key: 'room-bathroom-amenities-shampoo', title: '洗发水' },
            { key: 'room-bathroom-amenities-soap', title: '香皂' }
          ]
        }
      ]
    },
    {
      key: 'room-appliance',
      title: '电器设备',
      icon: 'thunderbolt',
      children: [
        {
          key: 'room-appliance-tv',
          title: '电视',
          children: [
            { key: 'room-appliance-tv-lcd', title: 'LCD电视' },
            { key: 'room-appliance-tv-smart', title: '智能电视' },
            { key: 'room-appliance-tv-projector', title: '投影仪' }
          ]
        },
        {
          key: 'room-appliance-ac',
          title: '空调',
          children: [
            { key: 'room-appliance-ac-central', title: '中央空调' },
            { key: 'room-appliance-ac-split', title: '分体空调' },
            { key: 'room-appliance-ac-floor', title: '地暖' }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    generateMockData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [facilities, facilityType, selectedCategory, searchKeyword]);

  const generateMockData = () => {
    const mockFacilities: FacilityItem[] = [
      // 酒店设施
      {
        id: 'facility_1',
        name: '24小时前台服务',
        category: 'hotel-service',
        subcategory: 'hotel-service-front-24h',
        description: '提供全天候前台接待服务，包括入住退房、咨询等',
        icon: 'customer-service',
        status: 'active',
        isStandard: true,
        isPremium: false,
        tags: ['24小时', '前台', '服务'],
        roomTypes: [],
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z'
      },
      {
        id: 'facility_2',
        name: '室内游泳池',
        category: 'hotel-public',
        subcategory: 'hotel-public-pool-indoor',
        description: '恒温室内游泳池，配备专业救生员',
        icon: 'experiment',
        image: 'https://picsum.photos/400/300?random=1',
        status: 'active',
        isStandard: false,
        isPremium: true,
        tags: ['游泳', '恒温', '室内'],
        roomTypes: [],
        specifications: {
          brand: '专业泳池设备',
          model: 'SP-2024',
          quantity: 1,
          unit: '个'
        },
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z'
      },
      {
        id: 'facility_3',
        name: '健身房',
        category: 'hotel-public',
        subcategory: 'hotel-public-gym-cardio',
        description: '配备先进健身器材的现代化健身房',
        icon: 'thunderbolt',
        image: 'https://picsum.photos/400/300?random=2',
        status: 'active',
        isStandard: false,
        isPremium: true,
        tags: ['健身', '器材', '现代化'],
        roomTypes: [],
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z'
      },
      // 房间设施
      {
        id: 'facility_4',
        name: '大床',
        category: 'room-basic',
        subcategory: 'room-basic-bed-king',
        description: '1.8米x2米舒适大床，配备优质床垫',
        icon: 'home',
        status: 'active',
        isStandard: true,
        isPremium: false,
        tags: ['大床', '舒适', '1.8米'],
        roomTypes: ['standard', 'deluxe', 'executive'],
        specifications: {
          brand: 'Simmons',
          model: 'BeautyRest',
          quantity: 1,
          unit: '张'
        },
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z'
      },
      {
        id: 'facility_5',
        name: '智能电视',
        category: 'room-appliance',
        subcategory: 'room-appliance-tv-smart',
        description: '55寸4K智能电视，支持网络视频播放',
        icon: 'thunderbolt',
        image: 'https://picsum.photos/400/300?random=3',
        status: 'active',
        isStandard: false,
        isPremium: true,
        tags: ['智能', '4K', '55寸'],
        roomTypes: ['deluxe', 'executive', 'suite'],
        specifications: {
          brand: 'Samsung',
          model: 'QLED 55Q70A',
          quantity: 1,
          unit: '台'
        },
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z'
      },
      {
        id: 'facility_6',
        name: '中央空调',
        category: 'room-appliance',
        subcategory: 'room-appliance-ac-central',
        description: '静音中央空调系统，温度可调',
        icon: 'thunderbolt',
        status: 'active',
        isStandard: true,
        isPremium: false,
        tags: ['中央空调', '静音', '温控'],
        roomTypes: ['standard', 'deluxe', 'executive', 'suite'],
        specifications: {
          brand: 'Daikin',
          model: 'VRV-X',
          quantity: 1,
          unit: '套'
        },
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z'
      }
    ];

    setFacilities(mockFacilities);
  };

  const applyFilters = () => {
    let filtered = facilities.filter(facility => {
      // 按设施类型过滤
      const isHotelFacility = facility.category.startsWith('hotel-');
      const isRoomFacility = facility.category.startsWith('room-');
      
      if (facilityType === 'hotel' && !isHotelFacility) return false;
      if (facilityType === 'room' && !isRoomFacility) return false;

      // 按分类过滤
      if (selectedCategory !== 'all' && !facility.subcategory.startsWith(selectedCategory)) {
        return false;
      }

      // 按关键词过滤
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        return (
          facility.name.toLowerCase().includes(keyword) ||
          facility.description.toLowerCase().includes(keyword) ||
          facility.tags.some(tag => tag.toLowerCase().includes(keyword))
        );
      }

      return true;
    });

    setFilteredFacilities(filtered);
  };

  const getCurrentCategoryTree = () => {
    return facilityType === 'hotel' ? hotelCategoryTree : roomCategoryTree;
  };

  const handleCategorySelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      setSelectedCategory(selectedKeys[0] as string);
    }
  };

  const handleAddFacility = () => {
    form.resetFields();
    setAddModalVisible(true);
  };

  const handleEditFacility = (facility: FacilityItem) => {
    setCurrentFacility(facility);
    editForm.setFieldsValue({
      name: facility.name,
      category: facility.category,
      subcategory: facility.subcategory,
      description: facility.description,
      tags: facility.tags,
      roomTypes: facility.roomTypes,
      status: facility.status,
      isStandard: facility.isStandard,
      isPremium: facility.isPremium,
      specifications: facility.specifications
    });
    setEditModalVisible(true);
  };

  const handleDeleteFacility = (facility: FacilityItem) => {
    setFacilities(facilities.filter(f => f.id !== facility.id));
    message.success('设施删除成功');
  };

  const handleToggleStatus = (facility: FacilityItem) => {
    const newStatus = facility.status === 'active' ? 'inactive' : 'active';
    setFacilities(facilities.map(f => 
      f.id === facility.id ? { ...f, status: newStatus } : f
    ));
    message.success(`设施已${newStatus === 'active' ? '启用' : '禁用'}`);
  };

  const handleCopyFacility = (facility: FacilityItem) => {
    const newFacility: FacilityItem = {
      ...facility,
      id: `facility_${Date.now()}`,
      name: `${facility.name} (副本)`,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    setFacilities([...facilities, newFacility]);
    message.success('设施复制成功');
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge status="success" text="启用" />
    ) : (
      <Badge status="error" text="禁用" />
    );
  };

  const getFacilityIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'building': <i className="fas fa-building" />,
      'car': <i className="fas fa-car" />,
      'customer-service': <i className="fas fa-headset" />,
      'home': <i className="fas fa-home" />,
      'experiment': <i className="fas fa-flask" />,
      'thunderbolt': <i className="fas fa-bolt" />
    };
    return iconMap[iconName] || <i className="fas fa-cog" />;
  };

  const renderTreeTitle = (node: CategoryNode) => (
    <span>
      {node.icon && getFacilityIcon(node.icon)}
      <span style={{ marginLeft: node.icon ? 8 : 0 }}>{node.title}</span>
    </span>
  );

  const treeData = getCurrentCategoryTree().map(node => ({
    ...node,
    title: renderTreeTitle(node),
    children: node.children?.map(child => ({
      ...child,
      title: renderTreeTitle(child),
      children: child.children?.map(grandChild => ({
        ...grandChild,
        title: renderTreeTitle(grandChild)
      }))
    }))
  }));

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>设施管理</Title>
          <Text type="secondary">管理酒店和房间的各类设施信息</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<HistoryOutlined />} onClick={() => setOperationLogVisible(true)}>
              操作日志
            </Button>
            <Button icon={<FileTextOutlined />} onClick={() => setTemplateModalVisible(true)}>
              设施模板
            </Button>
            <Button icon={<ImportOutlined />} onClick={() => setImportModalVisible(true)}>
              导入设施
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFacility}>
              添加设施
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 设施类型切换 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Radio.Group value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
          <Radio.Button value="hotel">酒店设施</Radio.Button>
          <Radio.Button value="room">房间设施</Radio.Button>
        </Radio.Group>
      </Card>

      <Row gutter={16}>
        {/* 左侧分类树 */}
        <Col xs={24} lg={6}>
          <Card title="设施分类" size="small" style={{ height: 'calc(100vh - 300px)' }}>
            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="搜索设施"
                prefix={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Tree
              treeData={[
                {
                  key: 'all',
                  title: '全部设施',
                  children: treeData
                }
              ]}
              defaultExpandedKeys={['all', ...expandedKeys]}
              selectedKeys={[selectedCategory]}
              onSelect={handleCategorySelect}
              showIcon={false}
            />
          </Card>
        </Col>

        {/* 右侧设施列表 */}
        <Col xs={24} lg={18}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>设施列表 ({filteredFacilities.length})</span>
                <Space>
                  <Text type="secondary">共 {filteredFacilities.length} 个设施</Text>
                </Space>
              </div>
            }
            size="small"
          >
            <Row gutter={[16, 16]}>
              {filteredFacilities.map(facility => (
                <Col xs={24} sm={12} lg={8} key={facility.id}>
                  <Card
                    size="small"
                    hoverable
                    cover={
                      facility.image ? (
                        <div style={{ height: 160, overflow: 'hidden' }}>
                          <Image
                            src={facility.image}
                            alt={facility.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            preview={false}
                          />
                        </div>
                      ) : (
                        <div style={{ 
                          height: 160, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5',
                          fontSize: 48,
                          color: '#d9d9d9'
                        }}>
                          {getFacilityIcon(facility.icon)}
                        </div>
                      )
                    }
                    actions={[
                      <Tooltip title="查看详情">
                        <EyeOutlined />
                      </Tooltip>,
                      <Tooltip title="编辑">
                        <EditOutlined onClick={() => handleEditFacility(facility)} />
                      </Tooltip>,
                      <Tooltip title="复制">
                        <CopyOutlined onClick={() => handleCopyFacility(facility)} />
                      </Tooltip>,
                      <Popconfirm
                        title="确定要删除这个设施吗？"
                        onConfirm={() => handleDeleteFacility(facility)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Tooltip title="删除">
                          <DeleteOutlined style={{ color: '#ff4d4f' }} />
                        </Tooltip>
                      </Popconfirm>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{facility.name}</span>
                          <div>
                            {facility.isStandard && (
                              <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>标准</Tag>
                            )}
                            {facility.isPremium && (
                              <Tag color="gold" style={{ fontSize: 10, margin: 0 }}>高级</Tag>
                            )}
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ fontSize: 12, color: '#666', marginBottom: 8, height: 32, overflow: 'hidden' }}>
                            {facility.description}
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            {facility.tags.slice(0, 3).map(tag => (
                              <Tag key={tag} style={{ fontSize: 10, margin: '0 2px 2px 0' }}>
                                {tag}
                              </Tag>
                            ))}
                            {facility.tags.length > 3 && (
                              <Tag style={{ fontSize: 10 }}>+{facility.tags.length - 3}</Tag>
                            )}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {getStatusBadge(facility.status)}
                            <Switch
                              size="small"
                              checked={facility.status === 'active'}
                              onChange={() => handleToggleStatus(facility)}
                            />
                          </div>
                          {facility.roomTypes.length > 0 && (
                            <div style={{ marginTop: 8, fontSize: 11, color: '#999' }}>
                              关联房型: {facility.roomTypes.length}个
                            </div>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {filteredFacilities.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <i className="fas fa-inbox" />
                </div>
                <div>暂无设施数据</div>
                <Button type="primary" style={{ marginTop: 16 }} onClick={handleAddFacility}>
                  添加第一个设施
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 添加设施模态框 */}
      <Modal
        title="添加设施"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设施名称" name="name" rules={[{ required: true, message: '请输入设施名称' }]}>
                <Input placeholder="请输入设施名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设施分类" name="category" rules={[{ required: true, message: '请选择设施分类' }]}>
                <Select placeholder="请选择设施分类">
                  {getCurrentCategoryTree().map(category => (
                    <Option key={category.key} value={category.key}>
                      {category.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="设施描述" name="description">
            <TextArea rows={3} placeholder="请输入设施描述" />
          </Form.Item>

          <Form.Item label="设施标签" name="tags">
            <Select mode="tags" placeholder="输入标签后按回车添加" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="关联房型" name="roomTypes">
                <Select mode="multiple" placeholder="选择关联房型">
                  <Option value="standard">标准大床房</Option>
                  <Option value="deluxe">豪华大床房</Option>
                  <Option value="twin">豪华双床房</Option>
                  <Option value="executive">行政套房</Option>
                  <Option value="suite">套房</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设施状态" name="status" initialValue="active">
                <Select>
                  <Option value="active">启用</Option>
                  <Option value="inactive">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isStandard" valuePropName="checked">
                <Checkbox>标准设施</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isPremium" valuePropName="checked">
                <Checkbox>高级设施</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Divider>设施规格</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="品牌" name={['specifications', 'brand']}>
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号" name={['specifications', 'model']}>
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="数量" name={['specifications', 'quantity']}>
                <Input type="number" placeholder="请输入数量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="单位" name={['specifications', 'unit']}>
                <Select placeholder="请选择单位">
                  <Option value="个">个</Option>
                  <Option value="台">台</Option>
                  <Option value="套">套</Option>
                  <Option value="张">张</Option>
                  <Option value="间">间</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button onClick={() => setAddModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑设施模态框 */}
      <Modal
        title="编辑设施"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          editForm.validateFields().then(values => {
            // 这里实现编辑逻辑
            message.success('设施信息更新成功');
            setEditModalVisible(false);
          });
        }}
        width={800}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设施名称" name="name" rules={[{ required: true, message: '请输入设施名称' }]}>
                <Input placeholder="请输入设施名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设施分类" name="category" rules={[{ required: true, message: '请选择设施分类' }]}>
                <Select placeholder="请选择设施分类">
                  {getCurrentCategoryTree().map(category => (
                    <Option key={category.key} value={category.key}>
                      {category.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="设施描述" name="description">
            <TextArea rows={3} placeholder="请输入设施描述" />
          </Form.Item>

          <Form.Item label="设施标签" name="tags">
            <Select mode="tags" placeholder="输入标签后按回车添加" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="关联房型" name="roomTypes">
                <Select mode="multiple" placeholder="选择关联房型">
                  <Option value="standard">标准大床房</Option>
                  <Option value="deluxe">豪华大床房</Option>
                  <Option value="twin">豪华双床房</Option>
                  <Option value="executive">行政套房</Option>
                  <Option value="suite">套房</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设施状态" name="status">
                <Select>
                  <Option value="active">启用</Option>
                  <Option value="inactive">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isStandard" valuePropName="checked">
                <Checkbox>标准设施</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isPremium" valuePropName="checked">
                <Checkbox>高级设施</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Divider>设施规格</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="品牌" name={['specifications', 'brand']}>
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号" name={['specifications', 'model']}>
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="数量" name={['specifications', 'quantity']}>
                <Input type="number" placeholder="请输入数量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="单位" name={['specifications', 'unit']}>
                <Select placeholder="请选择单位">
                  <Option value="个">个</Option>
                  <Option value="台">台</Option>
                  <Option value="套">套</Option>
                  <Option value="张">张</Option>
                  <Option value="间">间</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default FacilityManagement;
