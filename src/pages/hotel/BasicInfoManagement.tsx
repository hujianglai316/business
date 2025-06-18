import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  Radio,
  Upload,
  message,
  Modal,
  Space,
  Badge,
  Image,
  DatePicker,
  InputNumber,
  Typography
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  StarOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface HotelInfo {
  name: string;
  merchantId: string;
  phone: string;
  manager: string;
  address: string;
  openDate: string;
  renovationDate: string;
  hotelType: string;
  roomCount: number;
  floorCount: number;
  hotelLevel: string;
  operationStatus: string;
  description: string;
  licenseNumber: string;
}

interface HotelHighlight {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const BasicInfoManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>({
    name: '瞬寻酒店（北京朝阳店）',
    merchantId: 'SX10086',
    phone: '010-88888888',
    manager: '张经理',
    address: '北京市朝阳区建国路88号',
    openDate: '2020-01-01',
    renovationDate: '2022-06-15',
    hotelType: '连锁',
    roomCount: 120,
    floorCount: 15,
    hotelLevel: '商务型',
    operationStatus: 'operating',
    description: '瞬寻酒店（北京朝阳店）位于北京市朝阳区建国路商圈，地理位置优越，交通便利。酒店装修典雅现代，设施齐全，服务周到，是商务出行的理想选择。',
    licenseNumber: '91110105MA12345678'
  });

  const [highlights, setHighlights] = useState<HotelHighlight[]>([
    {
      id: '1',
      icon: 'environment',
      title: '优越位置',
      description: '位于市中心商圈，交通便利'
    },
    {
      id: '2',
      icon: 'wifi',
      title: '免费WiFi',
      description: '全酒店覆盖高速无线网络'
    }
  ]);

