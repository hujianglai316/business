import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Space,
  List,
  Modal,
  message,
  Tabs,
  Switch,
  InputNumber,
  Select,
  Divider,
  Tag,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  SettingOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

interface ReplyTemplate {
  id: string;
  title: string;
  content: string;
  type: 'positive' | 'negative' | 'neutral';
  createTime: string;
  updateTime: string;
  usageCount: number;
}

interface ReviewSetting {
  id: string;
  name: string;
  value: any;
  description: string;
  type: 'switch' | 'number' | 'select';
  options?: { label: string; value: any }[];
}

const ReviewSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
  const [settings, setSettings] = useState<ReviewSetting[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReplyTemplate | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTemplates();
    loadSettings();
  }, []);

  const loadTemplates = () => {
    const mockTemplates: ReplyTemplate[] = [
      {
        id: '1',
        title: '好评感谢',
        content: '感谢您的好评！我们很高兴能为您提供满意的住宿体验。您的认可是对我们最大的鼓励，我们会继续努力提供更好的服务。欢迎您再次光临！',
        type: 'positive',
        createTime: '2024-03-20 10:30:00',
        updateTime: '2024-03-20 10:30:00',
        usageCount: 128
      },
      {
        id: '2',
        title: '差评致歉',
        content: '非常抱歉给您带来不愉快的体验。感谢您的反馈，这对我们改进服务非常重要。我们会认真处理您提到的问题，努力提供更好的服务。',
        type: 'negative',
        createTime: '2024-03-20 10:30:00',
        updateTime: '2024-03-20 10:30:00',
        usageCount: 45
      },
      {
        id: '3',
        title: '建议回复',
        content: '感谢您的评价和建议。关于您提到的问题，我们会认真对待并积极改进。希望下次能为您提供更好的服务体验。',
        type: 'neutral',
        createTime: '2024-03-20 10:30:00',
        updateTime: '2024-03-20 10:30:00',
        usageCount: 67
      },
      {
        id: '4',
        title: '设施说明',
        content: '感谢您的评价。关于您提到的设施问题，我们正在不断完善和升级。如有任何需要帮助的地方，请随时联系前台工作人员。',
        type: 'neutral',
        createTime: '2024-03-20 10:30:00',
        updateTime: '2024-03-20 10:30:00',
        usageCount: 23
      }
    ];
    setTemplates(mockTemplates);
  };

  const loadSettings = () => {
    const mockSettings: ReviewSetting[] = [
      {
        id: 'auto_reply',
        name: '自动回复',
        value: false,
        description: '开启后将自动使用模板回复新评价',
        type: 'switch'
      },
      {
        id: 'reply_time_limit',
        name: '回复时间限制',
        value: 24,
        description: '收到评价后必须在指定时间内回复（小时）',
        type: 'number'
      },
      {
        id: 'low_score_alert',
        name: '低分预警',
        value: true,
        description: '当收到低分评价时发送通知',
        type: 'switch'
      },
      {
        id: 'alert_score_threshold',
        name: '预警分数阈值',
        value: 3,
        description: '低于此分数将触发预警通知',
        type: 'number'
      },
      {
        id: 'review_display',
        name: '评价展示方式',
        value: 'all',
        description: '选择在房间详情页面显示的评价类型',
        type: 'select',
        options: [
          { label: '全部评价', value: 'all' },
          { label: '仅好评', value: 'positive' },
          { label: '好评和中评', value: 'positive_neutral' }
        ]
      },
      {
        id: 'enable_photo_review',
        name: '图片评价',
        value: true,
        description: '允许客人在评价中上传图片',
        type: 'switch'
      }
    ];
    setSettings(mockSettings);
  };

  const getTemplateTypeTag = (type: ReplyTemplate['type']) => {
    const typeMap = {
      positive: { color: 'green', text: '好评模板', icon: <CheckCircleOutlined /> },
      negative: { color: 'red', text: '差评模板', icon: <ExclamationCircleOutlined /> },
      neutral: { color: 'blue', text: '通用模板', icon: <MessageOutlined /> }
    };
    const config = typeMap[type];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTemplate = (template: ReplyTemplate) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      title: template.title,
      content: template.content,
      type: template.type
    });
    setModalVisible(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    message.success('模板删除成功');
  };

  const handleSubmitTemplate = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingTemplate) {
        // 编辑模板
        setTemplates(prev => prev.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, ...values, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
            : t
        ));
        message.success('模板更新成功');
      } else {
        // 新增模板
        const newTemplate: ReplyTemplate = {
          id: `template_${Date.now()}`,
          ...values,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          usageCount: 0
        };
        setTemplates(prev => [newTemplate, ...prev]);
        message.success('模板创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleSettingChange = (settingId: string, value: any) => {
    setSettings(prev => prev.map(s => 
      s.id === settingId ? { ...s, value } : s
    ));
    message.success('设置已保存');
  };

  const renderTemplateList = () => (
    <List
      itemLayout="vertical"
      dataSource={templates}
      renderItem={(template) => (
        <List.Item
          actions={[
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditTemplate(template)}
            >
              编辑
            </Button>,
            <Popconfirm
              title="确定要删除这个模板吗？"
              onConfirm={() => handleDeleteTemplate(template.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          ]}
        >
          <List.Item.Meta
            title={
              <Space>
                <Text strong>{template.title}</Text>
                {getTemplateTypeTag(template.type)}
                <Tag color="purple">使用 {template.usageCount} 次</Tag>
              </Space>
            }
            description={
              <div>
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                  style={{ marginBottom: 8 }}
                >
                  {template.content}
                </Paragraph>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  创建时间：{template.createTime} | 最后更新：{template.updateTime}
                </Text>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  const renderSettings = () => (
    <Space direction="vertical" style={{ width: '100%' }}>
      {settings.map(setting => (
        <Card key={setting.id} size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Text strong>{setting.name}</Text>
              <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                {setting.description}
              </div>
            </div>
            <div style={{ marginLeft: 16 }}>
              {setting.type === 'switch' && (
                <Switch
                  checked={setting.value}
                  onChange={(checked) => handleSettingChange(setting.id, checked)}
                />
              )}
              {setting.type === 'number' && (
                <InputNumber
                  value={setting.value}
                  min={1}
                  max={setting.id === 'alert_score_threshold' ? 5 : 168}
                  onChange={(value) => handleSettingChange(setting.id, value)}
                  style={{ width: 100 }}
                />
              )}
              {setting.type === 'select' && (
                <Select
                  value={setting.value}
                  onChange={(value) => handleSettingChange(setting.id, value)}
                  style={{ width: 150 }}
                >
                  {setting.options?.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          </div>
        </Card>
      ))}
    </Space>
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>评价管理设置</Title>
        <Text type="secondary">管理评价回复模板和相关设置，提高客户服务效率</Text>
      </div>

      <Tabs defaultActiveKey="templates">
        <TabPane 
          tab={
            <span>
              <MessageOutlined />
              快捷回复模板
            </span>
          } 
          key="templates"
        >
          <Card 
            title="回复模板管理"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddTemplate}
              >
                新建模板
              </Button>
            }
          >
            {renderTemplateList()}
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              评价设置
            </span>
          } 
          key="settings"
        >
          <Card title="评价管理设置">
            {renderSettings()}
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <StarOutlined />
              统计分析
            </span>
          } 
          key="analytics"
        >
          <Card title="评价统计">
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <StarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <div>评价统计功能开发中...</div>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* 模板编辑模态框 */}
      <Modal
        title={editingTemplate ? '编辑回复模板' : '新建回复模板'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmitTemplate}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="模板名称"
            name="title"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>

          <Form.Item
            label="模板类型"
            name="type"
            rules={[{ required: true, message: '请选择模板类型' }]}
          >
            <Select placeholder="请选择模板类型">
              <Option value="positive">
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  好评模板
                </Space>
              </Option>
              <Option value="negative">
                <Space>
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                  差评模板
                </Space>
              </Option>
              <Option value="neutral">
                <Space>
                  <MessageOutlined style={{ color: '#1890ff' }} />
                  通用模板
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="模板内容"
            name="content"
            rules={[
              { required: true, message: '请输入模板内容' },
              { min: 10, message: '模板内容至少10个字符' },
              { max: 500, message: '模板内容不能超过500个字符' }
            ]}
          >
            <TextArea 
              rows={6} 
              placeholder="请输入回复模板内容"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewSettings;
