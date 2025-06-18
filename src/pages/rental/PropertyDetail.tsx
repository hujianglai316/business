import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Carousel, Upload, Button, Row, Col, Statistic, Tag, Space, Modal, message } from 'antd';
import { UploadOutlined, EyeOutlined, PhoneOutlined, CalendarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailLayout } from '../../components';

interface PropertyData {
  id: string;
  name: string;
  type: string;
  rentType: string;
  area: number;
  layout: string;
  price: number;
  address: string;
  floor: string;
  orientation: string;
  decoration: string;
  facilities: string[];
  description: string;
  publishTime: string;
  status: string;
  views: number;
  inquiries: number;
  appointments: number;
  images: string[];
  ownershipProof?: string;
  businessLicense?: string;
  reviewComment?: string;
  minRentPeriod: number;
  depositType: string;
}

const PropertyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟获取房源数据
  const fetchPropertyData = async (propertyId: string) => {
    // 实际项目中应该从API获取数据
    return {
      id: propertyId,
      name: '阳光花园 2室1厅',
      type: '住宅',
      rentType: '整租',
      area: 85,
      layout: '2室1厅1卫',
      price: 5000,
      address: '北京市朝阳区建国路88号',
      floor: '12/18层',
      orientation: '南北通透',
      decoration: '精装修',
      facilities: ['空调', '热水器', '洗衣机', '冰箱', '电视', '宽带'],
      description: '房屋采光好，交通便利，周边配套设施齐全。',
      publishTime: '2024-03-01',
      status: '待审核',
      views: 256,
      inquiries: 45,
      appointments: 12,
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
      ],
      reviewComment: '房源信息不完整，请补充更多细节。',
      minRentPeriod: 3,
      depositType: '押一付一',
    };
  };

  useEffect(() => {
    if (id) {
      fetchPropertyData(id).then(data => {
        setPropertyData(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleDelete = () => {
    if (propertyData?.status === '已出租' || propertyData?.status === '待审核') {
      message.error('已出租或审核中的房源不允许删除');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除房源"${propertyData?.name}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 实际项目中应该调用API删除数据
        message.success('删除成功');
        navigate('/rental/property');
      },
    });
  };

  const handleStatusChange = (newStatus: string) => {
    Modal.confirm({
      title: '确认状态变更',
      content: `确定要将房源状态变更为"${newStatus}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 实际项目中应该调用API更新状态
        message.success('状态更新成功');
        if (propertyData) {
          setPropertyData({ ...propertyData, status: newStatus });
        }
      },
    });
  };

  if (loading || !propertyData) {
    return <div>加载中...</div>;
  }

  const statusConfig = {
    '待审核': { color: 'orange', text: '待审核' },
    '审核通过': { color: 'green', text: '审核通过' },
    '审核不通过': { color: 'red', text: '审核不通过' },
    '已下架': { color: 'gray', text: '已下架' },
    '已出租': { color: 'blue', text: '已出租' },
  };

  // 面包屑配置
  const breadcrumbs = [
    { title: '房源管理', path: '/rental/property' },
    { title: '房源详情' },
  ];

  // 详情页操作按钮
  const detailActions = [
    {
      key: 'edit',
      label: '编辑',
      type: 'primary' as const,
      icon: <EditOutlined />,
      onClick: () => navigate(`/rental/property/edit/${id}`),
    },
    {
      key: 'delete',
      label: '删除',
      danger: true,
      icon: <DeleteOutlined />,
      onClick: handleDelete,
    },
  ];

  return (
    <DetailLayout
      breadcrumbs={breadcrumbs}
      title="房源详情"
      subtitle={`房源编号：${propertyData.id} | ${propertyData.name}`}
      backPath="/rental/property"
      actions={detailActions}
    >
      
      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: 24 }}>
        <Descriptions bordered>
          <Descriptions.Item label="房源名称">{propertyData.name}</Descriptions.Item>
          <Descriptions.Item label="房源类型">{propertyData.type}</Descriptions.Item>
          <Descriptions.Item label="租赁方式">{propertyData.rentType}</Descriptions.Item>
          <Descriptions.Item label="面积">{propertyData.area}㎡</Descriptions.Item>
          <Descriptions.Item label="户型">{propertyData.layout}</Descriptions.Item>
          <Descriptions.Item label="月租金">¥{propertyData.price}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusConfig[propertyData.status as keyof typeof statusConfig].color}>
              {statusConfig[propertyData.status as keyof typeof statusConfig].text}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="楼层">{propertyData.floor}</Descriptions.Item>
          <Descriptions.Item label="朝向">{propertyData.orientation}</Descriptions.Item>
          <Descriptions.Item label="装修情况">{propertyData.decoration}</Descriptions.Item>
          <Descriptions.Item label="最短起租周期">{propertyData.minRentPeriod}月</Descriptions.Item>
          <Descriptions.Item label="押金方式">{propertyData.depositType}</Descriptions.Item>
          <Descriptions.Item label="地址" span={3}>{propertyData.address}</Descriptions.Item>
          <Descriptions.Item label="配套设施" span={3}>
            {propertyData.facilities.join('、')}
          </Descriptions.Item>
          <Descriptions.Item label="房源描述" span={3}>
            {propertyData.description}
          </Descriptions.Item>
          {propertyData.reviewComment && (
            <Descriptions.Item label="审核意见" span={3}>
              <span style={{ color: 'red' }}>{propertyData.reviewComment}</span>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 图片展示 */}
      <Card title="图片展示" style={{ marginBottom: 24 }}>
        <Carousel autoplay>
          {propertyData.images.map((image, index) => (
            <div key={index}>
              <div style={{ height: 300, background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={image} alt={`房源图片 ${index + 1}`} style={{ maxHeight: '100%', maxWidth: '100%' }} />
              </div>
            </div>
          ))}
        </Carousel>
      </Card>

      {/* 资质证明 */}
      <Card title="资质证明" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Upload>
              <Button icon={<UploadOutlined />}>上传产权证明</Button>
            </Upload>
          </Col>
          <Col span={12}>
            <Upload>
              <Button icon={<UploadOutlined />}>上传营业执照</Button>
            </Upload>
          </Col>
        </Row>
      </Card>

      {/* 其他信息 */}
      <Card title="其他信息">
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="浏览量"
              value={propertyData.views}
              prefix={<EyeOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="咨询量"
              value={propertyData.inquiries}
              prefix={<PhoneOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="预约看房"
              value={propertyData.appointments}
              prefix={<CalendarOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* 状态管理 */}
      {propertyData.status === '审核通过' && (
        <Card title="状态管理" style={{ marginTop: 24 }}>
          <Space>
            <Button type="primary" onClick={() => handleStatusChange('已出租')}>
              标记为已出租
            </Button>
            <Button onClick={() => handleStatusChange('已下架')}>
              下架房源
            </Button>
          </Space>
        </Card>
      )}
    </DetailLayout>
  );
};

export default PropertyDetail; 