import React, { useState } from 'react';
import { 
  Steps, 
  Button, 
  Form, 
  Input, 
  Radio, 
  Select, 
  InputNumber, 
  Card, 
  Row, 
  Col, 
  Typography, 
  DatePicker, 
  Space, 
  Divider, 
  Alert,
  message,
  Cascader
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  AimOutlined, 
  FundOutlined, 
  ShoppingOutlined, 
  SettingOutlined, 
  CheckCircleOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { guangzhouLocations, LocationOption } from '../../../utils/locationData';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 活动创建页面
const CampaignCreate: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({});

  // 步骤完成处理
  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrent(current + 1);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 返回上一步
  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };
      console.log('提交的数据:', finalData);
      
      // 这里应该调用API提交数据
      message.success('推广活动创建成功！');
      navigate('/rental/promotion');
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  // 取消创建
  const handleCancel = () => {
          navigate('/rental/promotion');
  };

  // 步骤内容
  const steps = [
    {
      title: '基本信息',
      icon: <AimOutlined />,
      content: (
        <Form
          form={form}
          layout="vertical"
          initialValues={formData}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="活动名称"
                name="campaignName"
                rules={[{ required: true, message: '请输入活动名称' }]}
              >
                <Input placeholder="请输入便于识别的活动名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="活动目标"
                name="campaignGoal"
                rules={[{ required: true, message: '请选择活动目标' }]}
              >
                <Select placeholder="请选择活动目标">
                  <Option value="exposure">提高曝光量</Option>
                  <Option value="clicks">增加点击量</Option>
                  <Option value="appointments">增加预约量</Option>
                  <Option value="contracts">增加签约量</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="推广房源类型"
                name="propertyType"
                rules={[{ required: true, message: '请选择推广房源类型' }]}
              >
                <Radio.Group>
                  <Radio value="all">全部房源</Radio>
                  <Radio value="selected">指定房源</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="活动时间"
                name="campaignPeriod"
                rules={[{ required: true, message: '请选择活动时间' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.propertyType !== currentValues.propertyType}
          >
            {({ getFieldValue }) => 
              getFieldValue('propertyType') === 'selected' ? (
                <Form.Item
                  label="选择房源"
                  name="selectedProperties"
                  rules={[{ required: true, message: '请选择至少一个房源' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择房源"
                    style={{ width: '100%' }}
                  >
                    <Option value="property1">豪华三居室 - 市中心</Option>
                    <Option value="property2">精装两居室 - 高新区</Option>
                    <Option value="property3">复式公寓 - 滨江新区</Option>
                    <Option value="property4">经济单间 - 大学城</Option>
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '投放设置',
      icon: <FundOutlined />,
      content: (
        <Form
          form={form}
          layout="vertical"
          initialValues={formData}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="每日预算"
                name="dailyBudget"
                rules={[{ required: true, message: '请设置每日预算' }]}
              >
                <InputNumber
                  min={50}
                  max={10000}
                  prefix="￥"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="出价策略"
                name="biddingStrategy"
                rules={[{ required: true, message: '请选择出价策略' }]}
              >
                <Select placeholder="请选择出价策略">
                  <Option value="auto">智能出价（推荐）</Option>
                  <Option value="manual">手动出价</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.biddingStrategy !== currentValues.biddingStrategy}
          >
            {({ getFieldValue }) => 
              getFieldValue('biddingStrategy') === 'manual' ? (
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="曝光出价"
                      name="impressionBid"
                      rules={[{ required: true, message: '请设置曝光出价' }]}
                    >
                      <InputNumber
                        min={0.1}
                        max={100}
                        prefix="￥"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="点击出价"
                      name="clickBid"
                      rules={[{ required: true, message: '请设置点击出价' }]}
                    >
                      <InputNumber
                        min={0.5}
                        max={200}
                        prefix="￥"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                <Alert
                  message="智能出价说明"
                  description="系统将根据您的预算和目标，自动调整出价以最大化广告效果。"
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )
            }
          </Form.Item>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="投放平台"
                name="platforms"
                rules={[{ required: true, message: '请选择至少一个投放平台' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择投放平台"
                >
                  <Option value="wechat">微信小程序</Option>
                  <Option value="website">官方网站</Option>
                  <Option value="app">APP内推广</Option>
                  <Option value="search">搜索引擎</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="投放时段"
                name="schedules"
                rules={[{ required: true, message: '请选择投放时段' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择投放时段"
                >
                  <Option value="morning">早上 (6:00-12:00)</Option>
                  <Option value="afternoon">下午 (12:00-18:00)</Option>
                  <Option value="evening">晚上 (18:00-24:00)</Option>
                  <Option value="night">凌晨 (0:00-6:00)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      title: '受众定向',
      icon: <ShoppingOutlined />,
      content: (
        <Form
          form={form}
          layout="vertical"
          initialValues={formData}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="地理位置"
                name="locations"
                rules={[{ required: true, message: '请选择地理位置' }]}
                tooltip="可选择地铁站或商圈进行精准定位"
              >
                <Cascader
                  options={guangzhouLocations}
                  multiple
                  maxTagCount="responsive"
                  placeholder="请选择地理位置"
                  showSearch={{
                    filter: (inputValue: string, path: LocationOption[]) => {
                      return path.some(option => 
                        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                      );
                    }
                  }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="年龄段"
                name="ageRanges"
                rules={[{ required: true, message: '请选择年龄段' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择年龄段"
                >
                  <Option value="18-24">18-24岁</Option>
                  <Option value="25-34">25-34岁</Option>
                  <Option value="35-44">35-44岁</Option>
                  <Option value="45-54">45-54岁</Option>
                  <Option value="55+">55岁以上</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="性别"
                name="gender"
              >
                <Radio.Group>
                  <Radio value="all">不限</Radio>
                  <Radio value="male">男性</Radio>
                  <Radio value="female">女性</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="兴趣爱好"
                name="interests"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择兴趣爱好（可选）"
                >
                  <Option value="travel">旅游</Option>
                  <Option value="finance">金融投资</Option>
                  <Option value="education">教育</Option>
                  <Option value="realestate">房产</Option>
                  <Option value="luxury">奢侈品</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="收入水平"
            name="incomeLevel"
          >
            <Select placeholder="请选择收入水平（可选）">
              <Option value="low">5000元以下</Option>
              <Option value="medium-low">5000-10000元</Option>
              <Option value="medium">10000-20000元</Option>
              <Option value="medium-high">20000-30000元</Option>
              <Option value="high">30000元以上</Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '创意设置',
      icon: <SettingOutlined />,
      content: (
        <Form
          form={form}
          layout="vertical"
          initialValues={formData}
        >
          <Form.Item
            label="创意标题"
            name="creativeTitle"
            rules={[{ required: true, message: '请输入创意标题' }]}
          >
            <Input placeholder="请输入吸引用户的创意标题" />
          </Form.Item>
          
          <Form.Item
            label="创意描述"
            name="creativeDescription"
            rules={[{ required: true, message: '请输入创意描述' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入创意描述，展示房源亮点和优势" 
            />
          </Form.Item>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="展示形式"
                name="displayFormat"
                rules={[{ required: true, message: '请选择展示形式' }]}
              >
                <Radio.Group>
                  <Radio value="image">图片广告</Radio>
                  <Radio value="video">视频广告</Radio>
                  <Radio value="carousel">轮播广告</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="行动号召"
                name="callToAction"
                rules={[{ required: true, message: '请选择行动号召按钮文字' }]}
              >
                <Select placeholder="请选择行动号召按钮文字">
                  <Option value="view">查看详情</Option>
                  <Option value="book">立即预约</Option>
                  <Option value="contact">联系经纪人</Option>
                  <Option value="save">收藏房源</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="上传素材"
            name="creativeAssets"
            tooltip="建议上传多张高清图片，尺寸比例16:9"
            rules={[{ required: true, message: '请上传创意素材' }]}
          >
            <Alert
              message="上传功能待实现"
              description="请上传高质量的图片或视频素材，展示房源的最佳状态。"
              type="info"
              showIcon
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '确认提交',
      icon: <CheckCircleOutlined />,
      content: (
        <div>
          <Alert
            message="确认提交"
            description="请确认以下信息无误，提交后活动将进入审核状态。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Card title="活动信息摘要">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>活动名称: </Text>
                <Text>{formData.campaignName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>活动目标: </Text>
                <Text>{
                  formData.campaignGoal === 'exposure' ? '提高曝光量' :
                  formData.campaignGoal === 'clicks' ? '增加点击量' :
                  formData.campaignGoal === 'appointments' ? '增加预约量' :
                  formData.campaignGoal === 'contracts' ? '增加签约量' : ''
                }</Text>
              </Col>
              <Col span={12}>
                <Text strong>每日预算: </Text>
                <Text>￥{formData.dailyBudget}</Text>
              </Col>
              <Col span={12}>
                <Text strong>出价策略: </Text>
                <Text>{formData.biddingStrategy === 'auto' ? '智能出价' : '手动出价'}</Text>
              </Col>
              <Col span={24}>
                <Text strong>创意标题: </Text>
                <Text>{formData.creativeTitle}</Text>
              </Col>
              <Col span={24}>
                <Text strong>创意描述: </Text>
                <Text>{formData.creativeDescription}</Text>
              </Col>
            </Row>
          </Card>
          
          <Divider />
          
          <Alert
            message="提示"
            description="活动创建成功后，系统将自动进行审核，一般1-2个工作日内完成。审核通过后，活动将按照设定时间自动开始。"
            type="warning"
            showIcon
            style={{ marginTop: 24 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <RollbackOutlined 
            onClick={handleCancel} 
            style={{ fontSize: 16, marginRight: 8, cursor: 'pointer' }}
          />
          <Title level={3} style={{ margin: 0 }}>创建推广活动</Title>
        </div>
        
        <Steps
          current={current}
          items={steps.map(item => ({
            title: item.title,
            icon: item.icon,
          }))}
          style={{ marginBottom: 32 }}
        />
        
        <div style={{ marginTop: 24 }}>
          {steps[current].content}
        </div>
        
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          {current > 0 && (
            <Button onClick={handlePrevious}>
              上一步
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={handleNext} style={{ marginLeft: 'auto' }}>
              下一步
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 'auto' }}>
              提交
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CampaignCreate; 