  const [frontImageList, setFrontImageList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'front.jpg',
      status: 'done',
      url: 'https://placehold.co/300x200/e9ecef/495057?text=门头照片',
    }
  ]);

  const [licenseImageList, setLicenseImageList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'license.jpg',
      status: 'done',
      url: 'https://placehold.co/300x200/e9ecef/495057?text=营业执照',
    }
  ]);

  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [highlightModalVisible, setHighlightModalVisible] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<HotelHighlight | null>(null);

  const getIconComponent = (iconType: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      environment: <EnvironmentOutlined />,
      wifi: <WifiOutlined />,
      car: <CarOutlined />,
      coffee: <CoffeeOutlined />,
      star: <StarOutlined />
    };
    return iconMap[iconType] || <StarOutlined />;
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...hotelInfo,
      openDate: dayjs(hotelInfo.openDate),
      renovationDate: dayjs(hotelInfo.renovationDate)
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const updatedInfo = {
        ...values,
        openDate: values.openDate.format('YYYY-MM-DD'),
        renovationDate: values.renovationDate.format('YYYY-MM-DD')
      };
      setHotelInfo(updatedInfo);
      setIsEditing(false);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败，请检查输入信息');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleAddHighlight = () => {
    setEditingHighlight(null);
    setHighlightModalVisible(true);
  };

  const handleEditHighlight = (highlight: HotelHighlight) => {
    setEditingHighlight(highlight);
    setHighlightModalVisible(true);
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id));
    message.success('删除成功');
  };

  const handleHighlightSubmit = (values: any) => {
    if (editingHighlight) {
      setHighlights(highlights.map(h => 
        h.id === editingHighlight.id 
          ? { ...h, ...values }
          : h
      ));
      message.success('修改成功');
    } else {
      const newHighlight: HotelHighlight = {
        id: Date.now().toString(),
        ...values
      };
      setHighlights([...highlights, newHighlight]);
      message.success('添加成功');
    }
    setHighlightModalVisible(false);
  };

  const renderViewMode = () => (
    <Row gutter={[16, 16]}>
      <Col md={12}>
        <Card title="基础信息" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">酒店名称：</Text>
              <Text strong>{hotelInfo.name}</Text>
            </div>
            <div>
              <Text type="secondary">酒店商户号：</Text>
              <Text strong>{hotelInfo.merchantId}</Text>
            </div>
            <div>
              <Text type="secondary">联系电话：</Text>
              <Text strong>{hotelInfo.phone}</Text>
            </div>
            <div>
              <Text type="secondary">负责人：</Text>
              <Text strong>{hotelInfo.manager}</Text>
            </div>
            <div>
              <Text type="secondary">酒店地址：</Text>
              <Text strong>{hotelInfo.address}</Text>
            </div>
          </Space>
        </Card>
      </Col>

      <Col md={12}>
        <Card title="营业信息" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">开业时间：</Text>
              <Text strong>{hotelInfo.openDate}</Text>
            </div>
            <div>
              <Text type="secondary">装修时间：</Text>
              <Text strong>{hotelInfo.renovationDate}</Text>
            </div>
            <div>
              <Text type="secondary">酒店类型：</Text>
              <Text strong>{hotelInfo.hotelType}</Text>
            </div>
            <div>
              <Text type="secondary">房间数量：</Text>
              <Text strong>{hotelInfo.roomCount}</Text>
            </div>
            <div>
              <Text type="secondary">楼层数：</Text>
              <Text strong>{hotelInfo.floorCount}</Text>
            </div>
            <div>
              <Text type="secondary">酒店等级：</Text>
              <Text strong>{hotelInfo.hotelLevel}</Text>
            </div>
            <div>
              <Text type="secondary">营业状态：</Text>
              <Badge 
                status={hotelInfo.operationStatus === 'operating' ? 'success' : 'warning'} 
                text={hotelInfo.operationStatus === 'operating' ? '营业中' : '暂停营业'} 
              />
            </div>
          </Space>
        </Card>
      </Col>

      <Col span={24}>
        <Card 
          title="酒店亮点" 
          size="small"
          extra={
            <Button 
              type="primary" 
              size="small" 
              icon={<PlusOutlined />}
              onClick={handleAddHighlight}
            >
              添加亮点
            </Button>
          }
        >
          <Row gutter={[16, 16]}>
            {highlights.map(highlight => (
              <Col md={12} key={highlight.id}>
                <Card 
                  size="small" 
                  style={{ height: '100%' }}
                  actions={[
                    <EditOutlined key="edit" onClick={() => handleEditHighlight(highlight)} />,
                    <DeleteOutlined key="delete" onClick={() => handleDeleteHighlight(highlight.id)} />
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <div style={{ 
                        width: 48, 
                        height: 48, 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        color: '#1890ff'
                      }}>
                        {getIconComponent(highlight.icon)}
                      </div>
                    }
                    title={highlight.title}
                    description={highlight.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );

  const renderEditMode = () => (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col md={12}>
          <Card title="基础信息" size="small">
            <Form.Item label="酒店名称" name="name" rules={[{ required: true, message: '请输入酒店名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="酒店商户号" name="merchantId">
              <Input disabled />
            </Form.Item>
            <Form.Item label="联系电话" name="phone" rules={[{ required: true, message: '请输入联系电话' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="负责人" name="manager" rules={[{ required: true, message: '请输入负责人' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="酒店地址" name="address" rules={[{ required: true, message: '请输入酒店地址' }]}>
              <Input.Group compact>
                <Input style={{ width: 'calc(100% - 100px)' }} />
                <Button 
                  icon={<EnvironmentOutlined />}
                  onClick={() => setMapModalVisible(true)}
                >
                  选择位置
                </Button>
              </Input.Group>
            </Form.Item>
          </Card>
        </Col>

        <Col md={12}>
          <Card title="营业信息" size="small">
            <Row gutter={[8, 0]}>
              <Col span={12}>
                <Form.Item label="开业时间" name="openDate">
                  <DatePicker style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="装修时间" name="renovationDate">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="房间数量" name="roomCount">
                  <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="楼层数" name="floorCount">
                  <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="营业状态" name="operationStatus">
                  <Radio.Group>
                    <Radio value="operating">营业中</Radio>
                    <Radio value="suspended">暂停营业</Radio>
                    <Radio value="renovation">装修中</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Form>
  );

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="酒店基本信息"
        extra={
          <Space>
            {!isEditing ? (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                编辑
              </Button>
            ) : (
              <>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  loading={loading}
                  onClick={handleSave}
                >
                  保存
                </Button>
                <Button icon={<CloseOutlined />} onClick={handleCancel}>
                  取消
                </Button>
              </>
            )}
          </Space>
        }
      >
        {isEditing ? renderEditMode() : renderViewMode()}
      </Card>

      <Modal
        title="选择酒店位置"
        open={mapModalVisible}
        onCancel={() => setMapModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setMapModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={() => setMapModalVisible(false)}>
            确认位置
          </Button>
        ]}
      >
        <div style={{ 
          height: 400, 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #d9d9d9'
        }}>
          <Text type="secondary">地图组件将在这里加载</Text>
        </div>
      </Modal>

      <Modal
        title={editingHighlight ? "编辑亮点" : "添加亮点"}
        open={highlightModalVisible}
        onCancel={() => setHighlightModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingHighlight || undefined}
          onFinish={handleHighlightSubmit}
        >
          <Form.Item label="图标" name="icon" rules={[{ required: true, message: '请选择图标' }]}>
            <Select placeholder="选择图标">
              <Option value="environment">位置</Option>
              <Option value="wifi">WiFi</Option>
              <Option value="car">停车</Option>
              <Option value="coffee">服务</Option>
              <Option value="star">特色</Option>
            </Select>
          </Form.Item>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入亮点标题" />
          </Form.Item>
          <Form.Item label="描述" name="description" rules={[{ required: true, message: '请输入描述' }]}>
            <Input placeholder="请输入亮点描述" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingHighlight ? '保存' : '添加'}
              </Button>
              <Button onClick={() => setHighlightModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BasicInfoManagement;
