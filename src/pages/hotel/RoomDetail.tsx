import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Upload,
  Image,
  message,
  Row,
  Col,
  Descriptions,
  Tag,
  Badge,
  Switch,
  Checkbox,
  Modal,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  StarOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface RoomDetail {
  id: string;
  roomTypeId: string;
  roomTypeName: string;
  area: number;
  roomCount: number;
  bedType: string;
  capacity: number;
  breakfast: string;
  window: string;
  floor: string;
  status: 'active' | 'inactive';
  isRecommended: boolean;
  description: string;
  facilities: string[];
  basePrice: number;
  memberPrice: number;
  images: string[];
  createTime: string;
  updateTime: string;
}

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    loadRoomDetail();
  }, [id]);

  const loadRoomDetail = async () => {
    setLoading(true);
    
    // 模拟数据
    const mockDetail: RoomDetail = {
      id: id || 'room001',
      roomTypeId: 'DBL-001',
      roomTypeName: '标准大床房',
      area: 28,
      roomCount: 30,
      bedType: '1.8m*2.0m',
      capacity: 2,
      breakfast: '单早',
      window: '外窗',
      floor: '3-15层',
      status: 'active',
      isRecommended: true,
      description: '舒适温馨的标准大床房，配备齐全的现代化设施，为您提供舒适的住宿体验。房间采用现代简约设计风格，空间宽敞明亮。',
      facilities: ['air_conditioning', 'tv', 'wifi', 'private_bathroom', 'hot_water', 'hair_dryer'],
      basePrice: 399,
      memberPrice: 359,
      images: [
        'https://placehold.co/800x500/e9ecef/495057?text=房型主图',
        'https://placehold.co/800x500/e9ecef/495057?text=卫生间',
        'https://placehold.co/800x500/e9ecef/495057?text=客厅',
        'https://placehold.co/800x500/e9ecef/495057?text=阳台'
      ],
      createTime: '2023-01-15 10:30:00',
      updateTime: '2023-06-20 14:20:00'
    };

    setTimeout(() => {
      setRoomDetail(mockDetail);
      form.setFieldsValue(mockDetail);
      
      // 设置图片列表
      const images = mockDetail.images.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}.jpg`,
        status: 'done' as const,
        url: url,
      }));
      setFileList(images);
      setLoading(false);
    }, 1000);
  };

  const facilitiesMap = {
    air_conditioning: '空调',
    tv: '电视',
    wifi: '免费WiFi',
    private_bathroom: '独立卫浴',
    hot_water: '24小时热水',
    hair_dryer: '吹风机',
    toiletries: '洗漱用品',
    slippers: '拖鞋',
    refrigerator: '冰箱',
    safe: '保险箱',
    phone: '电话',
    desk: '书桌'
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('保存房型信息:', values);
      
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('房型信息保存成功！');
      setIsEditing(false);
      
      // 更新roomDetail
      setRoomDetail(prev => ({ ...prev!, ...values }));
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(roomDetail);
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || file.response?.url);
    setPreviewVisible(true);
  };

  const uploadProps = {
    fileList,
    listType: 'picture-card' as const,
    onPreview: handlePreview,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => setFileList(newFileList),
    disabled: !isEditing,
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!roomDetail) {
    return <div>房型不存在</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            {roomDetail.roomTypeName}
          </Title>
          <Tag color={roomDetail.status === 'active' ? 'green' : 'red'}>
            {roomDetail.status === 'active' ? '启用' : '关闭'}
          </Tag>
          {roomDetail.isRecommended && (
            <Tag color="gold" icon={<StarOutlined />}>
              推荐房型
            </Tag>
          )}
        </Space>
        
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">
            房型ID: {roomDetail.roomTypeId} | 创建时间: {roomDetail.createTime} | 更新时间: {roomDetail.updateTime}
          </Text>
        </div>

        <div style={{ marginTop: 16 }}>
          {!isEditing ? (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              编辑房型
            </Button>
          ) : (
            <Space>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                保存
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Space>
          )}
        </div>
      </div>

      <Row gutter={24}>
        {/* 左侧：房型图片 */}
        <Col span={8}>
          <Card title="房型图片">
            <Upload {...uploadProps}>
              {isEditing && fileList.length < 8 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
            
            {!isEditing && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">共 {fileList.length} 张图片</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* 右侧：房型信息 */}
        <Col span={16}>
          <Form form={form} layout="vertical" disabled={!isEditing}>
            {/* 基本信息 */}
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="房型ID" name="roomTypeId">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label="房型名称" 
                    name="roomTypeName"
                    rules={[{ required: true, message: '请输入房型名称' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item 
                    label="面积" 
                    name="area"
                    rules={[{ required: true, message: '请输入面积' }]}
                  >
                    <InputNumber
                      min={1}
                      max={999}
                      addonAfter="m²"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="房间数量" 
                    name="roomCount"
                    rules={[{ required: true, message: '请输入房间数量' }]}
                  >
                    <InputNumber
                      min={1}
                      max={999}
                      addonAfter="间"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="可住人数" 
                    name="capacity"
                    rules={[{ required: true, message: '请输入可住人数' }]}
                  >
                    <InputNumber
                      min={1}
                      max={10}
                      addonAfter="人"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="床型" 
                    name="bedType"
                    rules={[{ required: true, message: '请选择床型' }]}
                  >
                    <Select>
                      <Option value="1.8m*2.0m">1.8m×2.0m大床</Option>
                      <Option value="1.5m*2.0m">1.5m×2.0m大床</Option>
                      <Option value="1.2m*2.0m">1.2m×2.0m单床</Option>
                      <Option value="2.0*2.0大床">2.0m×2.0m超大床</Option>
                      <Option value="双单床">双单床</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="早餐" name="breakfast">
                    <Select>
                      <Option value="无早">无早餐</Option>
                      <Option value="单早">单人早餐</Option>
                      <Option value="双早">双人早餐</Option>
                      <Option value="含早">含早餐</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="窗户" name="window">
                    <Select>
                      <Option value="外窗">外窗</Option>
                      <Option value="内窗">内窗</Option>
                      <Option value="无窗">无窗</Option>
                      <Option value="对通道">对通道</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="楼层" name="floor">
                    <Input placeholder="例如：3-15层" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="房型状态" name="status">
                    <Select>
                      <Option value="active">启用</Option>
                      <Option value="inactive">关闭</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="推荐房型" name="isRecommended" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item label="房型描述" name="description">
                <TextArea
                  rows={4}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Card>

            {/* 房间设施 */}
            <Card title="房间设施" style={{ marginBottom: 16 }}>
              <Form.Item name="facilities">
                <Checkbox.Group>
                  <Row gutter={[16, 16]}>
                    {Object.entries(facilitiesMap).map(([key, label]) => (
                      <Col span={6} key={key}>
                        <Checkbox value={key}>{label}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Card>

            {/* 价格信息 */}
            <Card title="价格信息">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="基础价格" 
                    name="basePrice"
                    rules={[{ required: true, message: '请输入基础价格' }]}
                  >
                    <InputNumber
                      min={1}
                      precision={2}
                      addonBefore="¥"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="会员价格" name="memberPrice">
                    <InputNumber
                      min={1}
                      precision={2}
                      addonBefore="¥"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Col>
      </Row>

      {/* 图片预览模态框 */}
      <Modal
        open={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <Image
          alt="预览"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default RoomDetail;
