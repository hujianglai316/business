import React, { useState } from 'react';
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
  message,
  Row,
  Col,
  Divider,
  Checkbox,
  Switch,
  Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  InboxOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const AddRoomType: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const bedTypeOptions = [
    { label: '1.8m×2.0m大床', value: '1.8m*2.0m' },
    { label: '1.5m×2.0m大床', value: '1.5m*2.0m' },
    { label: '1.2m×2.0m单床', value: '1.2m*2.0m' },
    { label: '2.0m×2.0m超大床', value: '2.0*2.0大床' },
    { label: '双单床', value: '双单床' },
    { label: '上下铺', value: '上下铺' }
  ];

  const breakfastOptions = [
    { label: '无早餐', value: '无早' },
    { label: '单人早餐', value: '单早' },
    { label: '双人早餐', value: '双早' },
    { label: '含早餐', value: '含早' }
  ];

  const windowOptions = [
    { label: '外窗', value: '外窗' },
    { label: '内窗', value: '内窗' },
    { label: '无窗', value: '无窗' },
    { label: '对通道', value: '对通道' },
    { label: '落地窗', value: '落地窗' }
  ];

  const facilitiesOptions = [
    { label: '空调', value: 'air_conditioning' },
    { label: '电视', value: 'tv' },
    { label: '免费WiFi', value: 'wifi' },
    { label: '独立卫浴', value: 'private_bathroom' },
    { label: '24小时热水', value: 'hot_water' },
    { label: '吹风机', value: 'hair_dryer' },
    { label: '洗漱用品', value: 'toiletries' },
    { label: '拖鞋', value: 'slippers' },
    { label: '冰箱', value: 'refrigerator' },
    { label: '保险箱', value: 'safe' },
    { label: '电话', value: 'phone' },
    { label: '书桌', value: 'desk' }
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const roomTypeData = {
        ...values,
        images: fileList.map(file => file.url || file.response?.url).filter(Boolean),
        createTime: new Date().toISOString()
      };

      console.log('新增房型数据:', roomTypeData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('房型添加成功！');
      navigate('/hotel/room-management');
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过2MB！');
        return false;
      }
      return false; // 阻止自动上传
    },
    onChange: (info) => {
      const { fileList: newFileList } = info;
      setFileList(newFileList);
    },
    onDrop: (e) => {
      console.log('Dropped files', e.dataTransfer.files);
    },
    listType: 'picture-card',
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleCancel}
          >
            返回
          </Button>
          <Title level={3} style={{ margin: 0 }}>新增房型</Title>
        </Space>
        <Text type="secondary" style={{ marginLeft: 40 }}>
          请填写房型信息，带 * 号的为必填项
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'active',
          breakfast: '无早',
          window: '外窗',
          facilities: ['air_conditioning', 'tv', 'wifi', 'private_bathroom']
        }}
      >
        <Row gutter={24}>
          {/* 左侧：房型图片 */}
          <Col span={8}>
            <Card title="房型图片" style={{ height: 'fit-content' }}>
              <Form.Item
                name="images"
                rules={[{ required: true, message: '请至少上传一张房型图片' }]}
              >
                <Dragger {...uploadProps} style={{ minHeight: 200 }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽上传图片</p>
                  <p className="ant-upload-hint">
                    支持jpg、png格式，单张大小不超过2M
                  </p>
                </Dragger>
              </Form.Item>
              
              <Alert
                message="图片上传提示"
                description="建议上传高清的房型图片，第一张图片将作为房型主图展示"
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>

          {/* 右侧：基本信息 */}
          <Col span={16}>
            <Card title="基本信息">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="房型ID"
                    name="roomTypeId"
                    rules={[{ required: true, message: '请输入房型ID' }]}
                  >
                    <Input placeholder="请输入房型ID" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="房型名称"
                    name="roomTypeName"
                    rules={[{ required: true, message: '请输入房型名称' }]}
                  >
                    <Input placeholder="请输入房型名称" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="面积"
                    name="area"
                    rules={[{ required: true, message: '请输入房间面积' }]}
                  >
                    <InputNumber
                      min={1}
                      max={999}
                      addonAfter="m²"
                      placeholder="面积"
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
                      placeholder="数量"
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
                      placeholder="人数"
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
                    <Select placeholder="请选择床型">
                      {bedTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="早餐" name="breakfast">
                    <Select>
                      {breakfastOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="窗户" name="window">
                    <Select>
                      {windowOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="楼层" name="floor">
                    <Input placeholder="例如：3-15层" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="房型状态" name="status">
                    <Select>
                      <Option value="active">启用</Option>
                      <Option value="inactive">关闭</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="推荐房型" name="isRecommended" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="房型描述" name="description">
                <TextArea
                  rows={4}
                  placeholder="请输入房型描述，包括房间特色、设施等信息"
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Card>

            {/* 房间设施 */}
            <Card title="房间设施" style={{ marginTop: 16 }}>
              <Form.Item
                name="facilities"
                rules={[{ required: true, message: '请至少选择一项设施' }]}
              >
                <Checkbox.Group>
                  <Row gutter={[16, 16]}>
                    {facilitiesOptions.map(facility => (
                      <Col span={6} key={facility.value}>
                        <Checkbox value={facility.value}>
                          {facility.label}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Card>

            {/* 价格信息 */}
            <Card title="价格信息" style={{ marginTop: 16 }}>
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
                      placeholder="0.00"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="会员价格"
                    name="memberPrice"
                  >
                    <InputNumber
                      min={1}
                      precision={2}
                      addonBefore="¥"
                      placeholder="0.00"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Alert
                message="价格说明"
                description="基础价格为房型的标准价格，会员价格为会员专享价格（可选）"
                type="info"
                showIcon
              />
            </Card>

            {/* 操作按钮 */}
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>
                  取消
                </Button>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={handleSubmit}
                >
                  保存房型
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddRoomType;
