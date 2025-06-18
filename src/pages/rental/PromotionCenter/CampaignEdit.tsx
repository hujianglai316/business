import React, { useState, useEffect } from 'react';
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
  Cascader,
  Spin,
  Tag
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AimOutlined, 
  FundOutlined, 
  ShoppingOutlined, 
  SettingOutlined, 
  CheckCircleOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { guangzhouLocations, LocationOption } from '../../../utils/locationData';
import moment from 'moment';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface CampaignData {
  id: string;
  name: string;
  type: string;
  dateRange: [string, string];
  budget: number;
  description: string;
}

// 活动编辑页面
const CampaignEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<any>(null);

  // 获取活动数据
  useEffect(() => {
    if (!id) return;
    
    // 模拟API调用
    setLoading(true);
    setTimeout(() => {
      // 模拟活动数据
      const mockData: CampaignData = {
        id,
        name: '示例推广活动',
        type: 'property',
        dateRange: ['2024-01-01', '2024-12-31'],
        budget: 10000,
        description: '这是一个示例推广活动的描述',
      };
      
      setCampaign(mockData);
      setFormData(mockData);
      form.setFieldsValue({
        ...mockData,
        dateRange: [dayjs(mockData.dateRange[0]), dayjs(mockData.dateRange[1])],
      });
      setLoading(false);
    }, 1000);
  }, [id, form]);

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
      const finalData = { ...formData, ...values, id };
      console.log('提交的数据:', finalData);
      
      // 这里应该调用API提交数据
      message.success('推广活动更新成功！');
      navigate('/rental/promotion');
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  // 取消编辑
  const handleCancel = () => {
          navigate(`/rental/promotion/detail/${id}`);
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
                name="name"
                rules={[{ required: true, message: '请输入活动名称' }]}
              >
                <Input placeholder="请输入活动名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="活动类型"
                name="type"
                rules={[{ required: true, message: '请选择活动类型' }]}
              >
                <Select>
                  <Option value="property">房源推广</Option>
                  <Option value="brand">品牌推广</Option>
                  <Option value="event">活动推广</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="活动时间"
                name="dateRange"
                rules={[{ required: true, message: '请选择活动时间' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="预算金额"
                name="budget"
                rules={[{ required: true, message: '请输入预算金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={100}
                  step={100}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined) => parseInt(value?.replace(/\¥\s?|(,*)/g, '') || '0') as any}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true, message: '请输入活动描述' }]}
          >
            <TextArea rows={4} placeholder="请输入活动描述" />
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
            <Input.TextArea 
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
            <div>
              {campaign && campaign.creativeAssets && campaign.creativeAssets.length > 0 ? (
                <div style={{ marginBottom: 16 }}>
                  <Text>当前已上传素材：</Text>
                  <div style={{ marginTop: 8 }}>
                    {campaign.creativeAssets.map((asset: string, index: number) => (
                      <Tag key={index} style={{ marginBottom: 8 }}>{asset}</Tag>
                    ))}
                  </div>
                </div>
              ) : null}
              
              <Alert
                message="上传功能待实现"
                description="请上传高质量的图片或视频素材，展示房源的最佳状态。"
                type="info"
                showIcon
              />
            </div>
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
            description="请确认以下信息无误，提交后活动将更新并重新进入审核状态。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Card title="活动信息摘要">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>活动名称: </Text>
                <Text>{formData.name}</Text>
              </Col>
              <Col span={12}>
                <Text strong>活动类型: </Text>
                <Text>{formData.type}</Text>
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
            description="活动更新成功后，系统将自动进行审核，一般1-2个工作日内完成。审核通过后，活动将按照设定时间自动开始。"
            type="warning"
            showIcon
            style={{ marginTop: 24 }}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px 0' }}>
        <Card loading={true}></Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <RollbackOutlined 
            onClick={handleCancel} 
            style={{ fontSize: 16, marginRight: 8, cursor: 'pointer' }}
          />
          <Title level={3} style={{ margin: 0 }}>编辑推广活动</Title>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
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
                  保存修改
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CampaignEdit; 