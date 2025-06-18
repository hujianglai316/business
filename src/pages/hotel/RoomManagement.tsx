import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  Badge,
  Space,
  Image,
  Tag,
  Pagination,
  Modal,
  message,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface RoomType {
  id: string;
  name: string;
  roomTypeId: string;
  area: number;
  roomCount: number;
  bedType: string;
  maxOccupancy: number;
  status: 'enabled' | 'disabled';
  auditStatus: 'normal' | 'pending' | 'rejected';
  imageCount: number;
  coverImage: string;
  description?: string;
}

const RoomManagement: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      id: '1',
      name: '标准大床房',
      roomTypeId: 'DBL-001',
      area: 28,
      roomCount: 30,
      bedType: '1.8m大床',
      maxOccupancy: 2,
      status: 'enabled',
      auditStatus: 'normal',
      imageCount: 8,
      coverImage: 'https://placehold.co/300x200/e9ecef/495057?text=标准大床房'
    },
    {
      id: '2',
      name: '豪华双床房',
      roomTypeId: 'TWN-002',
      area: 32,
      roomCount: 20,
      bedType: '1.2m双床',
      maxOccupancy: 2,
      status: 'enabled',
      auditStatus: 'normal',
      imageCount: 6,
      coverImage: 'https://placehold.co/300x200/e9ecef/495057?text=豪华双床房'
    },
    {
      id: '3',
      name: '行政套房',
      roomTypeId: 'SUITE-003',
      area: 48,
      roomCount: 10,
      bedType: '1.8m大床',
      maxOccupancy: 2,
      status: 'disabled',
      auditStatus: 'pending',
      imageCount: 10,
      coverImage: 'https://placehold.co/300x200/e9ecef/495057?text=行政套房'
    },
    {
      id: '4',
      name: '家庭套房',
      roomTypeId: 'FAM-004',
      area: 56,
      roomCount: 5,
      bedType: '1.8m大床+1.2m单人床',
      maxOccupancy: 3,
      status: 'enabled',
      auditStatus: 'rejected',
      imageCount: 7,
      coverImage: 'https://placehold.co/300x200/e9ecef/495057?text=家庭套房'
    },
    {
      id: '5',
      name: '商务套房',
      roomTypeId: 'BUS-005',
      area: 42,
      roomCount: 15,
      bedType: '1.8m大床',
      maxOccupancy: 2,
      status: 'enabled',
      auditStatus: 'normal',
      imageCount: 9,
      coverImage: 'https://placehold.co/300x200/e9ecef/495057?text=商务套房'
    },
    {
      id: '6',
      name: '豪华大床房',
      roomTypeId: 'LUX-006',
      area: 35,
      roomCount: 25,
      bedType: '2.0m大床',
      maxOccupancy: 2,
      status: 'enabled',
      auditStatus: 'normal',
      imageCount: 12,
      coverImage: 'https://placehold.co/300x200/e9ecef/495057?text=豪华大床房'
    }
  ]);

  const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomType[]>(roomTypes);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingRoomType, setDeletingRoomType] = useState<RoomType | null>(null);

  useEffect(() => {
    setFilteredRoomTypes(roomTypes);
  }, [roomTypes]);

  const handleSearch = (values: any) => {
    setLoading(true);
    
    setTimeout(() => {
      let filtered = roomTypes;
      
      if (values.roomTypeName) {
        filtered = filtered.filter(room => room.name.includes(values.roomTypeName));
      }
      
      if (values.roomTypeId) {
        filtered = filtered.filter(room => room.roomTypeId.includes(values.roomTypeId));
      }
      
      if (values.roomStatus) {
        filtered = filtered.filter(room => room.status === values.roomStatus);
      }
      
      if (values.auditStatus) {
        filtered = filtered.filter(room => room.auditStatus === values.auditStatus);
      }
      
      setFilteredRoomTypes(filtered);
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    setFilteredRoomTypes(roomTypes);
    setCurrentPage(1);
  };

  const handleAddRoomType = () => {
    navigate('/hotel/add-room-type');
  };

  const handleViewDetail = (roomType: RoomType) => {
    navigate(`/hotel/room-detail/${roomType.id}`);
  };

  const handleEditRoomType = (roomType: RoomType) => {
    navigate(`/hotel/edit-room-type/${roomType.id}`);
  };

  const handleDeleteRoomType = (roomType: RoomType) => {
    setDeletingRoomType(roomType);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (deletingRoomType) {
      setRoomTypes(roomTypes.filter(room => room.id !== deletingRoomType.id));
      setFilteredRoomTypes(filteredRoomTypes.filter(room => room.id !== deletingRoomType.id));
      message.success('删除成功');
      setDeleteModalVisible(false);
      setDeletingRoomType(null);
    }
  };

  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      enabled: { color: 'success', text: '启用' },
      disabled: { color: 'error', text: '关闭' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge status={config.color as any} text={config.text} />;
  };

  const getAuditStatusTag = (auditStatus: string) => {
    const statusMap = {
      normal: { color: 'blue', text: '正常' },
      pending: { color: 'orange', text: '审核中' },
      rejected: { color: 'red', text: '不通过' }
    };
    const config = statusMap[auditStatus as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const paginatedRoomTypes = filteredRoomTypes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题和操作按钮 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>房型管理</h2>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRoomType}>
              添加房型
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ width: '100%' }}
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col md={6}>
              <Form.Item label="房型名称" name="roomTypeName">
                <Select placeholder="请选择房型名称" allowClear>
                  <Option value="">全部</Option>
                  <Option value="标准大床房">标准大床房</Option>
                  <Option value="豪华大床房">豪华大床房</Option>
                  <Option value="豪华双床房">豪华双床房</Option>
                  <Option value="行政套房">行政套房</Option>
                  <Option value="家庭套房">家庭套房</Option>
                  <Option value="商务套房">商务套房</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="房型ID" name="roomTypeId">
                <Input placeholder="请输入房型ID" />
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item label="房型状态" name="roomStatus">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="">全部</Option>
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">关闭</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item label="审核状态" name="auditStatus">
                <Select placeholder="请选择审核状态" allowClear>
                  <Option value="">全部</Option>
                  <Option value="normal">正常</Option>
                  <Option value="pending">审核中</Option>
                  <Option value="rejected">不通过</Option>
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
        </Form>
      </Card>

      {/* 房型列表 */}
      <Row gutter={[16, 16]}>
        {paginatedRoomTypes.map(roomType => (
          <Col key={roomType.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative' }}>
                  <Image
                    alt={roomType.name}
                    src={roomType.coverImage}
                    style={{ height: 200, objectFit: 'cover' }}
                    preview={false}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12
                    }}
                  >
                    <PictureOutlined style={{ marginRight: 4 }} />
                    {roomType.imageCount}张
                  </div>
                </div>
              }
              actions={[
                <Tooltip title="查看详情" key="view">
                  <EyeOutlined onClick={() => handleViewDetail(roomType)} />
                </Tooltip>,
                <Tooltip title="编辑" key="edit">
                  <EditOutlined onClick={() => handleEditRoomType(roomType)} />
                </Tooltip>,
                <Tooltip title="删除" key="delete">
                  <DeleteOutlined onClick={() => handleDeleteRoomType(roomType)} />
                </Tooltip>
              ]}
            >
              <Card.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{roomType.name}</span>
                    <Space>
                      {getStatusBadge(roomType.status)}
                      {getAuditStatusTag(roomType.auditStatus)}
                    </Space>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>房型ID:</span>
                          <span>{roomType.roomTypeId}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>面积:</span>
                          <span>{roomType.area}㎡</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>房间数:</span>
                          <span>{roomType.roomCount}间</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>床型:</span>
                          <span>{roomType.bedType}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>可住:</span>
                          <span>{roomType.maxOccupancy}人</span>
                        </div>
                      </Space>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 分页 */}
      {filteredRoomTypes.length > pageSize && (
        <Row justify="center" style={{ marginTop: 24 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredRoomTypes.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
          />
        </Row>
      )}

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除房型 "{deletingRoomType?.name}" 吗？</p>
        <p style={{ color: '#ff4d4f', fontSize: 12 }}>
          注意：删除后将无法恢复，请谨慎操作。
        </p>
      </Modal>
    </div>
  );
};

export default RoomManagement;
