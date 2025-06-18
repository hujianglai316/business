import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Avatar, Badge, Button, Space, Tag, Modal, Form, Input, message, List, Input as AntInput } from 'antd';
import { MessageOutlined, ClockCircleOutlined, CheckCircleOutlined, PlusOutlined, SettingOutlined, SendOutlined, PictureOutlined, AudioOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

interface Consultation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  propertyId: string;
  propertyName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'closed';
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  timestamp: string;
  status: 'sending' | 'sent' | 'read';
}

interface QuickReply {
  id: string;
  content: string;
}

const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [isQuickReplyModalVisible, setIsQuickReplyModalVisible] = useState(false);
  const [quickReplyForm] = Form.useForm();
  const [statistics, setStatistics] = useState({
    totalConsultations: 0,
    responseRate: 0,
    avgResponseTime: 0,
  });

  // 模拟获取咨询数据
  useEffect(() => {
    // 实际项目中应该从API获取数据
    const mockConsultations = [
      {
        id: 'C001',
        userId: 'U001',
        userName: '张三',
        userAvatar: 'https://example.com/avatar1.jpg',
        propertyId: 'P001',
        propertyName: '阳光花园 2室1厅',
        lastMessage: '请问这个房子还在出租吗？',
        lastMessageTime: '2024-03-15 14:30',
        unreadCount: 2,
        status: 'active' as const,
      },
      {
        id: 'C002',
        userId: 'U002',
        userName: '李四',
        userAvatar: 'https://example.com/avatar2.jpg',
        propertyId: 'P002',
        propertyName: '城市公寓 1室1厅',
        lastMessage: '好的，我考虑一下',
        lastMessageTime: '2024-03-15 13:20',
        unreadCount: 0,
        status: 'active' as const,
      },
      {
        id: 'C003',
        userId: 'U003',
        userName: '王五',
        userAvatar: 'https://example.com/avatar3.jpg',
        propertyId: 'P003',
        propertyName: '海珠花园 3室2厅',
        lastMessage: '这个房子可以养宠物吗？',
        lastMessageTime: '2024-03-15 12:15',
        unreadCount: 1,
        status: 'active' as const,
      },
      {
        id: 'C004',
        userId: 'U004',
        userName: '赵六',
        userAvatar: 'https://example.com/avatar4.jpg',
        propertyId: 'P004',
        propertyName: '天河公寓 2室1厅',
        lastMessage: '请问什么时候可以看房？',
        lastMessageTime: '2024-03-15 11:45',
        unreadCount: 0,
        status: 'active' as const,
      },
      {
        id: 'C005',
        userId: 'U005',
        userName: '钱七',
        userAvatar: 'https://example.com/avatar5.jpg',
        propertyId: 'P005',
        propertyName: '越秀花园 1室1厅',
        lastMessage: '这个价格可以商量吗？',
        lastMessageTime: '2024-03-15 10:30',
        unreadCount: 3,
        status: 'active' as const,
      },
      {
        id: 'C006',
        userId: 'U006',
        userName: '孙八',
        userAvatar: 'https://example.com/avatar6.jpg',
        propertyId: 'P006',
        propertyName: '白云公寓 3室1厅',
        lastMessage: '房子采光怎么样？',
        lastMessageTime: '2024-03-15 09:20',
        unreadCount: 0,
        status: 'active' as const,
      },
      {
        id: 'C007',
        userId: 'U007',
        userName: '周九',
        userAvatar: 'https://example.com/avatar7.jpg',
        propertyId: 'P007',
        propertyName: '荔湾花园 2室2厅',
        lastMessage: '附近有地铁站吗？',
        lastMessageTime: '2024-03-15 08:15',
        unreadCount: 1,
        status: 'active' as const,
      },
      {
        id: 'C008',
        userId: 'U008',
        userName: '吴十',
        userAvatar: 'https://example.com/avatar8.jpg',
        propertyId: 'P008',
        propertyName: '番禺公寓 4室2厅',
        lastMessage: '这个房子可以短租吗？',
        lastMessageTime: '2024-03-14 23:45',
        unreadCount: 0,
        status: 'active' as const,
      },
      {
        id: 'C009',
        userId: 'U009',
        userName: '郑十一',
        userAvatar: 'https://example.com/avatar9.jpg',
        propertyId: 'P009',
        propertyName: '黄埔花园 2室1厅',
        lastMessage: '房子还在出租吗？',
        lastMessageTime: '2024-03-14 22:30',
        unreadCount: 2,
        status: 'active' as const,
      },
      {
        id: 'C010',
        userId: 'U010',
        userName: '王十二',
        userAvatar: 'https://example.com/avatar10.jpg',
        propertyId: 'P010',
        propertyName: '南沙公寓 3室2厅',
        lastMessage: '好的，我明天去看房',
        lastMessageTime: '2024-03-14 21:15',
        unreadCount: 0,
        status: 'active' as const,
      }
    ];
    setConsultations(mockConsultations);
    setSelectedConsultation(mockConsultations[0]);

    // 模拟获取统计数据
    setStatistics({
      totalConsultations: 156,
      responseRate: 95.5,
      avgResponseTime: 2.5,
    });

    // 模拟获取快捷回复模板
    setQuickReplies([
      { id: 'QR001', content: '您好，这个房源还在出租中，请问您什么时候方便看房？' },
      { id: 'QR002', content: '感谢您的咨询，这个房源的具体信息如下：' },
    ]);
  }, []);

  // 模拟获取消息历史
  useEffect(() => {
    if (selectedConsultation) {
      // 实际项目中应该从API获取数据
      setMessages([
        {
          id: 'M001',
          senderId: selectedConsultation.userId,
          senderName: selectedConsultation.userName,
          senderAvatar: selectedConsultation.userAvatar,
          content: '请问这个房子还在出租吗？',
          type: 'text',
          timestamp: '2024-03-15 14:30',
          status: 'read',
        },
        {
          id: 'M002',
          senderId: 'S001',
          senderName: '客服',
          senderAvatar: 'https://example.com/avatar2.jpg',
          content: '您好，这个房源还在出租中，请问您什么时候方便看房？',
          type: 'text',
          timestamp: '2024-03-15 14:31',
          status: 'read',
        },
      ]);
    }
  }, [selectedConsultation]);

  const handleMarkAsRead = (consultationId: string) => {
    setConsultations(prev =>
      prev.map(item =>
        item.id === consultationId ? { ...item, unreadCount: 0 } : item
      )
    );
    message.success('已标记为已读');
  };

  const handleAddQuickReply = (values: { content: string }) => {
    const newQuickReply = {
      id: `QR${Date.now()}`,
      content: values.content,
    };
    setQuickReplies(prev => [...prev, newQuickReply]);
    setIsQuickReplyModalVisible(false);
    quickReplyForm.resetFields();
    message.success('添加快捷回复成功');
  };

  const handleDeleteQuickReply = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条快捷回复吗？',
      onOk: () => {
        setQuickReplies(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedConsultation) return;

    const newMessage: Message = {
      id: `M${Date.now()}`,
      senderId: 'S001',
      senderName: '客服',
      senderAvatar: 'https://example.com/avatar2.jpg',
      content: inputValue,
      type: 'text',
      timestamp: new Date().toLocaleString(),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // 更新咨询列表中的最后一条消息
    setConsultations(prev =>
      prev.map(item =>
        item.id === selectedConsultation.id
          ? { ...item, lastMessage: inputValue, lastMessageTime: newMessage.timestamp }
          : item
      )
    );

    // 模拟消息发送
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);
  };

  return (
    <div style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: 16 }}>租赁咨询管理</h2>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card size="small" bodyStyle={{ padding: '12px 24px' }}>
            <Statistic
              title="今日咨询量"
              value={statistics.totalConsultations}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" bodyStyle={{ padding: '12px 24px' }}>
            <Statistic
              title="回复率"
              value={statistics.responseRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" bodyStyle={{ padding: '12px 24px' }}>
            <Statistic
              title="平均回复时间"
              value={statistics.avgResponseTime}
              suffix="分钟"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主内容区域 */}
      <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
        {/* 左侧咨询列表 */}
        <Col span={8} style={{ height: '100%' }}>
          <Card
            title="咨询列表"
            extra={
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setIsQuickReplyModalVisible(true)}
              >
                快捷回复管理
              </Button>
            }
            style={{ height: '100%' }}
            bodyStyle={{ padding: 0, height: 'calc(100% - 57px)', overflow: 'auto' }}
          >
            <List
              dataSource={consultations}
              renderItem={item => (
                <List.Item
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedConsultation?.id === item.id ? '#f0f0f0' : 'transparent',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                  onClick={() => {
                    setSelectedConsultation(item);
                    if (item.unreadCount > 0) {
                      handleMarkAsRead(item.id);
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.userAvatar} />}
                    title={
                      <Space>
                        <span>{item.userName}</span>
                        {item.unreadCount > 0 && (
                          <Badge count={item.unreadCount} style={{ backgroundColor: '#52c41a' }} />
                        )}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <span style={{ color: '#666' }}>{item.propertyName}</span>
                        <span style={{ color: '#999', fontSize: '13px' }}>{item.lastMessage}</span>
                        <span style={{ fontSize: '12px', color: '#999' }}>{item.lastMessageTime}</span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 右侧聊天内容 */}
        <Col span={16} style={{ height: '100%' }}>
          {selectedConsultation ? (
            <Card style={{ height: '100%' }} bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              {/* 聊天头部 */}
              <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <Space>
                  <Avatar src={selectedConsultation.userAvatar} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{selectedConsultation.userName}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      咨询房源：{selectedConsultation.propertyName}
                    </div>
                  </div>
                </Space>
              </div>

              {/* 聊天内容区域 */}
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {messages.map(message => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      flexDirection: message.senderId === 'S001' ? 'row-reverse' : 'row',
                      marginBottom: '16px',
                    }}
                  >
                    <Avatar src={message.senderAvatar} style={{ margin: '0 8px' }} />
                    <div style={{ maxWidth: '70%' }}>
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: '#999' }}>{message.senderName}</span>
                        <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                          {message.timestamp}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          backgroundColor: message.senderId === 'S001' ? '#1890ff' : '#fff',
                          color: message.senderId === 'S001' ? '#fff' : '#000',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {message.content}
                      </div>
                      {message.senderId === 'S001' && (
                        <div style={{ textAlign: 'right', fontSize: 12, color: '#999', marginTop: 4 }}>
                          {message.status === 'sending' && '发送中...'}
                          {message.status === 'sent' && '已发送'}
                          {message.status === 'read' && '已读'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 输入区域 */}
              <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
                <TextArea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="请输入消息"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  onPressEnter={e => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  style={{ marginBottom: 8 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Button icon={<PictureOutlined />} />
                    <Button icon={<AudioOutlined />} />
                  </Space>
                  <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
                    发送
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ color: '#999' }}>请选择左侧的咨询对话</div>
            </Card>
          )}
        </Col>
      </Row>

      {/* 快捷回复管理弹窗 */}
      <Modal
        title="快捷回复管理"
        open={isQuickReplyModalVisible}
        onCancel={() => setIsQuickReplyModalVisible(false)}
        footer={null}
      >
        <Form form={quickReplyForm} onFinish={handleAddQuickReply}>
          <Form.Item
            name="content"
            rules={[{ required: true, message: '请输入快捷回复内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入快捷回复内容" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
              <Button onClick={() => setIsQuickReplyModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16 }}>
          <h4>现有快捷回复</h4>
          <List
            dataSource={quickReplies}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button type="link" danger onClick={() => handleDeleteQuickReply(item.id)}>
                    删除
                  </Button>,
                ]}
              >
                {item.content}
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Consultations; 