import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Input,
  Select,
  Checkbox,
  Tag,
  Modal,
  Form,
  Upload,
  message,
  Dropdown,
  Menu,
  Pagination,
  Image,
  Tooltip,
  Badge,
  Radio,
  Tabs,
  Divider,
  Progress,
  Switch
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  HistoryOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  UploadOutlined,
  InboxOutlined,
  TagsOutlined,
  FolderOpenOutlined,
  EyeInvisibleOutlined,
  MoreOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

interface ImageItem {
  id: string;
  name: string;
  url: string;
  category: string;
  subcategory: string;
  description: string;
  tags: string[];
  roomTypes: string[];
  isMainImage: boolean;
  status: 'enabled' | 'disabled';
  auditStatus: 'pending' | 'approved' | 'rejected';
  uploadTime: string;
  size: number;
  dimensions: string;
  usageScenes: string[];
}

interface CategoryConfig {
  label: string;
  value: string;
  subcategories: { label: string; value: string }[];
}

const ImageManagement: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [filterVisible, setFilterVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [operationLogVisible, setOperationLogVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
  const [pageSize, setPageSize] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    auditStatus: 'all',
    uploadTime: 'all',
    usageScenes: [],
    roomTypes: []
  });

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // 分类配置
  const categories: CategoryConfig[] = [
    {
      label: '公共区域',
      value: 'public',
      subcategories: [
        { label: '大堂', value: 'lobby' },
        { label: '餐厅', value: 'restaurant' },
        { label: '会议室', value: 'meeting' },
        { label: '健身房', value: 'gym' },
        { label: '走廊', value: 'corridor' }
      ]
    },
    {
      label: '客房区域',
      value: 'room',
      subcategories: [
        { label: '标准大床房', value: 'standard' },
        { label: '豪华大床房', value: 'deluxe' },
        { label: '豪华双床房', value: 'twin' },
        { label: '行政套房', value: 'executive' },
        { label: '家庭套房', value: 'family' },
        { label: '商务套房', value: 'business' }
      ]
    },
    {
      label: '特色设施',
      value: 'facility',
      subcategories: [
        { label: '游泳池', value: 'pool' },
        { label: 'SPA', value: 'spa' },
        { label: '酒吧', value: 'bar' },
        { label: '花园', value: 'garden' },
        { label: '停车场', value: 'parking' }
      ]
    },
    {
      label: '周边环境',
      value: 'surroundings',
      subcategories: [
        { label: '交通', value: 'transport' },
        { label: '商圈', value: 'shopping' },
        { label: '景点', value: 'attraction' },
        { label: '餐饮', value: 'dining' }
      ]
    },
    {
      label: '营销活动',
      value: 'marketing',
      subcategories: [
        { label: '促销海报', value: 'promotion' },
        { label: '活动现场', value: 'event' },
        { label: '节日装饰', value: 'festival' }
      ]
    }
  ];

  useEffect(() => {
    generateMockData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [images, searchKeyword, activeCategory, activeSubcategory, filters]);

  const generateMockData = () => {
    const mockImages: ImageItem[] = [];
    const imageNames = [
      '酒店大堂-全景', '豪华大床房-卧室', '餐厅-用餐区', '商务会议室-全景',
      '豪华套房-起居室', '室内游泳池-全景', '健身房-器械区', '酒店外观-夜景',
      '标准双床房-卧室', 'SPA中心-按摩室', '酒吧-吧台区', '花园-休闲区',
      '停车场-入口', '交通-地铁站', '商圈-购物中心', '景点-公园',
      '餐饮-特色餐厅', '促销海报-春节', '活动现场-开业', '节日装饰-圣诞'
    ];

    for (let i = 0; i < 48; i++) {
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      const subcategoryIndex = i % category.subcategories.length;
      const subcategory = category.subcategories[subcategoryIndex];

      mockImages.push({
        id: `img_${i + 1}`,
        name: imageNames[i % imageNames.length] + (i > 19 ? ` ${Math.floor(i / 20) + 1}` : ''),
        url: `https://picsum.photos/400/300?random=${i + 1}`,
        category: category.value,
        subcategory: subcategory.value,
        description: `这是${imageNames[i % imageNames.length]}的详细描述`,
        tags: ['全景', '白天', '高清'].slice(0, Math.floor(Math.random() * 3) + 1),
        roomTypes: i % 3 === 0 ? ['standard', 'deluxe'] : [],
        isMainImage: i % 10 === 0,
        status: Math.random() > 0.1 ? 'enabled' : 'disabled',
        auditStatus: ['approved', 'pending', 'rejected'][Math.floor(Math.random() * 3)] as any,
        uploadTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        size: Math.floor(Math.random() * 5000000) + 500000,
        dimensions: `${800 + Math.floor(Math.random() * 400)}x${600 + Math.floor(Math.random() * 300)}`,
        usageScenes: ['pc', 'mobile', 'slider'].slice(0, Math.floor(Math.random() * 3) + 1)
      });
    }

    setImages(mockImages);
  };

  const applyFilters = () => {
    let filtered = [...images];

    // 搜索关键词过滤
    if (searchKeyword) {
      filtered = filtered.filter(img =>
        img.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        img.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    }

    // 分类过滤
    if (activeCategory !== 'all') {
      filtered = filtered.filter(img => img.category === activeCategory);
    }

    // 子分类过滤
    if (activeSubcategory !== 'all') {
      filtered = filtered.filter(img => img.subcategory === activeSubcategory);
    }

    // 状态过滤
    if (filters.status !== 'all') {
      filtered = filtered.filter(img => img.status === filters.status);
    }

    // 审核状态过滤
    if (filters.auditStatus !== 'all') {
      filtered = filtered.filter(img => img.auditStatus === filters.auditStatus);
    }

    // 使用场景过滤
    if (filters.usageScenes.length > 0) {
      filtered = filtered.filter(img =>
        filters.usageScenes.some(scene => img.usageScenes.includes(scene))
      );
    }

    // 房型关联过滤
    if (filters.roomTypes.length > 0) {
      filtered = filtered.filter(img =>
        filters.roomTypes.some(roomType => img.roomTypes.includes(roomType))
      );
    }

    setFilteredImages(filtered);
  };

  const getCurrentSubcategories = () => {
    if (activeCategory === 'all') return [];
    const category = categories.find(cat => cat.value === activeCategory);
    return category ? category.subcategories : [];
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setActiveSubcategory('all');
  };

  const handleImageSelect = (imageId: string, checked: boolean) => {
    if (checked) {
      setSelectedImages([...selectedImages, imageId]);
    } else {
      setSelectedImages(selectedImages.filter(id => id !== imageId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageImages = filteredImages.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      setSelectedImages(currentPageImages.map(img => img.id));
    } else {
      setSelectedImages([]);
    }
  };

  const handleBatchOperation = (operation: string) => {
    if (selectedImages.length === 0) {
      message.warning('请先选择要操作的图片');
      return;
    }

    Modal.confirm({
      title: `确认${operation}`,
      content: `确定要对选中的 ${selectedImages.length} 张图片执行${operation}操作吗？`,
      onOk: () => {
        // 这里实现批量操作逻辑
        message.success(`已成功${operation} ${selectedImages.length} 张图片`);
        setSelectedImages([]);
      }
    });
  };

  const handleImagePreview = (image: ImageItem) => {
    setCurrentImage(image);
    setPreviewModalVisible(true);
  };

  const handleImageEdit = (image: ImageItem) => {
    setCurrentImage(image);
    editForm.setFieldsValue({
      name: image.name,
      category: image.category,
      subcategory: image.subcategory,
      description: image.description,
      tags: image.tags,
      roomTypes: image.roomTypes,
      status: image.status
    });
    setEditModalVisible(true);
  };

  const handleImageDelete = (image: ImageItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除图片"${image.name}"吗？此操作不可恢复。`,
      okType: 'danger',
      onOk: () => {
        setImages(images.filter(img => img.id !== image.id));
        message.success('图片删除成功');
      }
    });
  };

  const handleSetMainImage = (image: ImageItem) => {
    setImages(images.map(img => ({
      ...img,
      isMainImage: img.id === image.id ? !img.isMainImage : img.isMainImage
    })));
    message.success(image.isMainImage ? '已取消主图设置' : '已设为主图');
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过 10MB！');
      }
      return isImage && isLt10M;
    }
  };

  const batchMenu = (
    <Menu
      items={[
        {
          key: 'addTags',
          icon: <TagsOutlined />,
          label: '批量添加标签',
          onClick: () => handleBatchOperation('添加标签')
        },
        {
          key: 'moveCategory',
          icon: <FolderOpenOutlined />,
          label: '批量移动分类',
          onClick: () => handleBatchOperation('移动分类')
        },
        {
          key: 'disable',
          icon: <EyeInvisibleOutlined />,
          label: '批量禁用',
          onClick: () => handleBatchOperation('禁用')
        },
        {
          type: 'divider'
        },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: '批量删除',
          danger: true,
          onClick: () => handleBatchOperation('删除')
        }
      ]}
    />
  );

  const filterMenu = (
    <div style={{ padding: 16, width: 300 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>显示状态</Text>
        <Radio.Group
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={{ display: 'block', marginTop: 8 }}
        >
          <Radio value="all">全部</Radio>
          <Radio value="enabled">启用</Radio>
          <Radio value="disabled">禁用</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong>审核状态</Text>
        <Radio.Group
          value={filters.auditStatus}
          onChange={(e) => setFilters({ ...filters, auditStatus: e.target.value })}
          style={{ display: 'block', marginTop: 8 }}
        >
          <Radio value="all">全部</Radio>
          <Radio value="pending">待审核</Radio>
          <Radio value="approved">已通过</Radio>
          <Radio value="rejected">已拒绝</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong>使用场景</Text>
        <Checkbox.Group
          value={filters.usageScenes}
          onChange={(values) => setFilters({ ...filters, usageScenes: values })}
          style={{ display: 'block', marginTop: 8 }}
        >
          <Checkbox value="pc">电脑端</Checkbox>
          <Checkbox value="mobile">手机端</Checkbox>
          <Checkbox value="slider">首页轮播</Checkbox>
        </Checkbox.Group>
      </div>

      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button size="small" onClick={() => setFilters({
            status: 'all',
            auditStatus: 'all',
            uploadTime: 'all',
            usageScenes: [],
            roomTypes: []
          })}>
            重置
          </Button>
          <Button type="primary" size="small" onClick={() => setFilterVisible(false)}>
            应用筛选
          </Button>
        </Space>
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      enabled: { color: 'green', text: '启用' },
      disabled: { color: 'red', text: '禁用' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge color={config.color} text={config.text} />;
  };

  const getAuditStatusTag = (auditStatus: string) => {
    const statusConfig = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' }
    };
    const config = statusConfig[auditStatus as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentPageImages = filteredImages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>图片管理中心</Title>
          <Text type="secondary">管理酒店所有图片资源</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<HistoryOutlined />} onClick={() => setOperationLogVisible(true)}>
              操作日志
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setUploadModalVisible(true)}>
              添加图片
            </Button>
            <Dropdown overlay={batchMenu} trigger={['click']}>
              <Button>
                批量操作 <MoreOutlined />
              </Button>
            </Dropdown>
            <Dropdown overlay={filterMenu} trigger={['click']} visible={filterVisible} onVisibleChange={setFilterVisible}>
              <Button icon={<FilterOutlined />}>
                筛选
              </Button>
            </Dropdown>
          </Space>
        </Col>
      </Row>

      {/* 搜索栏 */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            placeholder="搜索图片名称、描述或标签"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </Col>
      </Row>

      {/* 分类筛选 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong>区域分类：</Text>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <Tag.CheckableTag
              checked={activeCategory === 'all'}
              onChange={() => handleCategoryChange('all')}
            >
              全部
            </Tag.CheckableTag>
            {categories.map(category => (
              <Tag.CheckableTag
                key={category.value}
                checked={activeCategory === category.value}
                onChange={() => handleCategoryChange(category.value)}
              >
                {category.label}
              </Tag.CheckableTag>
            ))}
          </div>
        </div>

        {activeCategory !== 'all' && (
          <div>
            <Text strong>子分类：</Text>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              <Tag.CheckableTag
                checked={activeSubcategory === 'all'}
                onChange={() => setActiveSubcategory('all')}
              >
                全部
              </Tag.CheckableTag>
              {getCurrentSubcategories().map(subcategory => (
                <Tag.CheckableTag
                  key={subcategory.value}
                  checked={activeSubcategory === subcategory.value}
                  onChange={() => setActiveSubcategory(subcategory.value)}
                >
                  {subcategory.label}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 批量选择工具栏 */}
      {selectedImages.length > 0 && (
        <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Text>已选择 {selectedImages.length} 张图片</Text>
                <Button size="small" onClick={() => setSelectedImages([])}>
                  取消选择
                </Button>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button size="small" onClick={() => handleBatchOperation('添加标签')}>
                  批量添加标签
                </Button>
                <Button size="small" onClick={() => handleBatchOperation('移动分类')}>
                  批量移动分类
                </Button>
                <Button size="small" danger onClick={() => handleBatchOperation('删除')}>
                  批量删除
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* 图片网格 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Space>
              <Checkbox
                checked={selectedImages.length === currentPageImages.length && currentPageImages.length > 0}
                indeterminate={selectedImages.length > 0 && selectedImages.length < currentPageImages.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                全选当前页
              </Checkbox>
              <Text type="secondary">共 {filteredImages.length} 张图片</Text>
            </Space>
            <Space>
              <Text>每页显示：</Text>
              <Select value={pageSize} onChange={setPageSize} style={{ width: 100 }}>
                <Option value={12}>12张</Option>
                <Option value={24}>24张</Option>
                <Option value={48}>48张</Option>
                <Option value={96}>96张</Option>
              </Select>
            </Space>
          </div>

          <Row gutter={[16, 16]}>
            {currentPageImages.map(image => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={image.id}>
                <Card
                  size="small"
                  hoverable
                  cover={
                    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                      <Image
                        src={image.url}
                        alt={image.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        preview={false}
                        onClick={() => handleImagePreview(image)}
                      />
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onChange={(e) => handleImageSelect(image.id, e.target.checked)}
                        style={{ position: 'absolute', top: 8, left: 8 }}
                      />
                      {image.isMainImage && (
                        <StarFilled style={{ position: 'absolute', top: 8, right: 8, color: '#faad14', fontSize: 16 }} />
                      )}
                      <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                        {getAuditStatusTag(image.auditStatus)}
                      </div>
                    </div>
                  }
                  actions={[
                    <Tooltip title="预览">
                      <EyeOutlined onClick={() => handleImagePreview(image)} />
                    </Tooltip>,
                    <Tooltip title="编辑">
                      <EditOutlined onClick={() => handleImageEdit(image)} />
                    </Tooltip>,
                    <Tooltip title={image.isMainImage ? '取消主图' : '设为主图'}>
                      {image.isMainImage ? (
                        <StarFilled style={{ color: '#faad14' }} onClick={() => handleSetMainImage(image)} />
                      ) : (
                        <StarOutlined onClick={() => handleSetMainImage(image)} />
                      )}
                    </Tooltip>,
                    <Tooltip title="删除">
                      <DeleteOutlined style={{ color: '#ff4d4f' }} onClick={() => handleImageDelete(image)} />
                    </Tooltip>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                        {image.name}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                          {categories.find(cat => cat.value === image.category)?.label} &gt; {' '}
                          {categories.find(cat => cat.value === image.category)?.subcategories.find(sub => sub.value === image.subcategory)?.label}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          {image.tags.map(tag => (
                            <Tag key={tag} style={{ fontSize: 10, margin: '0 2px 2px 0' }}>
                              #{tag}
                            </Tag>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {getStatusBadge(image.status)}
                          <Text type="secondary" style={{ fontSize: 10 }}>
                            {formatFileSize(image.size)}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* 分页 */}
      <Row justify="center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredImages.length}
          onChange={setCurrentPage}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
        />
      </Row>

      {/* 上传图片模态框 */}
      <Modal
        title="上传图片"
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical">
          <div style={{ marginBottom: 24 }}>
            <Dragger {...uploadProps} style={{ padding: 40 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">拖放图片至此处或点击选择图片</p>
              <p className="ant-upload-hint">
                支持JPG、PNG、WEBP等格式，单张图片不超过10MB
              </p>
            </Dragger>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="图片名称" name="name" rules={[{ required: true, message: '请输入图片名称' }]}>
                <Input placeholder="请输入图片名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="所属区域" name="category" rules={[{ required: true, message: '请选择区域' }]}>
                <Select placeholder="请选择区域">
                  {categories.map(category => (
                    <Option key={category.value} value={category.value}>
                      {category.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="子区域" name="subcategory">
            <Select placeholder="请选择子区域">
              {getCurrentSubcategories().map(subcategory => (
                <Option key={subcategory.value} value={subcategory.value}>
                  {subcategory.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="图片描述" name="description">
            <TextArea rows={3} placeholder="请输入图片描述" />
          </Form.Item>

          <Form.Item label="图片标签" name="tags">
            <Select mode="tags" placeholder="输入标签后按回车添加" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="关联房型" name="roomTypes">
                <Select mode="multiple" placeholder="选择关联房型">
                  <Option value="standard">标准大床房</Option>
                  <Option value="deluxe">豪华大床房</Option>
                  <Option value="twin">豪华双床房</Option>
                  <Option value="executive">行政套房</Option>
                  <Option value="family">家庭套房</Option>
                  <Option value="business">商务套房</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="显示状态" name="status" initialValue="enabled">
                <Select>
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button onClick={() => setUploadModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确认上传
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片预览模态框 */}
      <Modal
        title="图片预览"
        visible={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentImage && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Image src={currentImage.url} alt={currentImage.name} style={{ maxWidth: '100%' }} />
            </div>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <div><Text strong>图片名称：</Text>{currentImage.name}</div>
                <div><Text strong>分类：</Text>{categories.find(cat => cat.value === currentImage.category)?.label}</div>
                <div><Text strong>尺寸：</Text>{currentImage.dimensions}</div>
                <div><Text strong>文件大小：</Text>{formatFileSize(currentImage.size)}</div>
              </Col>
              <Col span={12}>
                <div><Text strong>状态：</Text>{getStatusBadge(currentImage.status)}</div>
                <div><Text strong>审核状态：</Text>{getAuditStatusTag(currentImage.auditStatus)}</div>
                <div><Text strong>上传时间：</Text>{new Date(currentImage.uploadTime).toLocaleString()}</div>
                <div><Text strong>是否主图：</Text>{currentImage.isMainImage ? '是' : '否'}</div>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <Text strong>描述：</Text>
              <div>{currentImage.description}</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text strong>标签：</Text>
              <div style={{ marginTop: 4 }}>
                {currentImage.tags.map(tag => (
                  <Tag key={tag}>#{tag}</Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑图片模态框 */}
      <Modal
        title="编辑图片"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          editForm.validateFields().then(values => {
            // 这里实现编辑逻辑
            message.success('图片信息更新成功');
            setEditModalVisible(false);
          });
        }}
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="图片名称" name="name" rules={[{ required: true, message: '请输入图片名称' }]}>
            <Input placeholder="请输入图片名称" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="所属区域" name="category" rules={[{ required: true, message: '请选择区域' }]}>
                <Select placeholder="请选择区域">
                  {categories.map(category => (
                    <Option key={category.value} value={category.value}>
                      {category.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="子区域" name="subcategory">
                <Select placeholder="请选择子区域">
                  {getCurrentSubcategories().map(subcategory => (
                    <Option key={subcategory.value} value={subcategory.value}>
                      {subcategory.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="图片描述" name="description">
            <TextArea rows={3} placeholder="请输入图片描述" />
          </Form.Item>

          <Form.Item label="图片标签" name="tags">
            <Select mode="tags" placeholder="输入标签后按回车添加" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="关联房型" name="roomTypes">
                <Select mode="multiple" placeholder="选择关联房型">
                  <Option value="standard">标准大床房</Option>
                  <Option value="deluxe">豪华大床房</Option>
                  <Option value="twin">豪华双床房</Option>
                  <Option value="executive">行政套房</Option>
                  <Option value="family">家庭套房</Option>
                  <Option value="business">商务套房</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="显示状态" name="status">
                <Select>
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ImageManagement;
