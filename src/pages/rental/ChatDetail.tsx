import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Avatar, Space, Row, Col, List, Modal, message } from 'antd';
import { SendOutlined, PictureOutlined, AudioOutlined, SmileOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { TextArea } = Input;

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

interface ChatInfo {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
}

const ChatDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isQuickReplyModalVisible, setIsQuickReplyModalVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout>();

  // 模拟获取聊天信息
  useEffect(() => {
    // 实际项目中应该从API获取数据
    setChatInfo({
      id: id || '',
      userId: 'U001',
      userName: '张三',
      userAvatar: 'https://example.com/avatar1.jpg',
      propertyId: 'P001',
      propertyName: '阳光花园 2室1厅',
      propertyImage: 'https://example.com/property1.jpg',
    });

    // 模拟获取消息历史
    setMessages([
      {
        id: 'M001',
        senderId: 'U001',
        senderName: '张三',
        senderAvatar: 'https://example.com/avatar1.jpg',
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
  }, [id]);

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

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

    // 模拟消息发送
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error('图片大小不能超过5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newMessage: Message = {
        id: `M${Date.now()}`,
        senderId: 'S001',
        senderName: '客服',
        senderAvatar: 'https://example.com/avatar2.jpg',
        content: e.target?.result as string,
        type: 'image',
        timestamp: new Date().toLocaleString(),
        status: 'sending',
      };

      setMessages(prev => [...prev, newMessage]);
    };
    reader.readAsDataURL(file);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 60) {
          handleStopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    // 这里应该处理录音文件的上传
    message.success('录音已保存');
  };

  const handleQuickReply = (content: string) => {
    setInputValue(content);
    setIsQuickReplyModalVisible(false);
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* 聊天头部 */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle">
          <Col span={16}>
            <Space>
              <Avatar src={chatInfo?.userAvatar} />
              <div>
                <div>{chatInfo?.userName}</div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  咨询房源：{chatInfo?.propertyName}
                </div>
              </div>
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button onClick={() => navigate('/rental/consultation')}>返回列表</Button>
          </Col>
        </Row>
      </Card>

      {/* 聊天内容区域 */}
      <Card style={{ flex: 1, overflow: 'auto', marginBottom: 16 }}>
        <List
          dataSource={messages}
          renderItem={message => (
            <List.Item>
              <div style={{ width: '100%', display: 'flex', flexDirection: message.senderId === 'S001' ? 'row-reverse' : 'row' }}>
                <Avatar src={message.senderAvatar} style={{ margin: '0 8px' }} />
                <div style={{ maxWidth: '70%' }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#999' }}>{message.senderName}</span>
                    <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>{message.timestamp}</span>
                  </div>
                  <div style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: message.senderId === 'S001' ? '#1890ff' : '#f0f0f0',
                    color: message.senderId === 'S001' ? '#fff' : '#000',
                  }}>
                    {message.type === 'text' && message.content}
                    {message.type === 'image' && (
                      <img src={message.content} alt="图片" style={{ maxWidth: '100%', maxHeight: 200 }} />
                    )}
                    {message.type === 'audio' && (
                      <audio controls src={message.content} />
                    )}
                  </div>
                  {message.senderId === 'S001' && (
                    <div style={{ textAlign: 'right', fontSize: 12, color: '#999' }}>
                      {message.status === 'sending' && '发送中...'}
                      {message.status === 'sent' && '已发送'}
                      {message.status === 'read' && '已读'}
                    </div>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </Card>

      {/* 输入区域 */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
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
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="imageUpload"
                onChange={handleImageUpload}
              />
              <label htmlFor="imageUpload">
                <Button icon={<PictureOutlined />} />
              </label>
              <Button
                icon={<AudioOutlined />}
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onMouseLeave={handleStopRecording}
                danger={isRecording}
              >
                {isRecording ? `${recordingTime}s` : '按住说话'}
              </Button>
              <Button icon={<SmileOutlined />} onClick={() => setIsQuickReplyModalVisible(true)} />
            </Space>
            <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
              发送
            </Button>
          </div>
        </Space>
      </Card>

      {/* 快捷回复弹窗 */}
      <Modal
        title="快捷回复"
        open={isQuickReplyModalVisible}
        onCancel={() => setIsQuickReplyModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={[
            '您好，这个房源还在出租中，请问您什么时候方便看房？',
            '感谢您的咨询，这个房源的具体信息如下：',
            '好的，我这边帮您安排看房时间。',
            '请问您还有其他问题吗？',
          ]}
          renderItem={item => (
            <List.Item>
              <Button type="link" onClick={() => handleQuickReply(item)}>
                {item}
              </Button>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ChatDetail; 