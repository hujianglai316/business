import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  DatePicker,
  Rate,
  Avatar,
  Tag,
  Space,
  Typography,
  Tabs,
  Modal,
  Form,
  message,
  Pagination,
  Badge,
  Tooltip,
  Divider,
  Progress
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  MessageOutlined,
  StarFilled,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface Review {
  id: string;
  orderId: string;
  guestName: string;
  guestAvatar?: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  overallRating: number;
  ratings: {
    cleanliness: number;
    service: number;
    facilities: number;
    location: number;
    value: number;
  };
  content: string;
  images?: string[];
  tags: string[];
  status: 'pending' | 'replied' | 'hidden';
  reply?: {
    content: string;
    replyTime: string;
    replier: string;
  };
  reviewTime: string;
  isAnonymous: boolean;
  helpfulCount: number;
}

const ReviewList: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const replyTemplates = [
    '感谢您的好评，我们会继续努力提供优质服务！',
    '非常抱歉给您带来不便，我们已经记录您的反馈并会及时改进。',
    '感谢您选择我们酒店，期待您的再次光临！',
    '您的建议对我们很重要，我们会认真考虑并改进。',
    '感谢您的耐心和理解，我们会持续提升服务质量。'
  ];

  const tabItems = [
    { key: 'all', label: '全部评价', count: 0 },
    { key: 'pending', label: '待回复', count: 0 },
    { key: 'replied', label: '已回复', count: 0 },
    { key: 'high', label: '好评', count: 0 },
    { key: 'medium', label: '中评', count: 0 },
    { key: 'low', label: '差评', count: 0 }
  ];

  useEffect(() => {
    generateMockReviews();
  }, []);

  const generateMockReviews = () => {
    setLoading(true);
    
    const mockReviews: Review[] = [];
    const guestNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
    const roomTypes = ['标准大床房', '豪华双床房', '行政套房', '商务大床房'];
    const positiveComments = [
      '酒店位置很好，房间干净整洁，服务态度很棒！',
      '设施齐全，早餐丰富，前台服务很贴心。',
      '房间宽敞明亮，床品舒适，性价比很高。',
      '交通便利，周边配套完善，下次还会选择这里。'
    ];
    const negativeComments = [
      '房间隔音效果不太好，晚上有些吵闹。',
      '卫生间设施有些老旧，希望能够更新。',
      '服务效率有待提高，等待时间较长。',
      '房间温度调节不太方便，空调声音较大。'
    ];

    for (let i = 1; i <= 50; i++) {
      const isPositive = Math.random() > 0.3;
      const overallRating = isPositive ? 
        Math.floor(Math.random() * 2) + 4 : 
        Math.floor(Math.random() * 3) + 1;
      
      const hasReply = Math.random() > 0.4;
      
      mockReviews.push({
        id: `review-${i}`,
        orderId: `ORDER-${1000 + i}`,
        guestName: guestNames[Math.floor(Math.random() * guestNames.length)],
        guestAvatar: Math.random() > 0.5 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}` : undefined,
        roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
        checkInDate: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
        checkOutDate: dayjs().subtract(Math.floor(Math.random() * 25), 'day').format('YYYY-MM-DD'),
        overallRating,
        ratings: {
          cleanliness: Math.floor(Math.random() * 2) + (overallRating - 1),
          service: Math.floor(Math.random() * 2) + (overallRating - 1),
          facilities: Math.floor(Math.random() * 2) + (overallRating - 1),
          location: Math.floor(Math.random() * 2) + (overallRating - 1),
          value: Math.floor(Math.random() * 2) + (overallRating - 1)
        },
        content: isPositive ? 
          positiveComments[Math.floor(Math.random() * positiveComments.length)] :
          negativeComments[Math.floor(Math.random() * negativeComments.length)],
        tags: isPositive ? ['服务好', '位置佳', '干净'] : ['需改进', '设施老旧'],
        status: hasReply ? 'replied' : 'pending',
        reply: hasReply ? {
          content: replyTemplates[Math.floor(Math.random() * replyTemplates.length)],
          replyTime: dayjs().subtract(Math.floor(Math.random() * 10), 'day').format('YYYY-MM-DD HH:mm'),
          replier: '客服小王'
        } : undefined,
        reviewTime: dayjs().subtract(Math.floor(Math.random() * 20), 'day').format('YYYY-MM-DD HH:mm'),
        isAnonymous: Math.random() > 0.7,
        helpfulCount: Math.floor(Math.random() * 20)
      });
    }
    
    setReviews(mockReviews);
    setLoading(false);
  };

  const getFilteredReviews = () => {
    let filtered = reviews;
    
    // 按标签页筛选
    switch (activeTab) {
      case 'pending':
        filtered = filtered.filter(r => r.status === 'pending');
        break;
      case 'replied':
        filtered = filtered.filter(r => r.status === 'replied');
        break;
      case 'high':
        filtered = filtered.filter(r => r.overallRating >= 4);
        break;
      case 'medium':
        filtered = filtered.filter(r => r.overallRating === 3);
        break;
      case 'low':
        filtered = filtered.filter(r => r.overallRating <= 2);
        break;
    }
    
    // 按关键词筛选
    if (searchKeyword) {
      filtered = filtered.filter(r => 
        r.content.includes(searchKeyword) ||
        r.guestName.includes(searchKeyword) ||
        r.roomType.includes(searchKeyword)
      );
    }
    
    return filtered;
  };

  const getTabCounts = () => {
    const counts = {
      all: reviews.length,
      pending: reviews.filter(r => r.status === 'pending').length,
      replied: reviews.filter(r => r.status === 'replied').length,
      high: reviews.filter(r => r.overallRating >= 4).length,
      medium: reviews.filter(r => r.overallRating === 3).length,
      low: reviews.filter(r => r.overallRating <= 2).length
    };
    return counts;
  };

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    setReplyModalVisible(true);
    form.resetFields();
  };

  const handleSubmitReply = async (values: any) => {
    if (!selectedReview) return;
    
    const updatedReviews = reviews.map(review => {
      if (review.id === selectedReview.id) {
        return {
          ...review,
          status: 'replied' as const,
          reply: {
            content: values.replyContent,
            replyTime: dayjs().format('YYYY-MM-DD HH:mm'),
            replier: '当前用户'
          }
        };
      }
      return review;
    });
    
    setReviews(updatedReviews);
    setReplyModalVisible(false);
    message.success('回复成功');
  };

  const handleTemplateClick = (template: string) => {
    form.setFieldsValue({ replyContent: template });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#52c41a';
    if (rating >= 3) return '#faad14';
    return '#ff4d4f';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'replied':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    }
  };

  const renderReviewCard = (review: Review) => (
    <Card key={review.id} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        {/* 用户信息和评分 */}
        <Col span={24}>
          <Row justify="space-between" align="top">
            <Col>
              <Space>
                <Avatar 
                  src={review.guestAvatar} 
                  icon={<UserOutlined />}
                  size={48}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>
                    {review.isAnonymous ? '匿名用户' : review.guestName}
                  </div>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {review.checkInDate} - {review.checkOutDate}
                  </div>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    房型：{review.roomType} | 订单：{review.orderId}
                  </div>
                </div>
              </Space>
            </Col>
            <Col>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: getRatingColor(review.overallRating) }}>
                  {review.overallRating}.0
                </div>
                <Rate disabled value={review.overallRating} style={{ fontSize: 16 }} />
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  {review.reviewTime}
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        {/* 详细评分 */}
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col span={4}>
              <div style={{ fontSize: 12, color: '#666' }}>清洁卫生</div>
              <Progress 
                percent={review.ratings.cleanliness * 20} 
                size="small" 
                strokeColor={getRatingColor(review.ratings.cleanliness)}
                showInfo={false}
              />
            </Col>
            <Col span={4}>
              <div style={{ fontSize: 12, color: '#666' }}>服务态度</div>
              <Progress 
                percent={review.ratings.service * 20} 
                size="small" 
                strokeColor={getRatingColor(review.ratings.service)}
                showInfo={false}
              />
            </Col>
            <Col span={4}>
              <div style={{ fontSize: 12, color: '#666' }}>设施设备</div>
              <Progress 
                percent={review.ratings.facilities * 20} 
                size="small" 
                strokeColor={getRatingColor(review.ratings.facilities)}
                showInfo={false}
              />
            </Col>
            <Col span={4}>
              <div style={{ fontSize: 12, color: '#666' }}>地理位置</div>
              <Progress 
                percent={review.ratings.location * 20} 
                size="small" 
                strokeColor={getRatingColor(review.ratings.location)}
                showInfo={false}
              />
            </Col>
            <Col span={4}>
              <div style={{ fontSize: 12, color: '#666' }}>性价比</div>
              <Progress 
                percent={review.ratings.value * 20} 
                size="small" 
                strokeColor={getRatingColor(review.ratings.value)}
                showInfo={false}
              />
            </Col>
            <Col span={4}>
              <div style={{ textAlign: 'right' }}>
                <Space>
                  {getStatusIcon(review.status)}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {review.status === 'pending' ? '待回复' : '已回复'}
                  </Text>
                </Space>
              </div>
            </Col>
          </Row>
        </Col>

        {/* 评价内容 */}
        <Col span={24}>
          <Paragraph style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
            {review.content}
          </Paragraph>
          
          {/* 标签 */}
          <div style={{ marginTop: 8 }}>
            {review.tags.map(tag => (
              <Tag 
                key={tag} 
                color={review.overallRating >= 4 ? 'green' : 'orange'}
                style={{ marginBottom: 4 }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </Col>

        {/* 商家回复 */}
        {review.reply && (
          <Col span={24}>
            <div style={{ 
              backgroundColor: '#f6f8fa', 
              padding: 12, 
              borderRadius: 6,
              borderLeft: '3px solid #1890ff'
            }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                <MessageOutlined style={{ marginRight: 4 }} />
                商家回复 · {review.reply.replier} · {review.reply.replyTime}
              </div>
              <div style={{ fontSize: 14 }}>{review.reply.content}</div>
            </div>
          </Col>
        )}

        {/* 操作按钮 */}
        <Col span={24}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {review.helpfulCount} 人觉得有用
                </Text>
              </Space>
            </Col>
            <Col>
              <Space>
                {review.status === 'pending' && (
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={() => handleReply(review)}
                  >
                    回复
                  </Button>
                )}
                {review.status === 'replied' && (
                  <Button 
                    size="small"
                    onClick={() => handleReply(review)}
                  >
                    修改回复
                  </Button>
                )}
                <Button size="small">隐藏评价</Button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );

  const filteredReviews = getFilteredReviews();
  const tabCounts = getTabCounts();
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>评价管理</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<FilterOutlined />} onClick={() => setFilterVisible(!filterVisible)}>
              筛选
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Input
              placeholder="搜索评价内容、客人姓名或房型"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
            />
          </Col>
          {filterVisible && (
            <>
              <Col>
                <Select placeholder="评分筛选" style={{ width: 120 }} allowClear>
                  <Option value="5">5星</Option>
                  <Option value="4">4星</Option>
                  <Option value="3">3星</Option>
                  <Option value="2">2星</Option>
                  <Option value="1">1星</Option>
                </Select>
              </Col>
              <Col>
                <Select placeholder="房型筛选" style={{ width: 140 }} allowClear>
                  <Option value="标准大床房">标准大床房</Option>
                  <Option value="豪华双床房">豪华双床房</Option>
                  <Option value="行政套房">行政套房</Option>
                </Select>
              </Col>
              <Col>
                <RangePicker placeholder={['开始日期', '结束日期']} />
              </Col>
            </>
          )}
        </Row>
      </Card>

      {/* 标签页 */}
      <Card style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map(item => ({
            key: item.key,
            label: (
              <Badge count={tabCounts[item.key as keyof typeof tabCounts]} offset={[10, 0]}>
                {item.label}
              </Badge>
            )
          }))}
        />
      </Card>

      {/* 评价列表 */}
      <div>
        {paginatedReviews.map(review => renderReviewCard(review))}
      </div>

      {/* 分页 */}
      {filteredReviews.length > pageSize && (
        <Row justify="center" style={{ marginTop: 24 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredReviews.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
          />
        </Row>
      )}

      {/* 回复弹窗 */}
      <Modal
        title="回复评价"
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        {selectedReview && (
          <div>
            {/* 评价信息 */}
            <div style={{ 
              backgroundColor: '#f6f8fa', 
              padding: 16, 
              borderRadius: 6, 
              marginBottom: 16 
            }}>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <Space>
                    <Avatar src={selectedReview.guestAvatar} icon={<UserOutlined />} />
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {selectedReview.isAnonymous ? '匿名用户' : selectedReview.guestName}
                      </div>
                      <Rate disabled value={selectedReview.overallRating} style={{ fontSize: 14 }} />
                    </div>
                  </Space>
                </Col>
                <Col span={24}>
                  <Text>{selectedReview.content}</Text>
                </Col>
              </Row>
            </div>

            {/* 回复模板 */}
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>快速回复模板：</Text>
              <Space wrap>
                {replyTemplates.map((template, index) => (
                  <Tag
                    key={index}
                    style={{ cursor: 'pointer', marginBottom: 4 }}
                    onClick={() => handleTemplateClick(template)}
                  >
                    {template.length > 20 ? `${template.substring(0, 20)}...` : template}
                  </Tag>
                ))}
              </Space>
            </div>

            {/* 回复表单 */}
            <Form form={form} onFinish={handleSubmitReply} layout="vertical">
              <Form.Item
                name="replyContent"
                label="回复内容"
                rules={[{ required: true, message: '请输入回复内容' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="请输入您的回复..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewList;
