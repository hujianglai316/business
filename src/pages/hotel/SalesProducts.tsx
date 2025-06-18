import React, { useState } from 'react';
import { Card, Button, Switch, Badge, Form, Input, InputNumber, TimePicker, Modal, message, Space, Tag, Select, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, HomeOutlined, ClockCircleOutlined, CalendarOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

interface Product {
  id: string;
  type: 'daily' | 'hourly' | 'monthly';
  name: string;
  description: string;
  roomTypes: string[];
  status: 'active' | 'inactive';
  settings: ProductSettings;
  updateTime: string;
}

interface ProductSettings {
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
  breakfast?: boolean;
  minDuration?: number;
  maxDuration?: number;
  depositRequired?: boolean;
  utilityFees?: boolean;
  contractRequired?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  usagePeriod?: {
    start: string;
    end: string;
  };
}

const SalesProducts: React.FC = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // 模拟产品数据
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      type: 'daily',
      name: '日租房',
      description: '标准入住方式',
      roomTypes: ['标准大床房', '豪华双床房', '行政套房'],
      status: 'active',
      settings: {
        earlyCheckIn: true,
        lateCheckOut: true,
        breakfast: true,
        checkInTime: '14:00',
        checkOutTime: '12:00',
      },
      updateTime: '2024-03-15',
    },
    {
      id: '2',
      type: 'hourly',
      name: '钟点房',
      description: '短时间休息',
      roomTypes: ['标准大床房', '豪华双床房'],
      status: 'active',
      settings: {
        minDuration: 4,
        maxDuration: 8,
        usagePeriod: {
          start: '10:00',
          end: '18:00',
        },
      },
      updateTime: '2024-03-15',
    },
    {
      id: '3',
      type: 'monthly',
      name: '月租房',
      description: '长期居住',
      roomTypes: ['标准大床房'],
      status: 'inactive',
      settings: {
        depositRequired: true,
        utilityFees: true,
        contractRequired: true,
      },
      updateTime: '2024-03-15',
    },
  ]);

     // 产品类型配置
   const productTypeConfig = {
     daily: {
       icon: <HomeOutlined />,
       name: '日租房',
       color: '#1677ff',
       bgColor: '#e6f4ff',
     },
    hourly: {
      icon: <ClockCircleOutlined />,
      name: '钟点房',
      color: '#fa8c16',
      bgColor: '#fff7e6',
    },
    monthly: {
      icon: <CalendarOutlined />,
      name: '月租房',
      color: '#52c41a',
      bgColor: '#f6ffed',
    },
  };

  // 房型选项
  const roomTypeOptions = [
    { label: '标准大床房', value: '标准大床房' },
    { label: '豪华大床房', value: '豪华大床房' },
    { label: '豪华双床房', value: '豪华双床房' },
    { label: '行政套房', value: '行政套房' },
  ];

  // 处理产品状态切换
  const handleStatusToggle = (productId: string, status: boolean) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: status ? 'active' : 'inactive' }
        : product
    ));
    message.success(`产品${status ? '启用' : '禁用'}成功`);
  };

  // 处理产品设置切换
  const handleSettingToggle = (productId: string, settingKey: string, value: boolean) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            settings: { 
              ...product.settings, 
              [settingKey]: value 
            } 
          }
        : product
    ));
  };

  // 处理添加产品
  const handleAddProduct = () => {
    setCurrentProduct(null);
    form.resetFields();
    setIsAddModalVisible(true);
  };

  // 处理编辑产品
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    form.setFieldsValue({
      type: product.type,
      name: product.name,
      description: product.description,
      roomTypes: product.roomTypes,
      status: product.status,
      ...product.settings,
      checkInTime: product.settings.checkInTime ? dayjs(product.settings.checkInTime, 'HH:mm') : undefined,
      checkOutTime: product.settings.checkOutTime ? dayjs(product.settings.checkOutTime, 'HH:mm') : undefined,
      usagePeriodStart: product.settings.usagePeriod?.start ? dayjs(product.settings.usagePeriod.start, 'HH:mm') : undefined,
      usagePeriodEnd: product.settings.usagePeriod?.end ? dayjs(product.settings.usagePeriod.end, 'HH:mm') : undefined,
    });
    setIsEditModalVisible(true);
  };

  // 保存产品
  const handleSaveProduct = () => {
    form.validateFields().then(values => {
      const settings: ProductSettings = {
        earlyCheckIn: values.earlyCheckIn,
        lateCheckOut: values.lateCheckOut,
        breakfast: values.breakfast,
        minDuration: values.minDuration,
        maxDuration: values.maxDuration,
        depositRequired: values.depositRequired,
        utilityFees: values.utilityFees,
        contractRequired: values.contractRequired,
        checkInTime: values.checkInTime?.format('HH:mm'),
        checkOutTime: values.checkOutTime?.format('HH:mm'),
      };

      if (values.usagePeriodStart && values.usagePeriodEnd) {
        settings.usagePeriod = {
          start: values.usagePeriodStart.format('HH:mm'),
          end: values.usagePeriodEnd.format('HH:mm'),
        };
      }

      if (currentProduct) {
        // 编辑
        setProducts(prev => prev.map(p => 
          p.id === currentProduct.id 
            ? { 
                ...p, 
                type: values.type,
                name: values.name,
                description: values.description,
                roomTypes: values.roomTypes,
                status: values.status,
                settings,
                updateTime: dayjs().format('YYYY-MM-DD'),
              }
            : p
        ));
        message.success('产品更新成功');
        setIsEditModalVisible(false);
      } else {
        // 添加
        const newProduct: Product = {
          id: Date.now().toString(),
          type: values.type,
          name: values.name,
          description: values.description,
          roomTypes: values.roomTypes,
          status: values.status || 'active',
          settings,
          updateTime: dayjs().format('YYYY-MM-DD'),
        };
        setProducts(prev => [...prev, newProduct]);
        message.success('产品添加成功');
        setIsAddModalVisible(false);
      }
    });
  };

  // 渲染产品卡片
  const renderProductCard = (product: Product) => {
    const config = productTypeConfig[product.type];
    
    return (
      <Card
        key={product.id}
        style={{ marginBottom: 24 }}
        bodyStyle={{ padding: 0 }}
      >
        {/* 产品头部 */}
        <div style={{ 
          padding: 20, 
          backgroundColor: config.bgColor, 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              backgroundColor: config.color, 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: 20,
              marginRight: 16,
            }}>
              {config.icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, color: '#262626' }}>{product.name}</h3>
              <p style={{ margin: 0, color: '#8c8c8c', fontSize: 14 }}>{product.description}</p>
            </div>
          </div>
          <Badge 
            status={product.status === 'active' ? 'success' : 'default'} 
            text={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {product.status === 'active' ? <CheckCircleOutlined style={{ marginRight: 4 }} /> : <ExclamationCircleOutlined style={{ marginRight: 4 }} />}
                {product.status === 'active' ? '已启用' : '未启用'}
              </span>
            }
          />
        </div>

        {/* 产品内容 */}
        <div style={{ padding: 20 }}>
          {/* 适用房型 */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>适用房型</h4>
            <Space wrap>
              {product.roomTypes.map(roomType => (
                <Tag key={roomType} color="blue">{roomType}</Tag>
              ))}
            </Space>
          </div>

          {/* 产品规则 */}
          {product.type === 'daily' && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>入住规则</h4>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#595959' }}>
                <li>{product.settings.checkInTime}后入住</li>
                <li>次日{product.settings.checkOutTime}前退房</li>
              </ul>
            </div>
          )}

          {product.type === 'hourly' && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>使用时段</h4>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#fafafa', 
                padding: '8px 12px', 
                borderRadius: 6, 
                fontSize: 14,
                color: '#595959'
              }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {product.settings.usagePeriod?.start} 至 {product.settings.usagePeriod?.end}
              </div>
            </div>
          )}

          {product.type === 'monthly' && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>租期设置</h4>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#595959' }}>
                <li>最短1个月</li>
                <li>最长12个月</li>
              </ul>
            </div>
          )}

          {/* 产品设置 */}
          <div style={{ 
            backgroundColor: '#fafafa', 
            borderRadius: 8, 
            padding: 16,
            marginBottom: 16,
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>产品设置</h4>
            </div>
            
            <div style={{ display: 'grid', gap: 8 }}>
              {product.type === 'daily' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>允许提前入住</span>
                    <Switch 
                      size="small"
                      checked={product.settings.earlyCheckIn}
                      onChange={(checked) => handleSettingToggle(product.id, 'earlyCheckIn', checked)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>允许延迟退房</span>
                    <Switch 
                      size="small"
                      checked={product.settings.lateCheckOut}
                      onChange={(checked) => handleSettingToggle(product.id, 'lateCheckOut', checked)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>含早餐</span>
                    <Switch 
                      size="small"
                      checked={product.settings.breakfast}
                      onChange={(checked) => handleSettingToggle(product.id, 'breakfast', checked)}
                    />
                  </div>
                </>
              )}

              {product.type === 'hourly' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>最短时长</span>
                    <span style={{ fontSize: 13, color: '#8c8c8c' }}>{product.settings.minDuration}小时</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>最长时长</span>
                    <span style={{ fontSize: 13, color: '#8c8c8c' }}>{product.settings.maxDuration}小时</span>
                  </div>
                </>
              )}

              {product.type === 'monthly' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>收取押金</span>
                    <Switch 
                      size="small"
                      checked={product.settings.depositRequired}
                      onChange={(checked) => handleSettingToggle(product.id, 'depositRequired', checked)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>代收水电费</span>
                    <Switch 
                      size="small"
                      checked={product.settings.utilityFees}
                      onChange={(checked) => handleSettingToggle(product.id, 'utilityFees', checked)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>需要签订合同</span>
                    <Switch 
                      size="small"
                      checked={product.settings.contractRequired}
                      onChange={(checked) => handleSettingToggle(product.id, 'contractRequired', checked)}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ 
              marginTop: 12, 
              paddingTop: 12, 
              borderTop: '1px solid #e8e8e8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                最后更新：{product.updateTime}
              </span>
              <Space>
                <Switch 
                  checked={product.status === 'active'}
                  onChange={(checked) => handleStatusToggle(product.id, checked)}
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                  size="small"
                />
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<EditOutlined />}
                  onClick={() => handleEditProduct(product)}
                >
                  编辑设置
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>售卖产品</h2>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              管理和配置不同类型的售卖产品，包括日租房、钟点房、月租房等
            </p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
            添加产品
          </Button>
        </div>
      </div>

      {/* 产品列表 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
        {products.map(product => renderProductCard(product))}
      </div>

      {/* 添加产品模态框 */}
      <Modal
        title="添加产品"
        open={isAddModalVisible}
        onOk={handleSaveProduct}
        onCancel={() => setIsAddModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="产品类型"
            name="type"
            rules={[{ required: true, message: '请选择产品类型' }]}
          >
            <Select placeholder="选择产品类型">
              <Option value="daily">日租房</Option>
              <Option value="hourly">钟点房</Option>
              <Option value="monthly">月租房</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="产品名称"
            name="name"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="输入产品名称" />
          </Form.Item>

          <Form.Item
            label="产品描述"
            name="description"
          >
            <Input placeholder="输入产品描述" />
          </Form.Item>

          <Form.Item
            label="适用房型"
            name="roomTypes"
            rules={[{ required: true, message: '请选择适用房型' }]}
          >
            <Select mode="multiple" placeholder="选择适用房型">
              {roomTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              
              if (type === 'daily') {
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item label="入住时间" name="checkInTime">
                        <TimePicker format="HH:mm" placeholder="选择入住时间" />
                      </Form.Item>
                      <Form.Item label="退房时间" name="checkOutTime">
                        <TimePicker format="HH:mm" placeholder="选择退房时间" />
                      </Form.Item>
                    </div>
                    <Form.Item label="服务选项">
                      <Space direction="vertical">
                        <Form.Item name="earlyCheckIn" valuePropName="checked" noStyle>
                          <Checkbox>允许提前入住</Checkbox>
                        </Form.Item>
                        <Form.Item name="lateCheckOut" valuePropName="checked" noStyle>
                          <Checkbox>允许延迟退房</Checkbox>
                        </Form.Item>
                        <Form.Item name="breakfast" valuePropName="checked" noStyle>
                          <Checkbox>含早餐</Checkbox>
                        </Form.Item>
                      </Space>
                    </Form.Item>
                  </>
                );
              }
              
              if (type === 'hourly') {
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item label="最短时长" name="minDuration">
                        <InputNumber min={1} addonAfter="小时" placeholder="最短时长" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="最长时长" name="maxDuration">
                        <InputNumber min={1} addonAfter="小时" placeholder="最长时长" style={{ width: '100%' }} />
                      </Form.Item>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item label="使用开始时间" name="usagePeriodStart">
                        <TimePicker format="HH:mm" placeholder="开始时间" />
                      </Form.Item>
                      <Form.Item label="使用结束时间" name="usagePeriodEnd">
                        <TimePicker format="HH:mm" placeholder="结束时间" />
                      </Form.Item>
                    </div>
                  </>
                );
              }
              
              if (type === 'monthly') {
                return (
                  <Form.Item label="服务选项">
                    <Space direction="vertical">
                      <Form.Item name="depositRequired" valuePropName="checked" noStyle>
                        <Checkbox>收取押金</Checkbox>
                      </Form.Item>
                      <Form.Item name="utilityFees" valuePropName="checked" noStyle>
                        <Checkbox>代收水电费</Checkbox>
                      </Form.Item>
                      <Form.Item name="contractRequired" valuePropName="checked" noStyle>
                        <Checkbox>需要签订合同</Checkbox>
                      </Form.Item>
                    </Space>
                  </Form.Item>
                );
              }
              
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑产品模态框 */}
      <Modal
        title="编辑产品"
        open={isEditModalVisible}
        onOk={handleSaveProduct}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="产品类型"
            name="type"
            rules={[{ required: true, message: '请选择产品类型' }]}
          >
            <Select placeholder="选择产品类型">
              <Option value="daily">日租房</Option>
              <Option value="hourly">钟点房</Option>
              <Option value="monthly">月租房</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="产品名称"
            name="name"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="输入产品名称" />
          </Form.Item>

          <Form.Item
            label="产品描述"
            name="description"
          >
            <Input placeholder="输入产品描述" />
          </Form.Item>

          <Form.Item
            label="适用房型"
            name="roomTypes"
            rules={[{ required: true, message: '请选择适用房型' }]}
          >
            <Select mode="multiple" placeholder="选择适用房型">
              {roomTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              
              if (type === 'daily') {
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item label="入住时间" name="checkInTime">
                        <TimePicker format="HH:mm" placeholder="选择入住时间" />
                      </Form.Item>
                      <Form.Item label="退房时间" name="checkOutTime">
                        <TimePicker format="HH:mm" placeholder="选择退房时间" />
                      </Form.Item>
                    </div>
                    <Form.Item label="服务选项">
                      <Space direction="vertical">
                        <Form.Item name="earlyCheckIn" valuePropName="checked" noStyle>
                          <Checkbox>允许提前入住</Checkbox>
                        </Form.Item>
                        <Form.Item name="lateCheckOut" valuePropName="checked" noStyle>
                          <Checkbox>允许延迟退房</Checkbox>
                        </Form.Item>
                        <Form.Item name="breakfast" valuePropName="checked" noStyle>
                          <Checkbox>含早餐</Checkbox>
                        </Form.Item>
                      </Space>
                    </Form.Item>
                  </>
                );
              }
              
              if (type === 'hourly') {
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item label="最短时长" name="minDuration">
                        <InputNumber min={1} addonAfter="小时" placeholder="最短时长" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="最长时长" name="maxDuration">
                        <InputNumber min={1} addonAfter="小时" placeholder="最长时长" style={{ width: '100%' }} />
                      </Form.Item>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item label="使用开始时间" name="usagePeriodStart">
                        <TimePicker format="HH:mm" placeholder="开始时间" />
                      </Form.Item>
                      <Form.Item label="使用结束时间" name="usagePeriodEnd">
                        <TimePicker format="HH:mm" placeholder="结束时间" />
                      </Form.Item>
                    </div>
                  </>
                );
              }
              
              if (type === 'monthly') {
                return (
                  <Form.Item label="服务选项">
                    <Space direction="vertical">
                      <Form.Item name="depositRequired" valuePropName="checked" noStyle>
                        <Checkbox>收取押金</Checkbox>
                      </Form.Item>
                      <Form.Item name="utilityFees" valuePropName="checked" noStyle>
                        <Checkbox>代收水电费</Checkbox>
                      </Form.Item>
                      <Form.Item name="contractRequired" valuePropName="checked" noStyle>
                        <Checkbox>需要签订合同</Checkbox>
                      </Form.Item>
                    </Space>
                  </Form.Item>
                );
              }
              
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesProducts;
