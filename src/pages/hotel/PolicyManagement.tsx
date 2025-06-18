import React, { useState } from 'react';
import { Card, Button, Radio, Space, Tag, Modal, Form, Input, Select, message, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface Policy {
  id: string;
  type: string;
  title: string;
  content: string;
  roomTypes: string[];
  status: 'active' | 'inactive';
  updateTime: string;
}

const PolicyManagement: React.FC = () => {
  const [selectedPolicyType, setSelectedPolicyType] = useState('all');
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(['all']);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);
  const [form] = Form.useForm();

  // 模拟政策数据
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      type: 'checkinout',
      title: '入住/离店政策',
      content: '入住时间：14:00 - 24:00\n离店时间：00:00 - 12:00\n超时每小时收取50元费用',
      roomTypes: ['all'],
      status: 'active',
      updateTime: '2024-03-15',
    },
    {
      id: '2',
      type: 'cancellation',
      title: '取消政策',
      content: '入住前24小时可免费取消，24小时内取消收取首晚房费。',
      roomTypes: ['标准大床房'],
      status: 'active',
      updateTime: '2024-03-15',
    },
    {
      id: '3',
      type: 'breakfast',
      title: '早餐政策',
      content: '早餐供应时间：6:30-10:00，含双早，额外早餐收费￥88/位。',
      roomTypes: ['all'],
      status: 'active',
      updateTime: '2024-03-15',
    },
    {
      id: '4',
      type: 'children',
      title: '儿童与加床政策',
      content: '12岁以下儿童免费，不占床。加床费用：￥150/晚，最多可加1张床。',
      roomTypes: ['all'],
      status: 'active',
      updateTime: '2024-03-15',
    },
    {
      id: '5',
      type: 'pet',
      title: '宠物政策',
      content: '不接受携带宠物入住。',
      roomTypes: ['all'],
      status: 'active',
      updateTime: '2024-03-15',
    },
    {
      id: '6',
      type: 'deposit',
      title: '押金政策',
      content: '入住时需支付￥500押金，退房时无损坏将全额退还。',
      roomTypes: ['all'],
      status: 'active',
      updateTime: '2024-03-15',
    },
  ]);

  // 政策类型配置
  const policyTypes = [
    { key: 'all', label: '全部', color: 'default' },
    { key: 'checkinout', label: '入住/离店政策', color: 'blue' },
    { key: 'children', label: '儿童与加床政策', color: 'green' },
    { key: 'pet', label: '宠物政策', color: 'orange' },
    { key: 'deposit', label: '押金政策', color: 'purple' },
    { key: 'breakfast', label: '早餐政策', color: 'cyan' },
    { key: 'foreign', label: '外宾接待政策', color: 'magenta' },
    { key: 'parking', label: '停车政策', color: 'volcano' },
    { key: 'special', label: '特殊条款', color: 'gold' },
  ];

  // 房型选项
  const roomTypeOptions = [
    { label: '全部房型', value: 'all' },
    { label: '标准大床房', value: '标准大床房' },
    { label: '豪华大床房', value: '豪华大床房' },
    { label: '豪华双床房', value: '豪华双床房' },
    { label: '行政套房', value: '行政套房' },
  ];

  // 过滤政策
  const filteredPolicies = policies.filter(policy => {
    const typeMatch = selectedPolicyType === 'all' || policy.type === selectedPolicyType;
    const roomTypeMatch = selectedRoomTypes.includes('all') || 
      policy.roomTypes.some(roomType => 
        roomType === 'all' || selectedRoomTypes.includes(roomType)
      );
    return typeMatch && roomTypeMatch;
  });

  // 获取政策类型标签
  const getPolicyTypeLabel = (type: string) => {
    return policyTypes.find(pt => pt.key === type)?.label || type;
  };

  const getPolicyTypeColor = (type: string) => {
    return policyTypes.find(pt => pt.key === type)?.color || 'default';
  };

  // 处理添加政策
  const handleAddPolicy = () => {
    setCurrentPolicy(null);
    form.resetFields();
    setIsAddModalVisible(true);
  };

  // 处理编辑政策
  const handleEditPolicy = (policy: Policy) => {
    setCurrentPolicy(policy);
    form.setFieldsValue({
      type: policy.type,
      title: policy.title,
      content: policy.content,
      roomTypes: policy.roomTypes,
      status: policy.status,
    });
    setIsEditModalVisible(true);
  };

  // 处理删除政策
  const handleDeletePolicy = (policy: Policy) => {
    setCurrentPolicy(policy);
    setIsDeleteModalVisible(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (currentPolicy) {
      setPolicies(prev => prev.filter(p => p.id !== currentPolicy.id));
      message.success('政策删除成功');
      setIsDeleteModalVisible(false);
    }
  };

  // 保存政策
  const handleSavePolicy = () => {
    form.validateFields().then(values => {
      if (currentPolicy) {
        // 编辑
        setPolicies(prev => prev.map(p => 
          p.id === currentPolicy.id 
            ? { ...p, ...values, updateTime: dayjs().format('YYYY-MM-DD') }
            : p
        ));
        message.success('政策更新成功');
        setIsEditModalVisible(false);
      } else {
        // 添加
        const newPolicy: Policy = {
          id: Date.now().toString(),
          ...values,
          updateTime: dayjs().format('YYYY-MM-DD'),
        };
        setPolicies(prev => [...prev, newPolicy]);
        message.success('政策添加成功');
        setIsAddModalVisible(false);
      }
    });
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0 }}>政策信息管理</h2>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              管理酒店各类政策信息，包括入住离店、取消、早餐、儿童加床等政策
            </p>
          </div>
          <Space>
            <Button icon={<HistoryOutlined />}>
              操作日志
            </Button>
            <Button icon={<FileTextOutlined />}>
              政策模板
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPolicy}>
              添加政策
            </Button>
          </Space>
        </div>

        {/* 政策类型筛选 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Radio.Group
            value={selectedPolicyType}
            onChange={(e) => setSelectedPolicyType(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space wrap>
              {policyTypes.map(type => (
                <Radio.Button key={type.key} value={type.key}>
                  {type.label}
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>
        </Card>

        {/* 房型筛选 */}
        <Card title="房型筛选" size="small">
          <Checkbox.Group
            options={roomTypeOptions}
            value={selectedRoomTypes}
            onChange={setSelectedRoomTypes}
          />
        </Card>
      </div>

      {/* 政策列表 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 }}>
        {filteredPolicies.map(policy => (
          <Card
            key={policy.id}
            size="small"
            style={{ height: 'fit-content' }}
            actions={[
              <Button
                key="edit"
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditPolicy(policy)}
              >
                编辑
              </Button>,
              <Button
                key="delete"
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeletePolicy(policy)}
              >
                删除
              </Button>,
            ]}
          >
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: 16, marginBottom: 8 }}>{policy.title}</h4>
              <Space style={{ marginBottom: 8 }}>
                <Tag color={getPolicyTypeColor(policy.type)}>
                  {getPolicyTypeLabel(policy.type)}
                </Tag>
                {policy.roomTypes.includes('all') ? (
                  <Tag color="blue">所有房型</Tag>
                ) : (
                  policy.roomTypes.map(roomType => (
                    <Tag key={roomType} color="blue">{roomType}</Tag>
                  ))
                )}
              </Space>
            </div>
            
            <div style={{ fontSize: 14, lineHeight: '1.6', marginBottom: 12, whiteSpace: 'pre-line' }}>
              {policy.content}
            </div>
            
            <div style={{ fontSize: 12, color: '#999', textAlign: 'right' }}>
              最后更新：{policy.updateTime}
            </div>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredPolicies.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ color: '#999', fontSize: 16, marginBottom: 16 }}>
            暂无符合条件的政策
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPolicy}>
            添加政策
          </Button>
        </Card>
      )}

      {/* 添加政策模态框 */}
      <Modal
        title="添加政策"
        open={isAddModalVisible}
        onOk={handleSavePolicy}
        onCancel={() => setIsAddModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="政策类型"
            name="type"
            rules={[{ required: true, message: '请选择政策类型' }]}
          >
            <Select placeholder="选择政策类型">
              {policyTypes.filter(type => type.key !== 'all').map(type => (
                <Option key={type.key} value={type.key}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="政策标题"
            name="title"
            rules={[{ required: true, message: '请输入政策标题' }]}
          >
            <Input placeholder="输入政策标题" />
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

          <Form.Item
            label="政策内容"
            name="content"
            rules={[{ required: true, message: '请输入政策内容' }]}
          >
            <TextArea
              rows={6}
              placeholder="输入详细的政策内容，支持换行"
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            initialValue="active"
          >
            <Radio.Group>
              <Radio value="active">启用</Radio>
              <Radio value="inactive">禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑政策模态框 */}
      <Modal
        title="编辑政策"
        open={isEditModalVisible}
        onOk={handleSavePolicy}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="政策类型"
            name="type"
            rules={[{ required: true, message: '请选择政策类型' }]}
          >
            <Select placeholder="选择政策类型">
              {policyTypes.filter(type => type.key !== 'all').map(type => (
                <Option key={type.key} value={type.key}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="政策标题"
            name="title"
            rules={[{ required: true, message: '请输入政策标题' }]}
          >
            <Input placeholder="输入政策标题" />
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

          <Form.Item
            label="政策内容"
            name="content"
            rules={[{ required: true, message: '请输入政策内容' }]}
          >
            <TextArea
              rows={6}
              placeholder="输入详细的政策内容，支持换行"
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
          >
            <Radio.Group>
              <Radio value="active">启用</Radio>
              <Radio value="inactive">禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认模态框 */}
      <Modal
        title="确认删除"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除政策"{currentPolicy?.title}"吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default PolicyManagement; 