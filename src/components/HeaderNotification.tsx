import React, { useState } from 'react';
import { Badge, Dropdown, List, Tabs, Button, Empty, Typography, Tag, Space, Tooltip } from 'antd';
import { BellOutlined, MessageOutlined, NotificationOutlined, CheckOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';

const { Text, Link } = Typography;

interface NotificationItem {
  id: string;
  type: 'message' | 'system' | 'todo';
  title: string;
  content: string;
  time: string;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
  action?: {
    text: string;
    url: string;
  };
}

interface HeaderNotificationProps {
  businessType: 'rental' | 'hotel';
}

const HeaderNotification: React.FC<HeaderNotificationProps> = ({ businessType }) => {
  // 模拟通知数据
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'message',
      title: '新订单提醒',
      content: businessType === 'rental' ? '您有1个新的租房咨询' : '您有1个新的酒店预订',
      time: dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm'),
      read: false,
      priority: 'high',
      action: {
        text: '查看详情',
        url: businessType === 'rental' ? '/rental/consultation' : '/hotel/orders',
      },
    },
    {
      id: '2',
      type: 'system',
      title: '系统维护通知',
      content: '系统将于今晚23:00-24:00进行维护，请提前保存数据',
      time: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm'),
      read: false,
      priority: 'medium',
    },
    {
      id: '3',
      type: 'todo',
      title: '待处理事项',
      content: businessType === 'rental' ? '有3个预约看房需要确认' : '有2个订单需要确认',
      time: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
      read: true,
      priority: 'medium',
      action: {
        text: '立即处理',
        url: businessType === 'rental' ? '/rental/appointment' : '/hotel/orders',
      },
    },
    {
      id: '4',
      type: 'message',
      title: '评价提醒',
      content: businessType === 'rental' ? '您收到了1条新的房源评价' : '您收到了1条新的酒店评价',
      time: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
      read: true,
      priority: 'low',
      action: {
        text: '查看评价',
        url: businessType === 'rental' ? '/rental/property' : '/hotel/reviews',
      },
    },
  ]);

  // 统计未读数量
  const unreadCount = notifications.filter(item => !item.read).length;

  // 按类型分组通知
  const messageNotifications = notifications.filter(item => item.type === 'message');
  const systemNotifications = notifications.filter(item => item.type === 'system');
  const todoNotifications = notifications.filter(item => item.type === 'todo');

  // 标记已读
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(item => 
      item.id === id ? { ...item, read: true } : item
    ));
  };

  // 删除通知
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  // 全部标记已读
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
  };

  // 获取优先级颜色
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // 获取优先级标签
  const getPriorityTag = (priority?: string) => {
    switch (priority) {
      case 'high': return <Tag color="red">重要</Tag>;
      case 'medium': return <Tag color="orange">一般</Tag>;
      case 'low': return <Tag color="green">普通</Tag>;
      default: return null;
    }
  };

  // 渲染通知列表
  const renderNotificationList = (items: NotificationItem[]) => {
    if (items.length === 0) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="暂无通知" 
            style={{ margin: 0 }}
          />
        </div>
      );
    }

    return (
      <List
        itemLayout="vertical"
        size="small"
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: '12px 16px',
              backgroundColor: item.read ? 'transparent' : '#f6ffed',
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer',
            }}
            onClick={() => !item.read && markAsRead(item.id)}
            actions={[
              <Space key="actions">
                {item.action && (
                  <Link href={item.action.url} style={{ fontSize: 12 }}>
                    {item.action.text}
                  </Link>
                )}
                <Tooltip title="标记已读">
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<CheckOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(item.id);
                    }}
                    disabled={item.read}
                  />
                </Tooltip>
                <Tooltip title="删除">
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item.id);
                    }}
                  />
                </Tooltip>
              </Space>
            ]}
          >
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text 
                      style={{ 
                        fontWeight: item.read ? 'normal' : 'bold',
                        fontSize: 14,
                      }}
                    >
                      {item.title}
                    </Text>
                    {!item.read && (
                      <div style={{
                        width: 6,
                        height: 6,
                        backgroundColor: '#1677ff',
                        borderRadius: '50%',
                        marginLeft: 8,
                      }} />
                    )}
                  </div>
                  {getPriorityTag(item.priority)}
                </div>
              }
              description={
                <div>
                  <Text style={{ fontSize: 13, color: '#666' }}>{item.content}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 12, color: '#999' }}>{item.time}</Text>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'message',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MessageOutlined style={{ marginRight: 4 }} />
          消息通知
          {messageNotifications.filter(item => !item.read).length > 0 && (
            <Badge 
              count={messageNotifications.filter(item => !item.read).length} 
              size="small" 
              style={{ marginLeft: 8 }}
            />
          )}
        </div>
      ),
      children: renderNotificationList(messageNotifications),
    },
    {
      key: 'system',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NotificationOutlined style={{ marginRight: 4 }} />
          系统公告
          {systemNotifications.filter(item => !item.read).length > 0 && (
            <Badge 
              count={systemNotifications.filter(item => !item.read).length} 
              size="small" 
              style={{ marginLeft: 8 }}
            />
          )}
        </div>
      ),
      children: renderNotificationList(systemNotifications),
    },
    {
      key: 'todo',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CheckOutlined style={{ marginRight: 4 }} />
          待办事项
          {todoNotifications.filter(item => !item.read).length > 0 && (
            <Badge 
              count={todoNotifications.filter(item => !item.read).length} 
              size="small" 
              style={{ marginLeft: 8 }}
            />
          )}
        </div>
      ),
      children: renderNotificationList(todoNotifications),
    },
  ];

  const dropdownContent = (
    <div style={{ width: 380, maxHeight: 500, backgroundColor: '#fff' }}>
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>通知中心</Text>
        <Space>
          <Button 
            type="link" 
            size="small" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            全部已读
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<SettingOutlined />}
            onClick={() => {
              // 通知设置功能
            }}
          />
        </Space>
      </div>
      
      <Tabs
        defaultActiveKey="message"
        items={tabItems}
        size="small"
        style={{ margin: 0 }}
        tabBarStyle={{ margin: '0 16px', borderBottom: '1px solid #f0f0f0' }}
      />
      
      <div style={{ 
        padding: '8px 16px', 
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center' 
      }}>
        <Link 
          href="#" 
          style={{ fontSize: 13 }}
          onClick={() => {
            // 查看全部通知功能
          }}
        >
          查看全部通知
        </Link>
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <div style={{
        cursor: 'pointer',
        padding: '0 16px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f5f5f5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      >
        <Badge count={unreadCount} size="small">
          <BellOutlined style={{ fontSize: 16, color: '#666' }} />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default HeaderNotification; 