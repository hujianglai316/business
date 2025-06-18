import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Select, DatePicker, message, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

const mockTenants = [
  {
    id: 'T001',
    name: '张三',
    phone: '138****5678',
    idNumber: '110101199001011234',
    gender: '男',
    status: '在租',
    property: '阳光花园 2室1厅',
    checkInDate: '2025-03-01',
    checkOutDate: '2026-03-01',
    rent: 5200,
    contractNo: 'HT2025001',
  },
  {
    id: 'T002',
    name: '李四',
    phone: '139****1234',
    idNumber: '110101199202023456',
    gender: '女',
    status: '即将到期',
    property: '城市公寓 1室1厅',
    checkInDate: '2024-05-01',
    checkOutDate: '2025-05-01',
    rent: 4200,
    contractNo: 'HT2025002',
  },
  {
    id: 'T003',
    name: '王五',
    phone: '137****9012',
    idNumber: '110101198805053333',
    gender: '男',
    status: '已退租',
    property: '海珠花园 3室2厅',
    checkInDate: '2023-03-01',
    checkOutDate: '2024-03-01',
    rent: 8000,
    contractNo: 'HT2024001',
  },
  {
    id: 'T004',
    name: '赵六',
    phone: '136****3456',
    idNumber: '110101199511116666',
    gender: '女',
    status: '在租',
    property: '天河公寓 2室1厅',
    checkInDate: '2025-01-15',
    checkOutDate: '2026-01-15',
    rent: 6000,
    contractNo: 'HT2025003',
  },
  {
    id: 'T005',
    name: '孙七',
    phone: '135****8888',
    idNumber: '110101199312127777',
    gender: '男',
    status: '在租',
    property: '绿地中心 1室0厅',
    checkInDate: '2025-02-01',
    checkOutDate: '2026-02-01',
    rent: 3500,
    contractNo: 'HT2025004',
  },
];

const TenantEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const safeId = (id || '').trim();
  const isNew = safeId === 'new';
  
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [form] = Form.useForm();

  // 获取租客数据（用于编辑模式）
  useEffect(() => {
    if (isNew) {
      // 新增模式：使用默认空值
      setFormValues({
        name: '',
        phone: '',
        idNumber: '',
        gender: '男',
        status: '在租',
        property: '',
        checkInDate: undefined,
        checkOutDate: undefined,
        rent: '',
        contractNo: '',
      });
    } else {
      // 编辑模式：获取并转换租客数据
      setLoading(true);
      // 模拟异步获取数据
      setTimeout(() => {
        const tenant = mockTenants.find(t => t.id === safeId);
        console.log('找到租客数据:', tenant);

        if (tenant) {
          const values = {
            ...tenant,
            checkInDate: tenant.checkInDate ? moment(tenant.checkInDate) : undefined,
            checkOutDate: tenant.checkOutDate ? moment(tenant.checkOutDate) : undefined,
          };
          console.log('设置表单值:', values);
          setFormValues(values);
        } else {
          message.error('找不到租客信息！');
          navigate('/rental/tenant');
        }
        setLoading(false);
      }, 100);
    }
  }, [safeId, isNew, navigate]);

  const handleFinish = (values: any) => {
    message.success('保存成功！');
          navigate('/rental/tenant');
  };

  // 数据未准备好时显示加载状态
  if (loading || formValues === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="加载租客数据..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <Card title={isNew ? '新增租客' : '编辑租客'}>
        <Form
          form={form}
          layout="vertical"
          initialValues={formValues}
          onFinish={handleFinish}
        >
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="身份证号" name="idNumber" rules={[{ required: true, message: '请输入身份证号' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="性别" name="gender" rules={[{ required: true }]}>
            <Select>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item label="入住状态" name="status" rules={[{ required: true }]}>
            <Select>
              <Option value="在租">在租</Option>
              <Option value="已退租">已退租</Option>
              <Option value="即将到期">即将到期</Option>
            </Select>
          </Form.Item>
          <Form.Item label="关联房源" name="property" rules={[{ required: true, message: '请输入关联房源' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="入住时间" name="checkInDate" rules={[{ required: true, message: '请选择入住时间' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="退租时间" name="checkOutDate" rules={[{ required: true, message: '请选择退租时间' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="租金(元/月)" name="rent" rules={[{ required: true, message: '请输入租金' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="合同编号" name="contractNo" rules={[{ required: true, message: '请输入合同编号' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => navigate('/rental/tenant')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TenantEdit; 