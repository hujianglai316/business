import React, { useState } from 'react';
import { Form, Input, Button, Card, Steps, Radio, DatePicker, InputNumber, message } from 'antd';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Step } = Steps;
const { RangePicker } = DatePicker;

const CampaignCreator: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleNext = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      message.success('推广活动创建成功！');
      navigate('/rental/promotion');
    });
  };

  const steps = [
    {
      title: '基本信息',
      content: (
        <>
          <Form.Item
            label="活动名称"
            name="name"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input placeholder="如：阳光花园首页推广" />
          </Form.Item>
          
          <Form.Item
            label="推广目标"
            name="objective"
            rules={[{ required: true, message: '请选择推广目标' }]}
          >
            <Radio.Group>
              <Radio value="exposure">提升曝光</Radio>
              <Radio value="click">提升点击</Radio>
              <Radio value="appointment">提升预约</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            label="活动时间"
            name="dateRange"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <RangePicker />
          </Form.Item>
        </>
      ),
    },
    {
      title: '预算与出价',
      content: (
        <>
          <Form.Item
            label="总预算"
            name="budget"
            rules={[{ required: true, message: '请输入预算' }]}
          >
            <InputNumber min={100} step={100} style={{ width: 200 }} addonAfter="元" />
          </Form.Item>
          
          <Form.Item
            label="计费方式"
            name="bidType"
            rules={[{ required: true, message: '请选择计费方式' }]}
          >
            <Radio.Group>
              <Radio value="cpm">CPM（千次曝光）</Radio>
              <Radio value="cpc">CPC（点击）</Radio>
              <Radio value="cpa">CPA（预约）</Radio>
            </Radio.Group>
          </Form.Item>
        </>
      ),
    },
    {
      title: '确认提交',
      content: (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p>请确认所有信息无误后提交。</p>
        </div>
      ),
    },
  ];

  return (
    <Card title="创建推广活动">
      <Steps current={current} style={{ marginBottom: 30 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{ objective: 'exposure', bidType: 'cpc' }}
      >
        <div className="steps-content">{steps[current].content}</div>
        
        <div className="steps-action" style={{ marginTop: 24, textAlign: 'right' }}>
          {current > 0 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrev}>
              <RollbackOutlined /> 上一步
            </Button>
          )}
          
          {current < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          )}
          
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleSubmit}>
              <SaveOutlined /> 提交
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};

export default CampaignCreator; 