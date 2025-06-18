import React from 'react';
import { Form, Input, Button, Card, Switch, message } from 'antd';

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    message.success('设置已保存');
  };

  return (
    <div>
      <h2>系统设置</h2>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            companyName: '示例房产管理公司',
            contactPhone: '400-123-4567',
            email: 'contact@example.com',
            enableNotifications: true,
            enableAutoRenewal: false,
          }}
        >
          <Form.Item
            label="公司名称"
            name="companyName"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="contactPhone"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="联系邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入联系邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="启用通知提醒"
            name="enableNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="启用自动续租提醒"
            name="enableAutoRenewal"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 