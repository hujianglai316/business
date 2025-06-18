import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Select, 
  DatePicker, 
  Input, 
  Badge, 
  Row, 
  Col, 
  Card,
  message
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义活动类型接口
interface Campaign {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'terminated';
  properties: string[];
  budget: number;
  spentAmount: number;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  appointments: number;
  ctr: number;
  conversionRate: number;
  createTime: string;
}

// 活动列表组件
const CampaignList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filters, setFilters] = useState<{
    status: string;
    dateRange: any;
    keyword: string;
    property: string;
  }>({
    status: 'all',
    dateRange: null,
    keyword: '',
    property: 'all',
  });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
  });
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Campaign>>({});

  // 模拟获取数据
  useEffect(() => {
    fetchCampaigns();
  }, [filters, pagination.current, pagination.pageSize, sortedInfo]);

  // 获取活动列表
  const fetchCampaigns = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockData: Campaign[] = [
        {
          id: 'c001',
          name: '阳光花园首页推广',
          status: 'active',
          properties: ['阳光花园2室1厅'],
          budget: 2000,
          spentAmount: 856.5,
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          impressions: 1240,
          clicks: 186,
          appointments: 7,
          ctr: 15.0,
          conversionRate: 3.8,
          createTime: '2024-02-28 14:30:00',
        },
        {
          id: 'c002',
          name: '城市公寓搜索推广',
          status: 'paused',
          properties: ['城市公寓1室1厅'],
          budget: 1500,
          spentAmount: 432.8,
          startDate: '2024-03-05',
          endDate: '2024-03-25',
          impressions: 980,
          clicks: 156,
          appointments: 5,
          ctr: 15.9,
          conversionRate: 3.2,
          createTime: '2024-03-04 11:15:00',
        },
        {
          id: 'c003',
          name: '多房源组合推广',
          status: 'pending',
          properties: ['新领地3室2厅', '城市公寓2室1厅'],
          budget: 3000,
          spentAmount: 0,
          startDate: '2024-03-15',
          endDate: '2024-04-15',
          impressions: 0,
          clicks: 0,
          appointments: 0,
          ctr: 0,
          conversionRate: 0,
          createTime: '2024-03-10 09:45:00',
        },
        {
          id: 'c004',
          name: '高性价比房源推广',
          status: 'active',
          properties: ['经济舒适1室1厅', '学生公寓标间'],
          budget: 1200,
          spentAmount: 328.5,
          startDate: '2024-03-02',
          endDate: '2024-03-22',
          impressions: 780,
          clicks: 102,
          appointments: 3,
          ctr: 13.1,
          conversionRate: 2.9,
          createTime: '2024-03-01 16:20:00',
        },
        {
          id: 'c005',
          name: '地铁沿线房源推广',
          status: 'completed',
          properties: ['地铁新城2室1厅'],
          budget: 800,
          spentAmount: 800,
          startDate: '2024-02-15',
          endDate: '2024-03-01',
          impressions: 1560,
          clicks: 220,
          appointments: 9,
          ctr: 14.1,
          conversionRate: 4.1,
          createTime: '2024-02-14 10:30:00',
        },
      ];
      
      // 过滤
      let filteredData = [...mockData];
      
      if (filters.status !== 'all') {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }
      
      if (filters.keyword) {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          item.properties.some(p => p.toLowerCase().includes(filters.keyword.toLowerCase()))
        );
      }
      
      if (filters.property !== 'all') {
        filteredData = filteredData.filter(item => 
          item.properties.some(p => p.includes(filters.property))
        );
      }
      
      // 排序
      if (sortedInfo.columnKey) {
        filteredData.sort((a, b) => {
          const keyA = a[sortedInfo.columnKey as keyof Campaign];
          const keyB = b[sortedInfo.columnKey as keyof Campaign];
          const result = keyA > keyB ? 1 : keyA < keyB ? -1 : 0;
          return sortedInfo.order === 'ascend' ? result : -result;
        });
      }
      
      // 分页
      const start = ((pagination.current || 1) - 1) * (pagination.pageSize || 10);
      const end = start + (pagination.pageSize || 10);
      const paginatedData = filteredData.slice(start, end);
      
      setCampaigns(paginatedData);
      setPagination({
        ...pagination,
        total: filteredData.length,
      });
      
      setLoading(false);
    }, 500);
  };

  // 处理表格变化
  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Campaign> | SorterResult<Campaign>[]
  ) => {
    setPagination(paginationConfig);
    setSortedInfo(Array.isArray(sorter) ? sorter[0] : sorter);
  };

  // 处理筛选条件变化
  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, current: 1 });
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    handleFilterChange('keyword', value);
  };

  // 暂停或恢复活动
  const handleStatusChange = (id: string, currentStatus: 'active' | 'paused' | 'pending' | 'completed' | 'terminated') => {
    if (currentStatus !== 'active' && currentStatus !== 'paused') {
      message.error('只有正在进行或已暂停的活动可以更改状态');
      return;
    }
    
    const newStatus = currentStatus === 'active' ? 'paused' as const : 'active' as const;
    
    // 模拟API调用
    setCampaigns(campaigns.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    
    message.success(`活动已${newStatus === 'active' ? '激活' : '暂停'}`);
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="success">进行中</Tag>;
      case 'paused':
        return <Tag color="warning">已暂停</Tag>;
      case 'pending':
        return <Tag color="processing">待开始</Tag>;
      case 'completed':
        return <Tag color="default">已结束</Tag>;
      case 'terminated':
        return <Tag color="error">已终止</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 跳转到详情页
  const handleViewDetail = (id: string) => {
    navigate(`/rental/promotion/detail/${id}`);
  };

  // 跳转到编辑页
  const handleEdit = (id: string) => {
    navigate(`/rental/promotion/edit/${id}`);
  };

  // 跳转到数据分析页
  const handleAnalytics = (id: string) => {
    navigate(`/rental/promotion/analytics/${id}`);
  };

  // 创建新活动
  const handleCreateCampaign = () => {
    navigate('/rental/promotion/create');
  };

  // 表格列定义
  const columns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Campaign) => (
        <Space>
          <a onClick={() => handleViewDetail(record.id)}>{text}</a>
          {new Date(record.createTime).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000 && (
            <Badge count="新" style={{ backgroundColor: '#52c41a' }} />
          )}
        </Space>
      ),
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '进行中', value: 'active' },
        { text: '已暂停', value: 'paused' },
        { text: '待开始', value: 'pending' },
        { text: '已结束', value: 'completed' },
        { text: '已终止', value: 'terminated' },
      ],
    },
    {
      title: '推广房源',
      dataIndex: 'properties',
      key: 'properties',
      render: (properties: string[]) => (
        <span>
          {properties.map(property => (
            <Tag key={property}>{property}</Tag>
          ))}
        </span>
      ),
    },
    {
      title: '预算/消费',
      key: 'budget',
      render: (text: string, record: Campaign) => (
        <span>
          ¥{record.spentAmount.toFixed(2)} / {record.budget.toFixed(0)}
          <div style={{ width: '100%', marginTop: 5 }}>
            <div style={{ 
              height: 4, 
              backgroundColor: '#f0f0f0', 
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min(100, (record.spentAmount / record.budget) * 100)}%`, 
                backgroundColor: (record.spentAmount / record.budget) > 0.8 ? '#ff4d4f' : '#1890ff',
                borderRadius: 2
              }} />
            </div>
          </div>
        </span>
      ),
      sorter: true,
    },
    {
      title: '时间',
      key: 'period',
      render: (text: string, record: Campaign) => (
        <span>{record.startDate} 至 {record.endDate}</span>
      ),
    },
    {
      title: '效果',
      children: [
        {
          title: '曝光量',
          dataIndex: 'impressions',
          key: 'impressions',
          sorter: true,
        },
        {
          title: '点击量',
          dataIndex: 'clicks',
          key: 'clicks',
          sorter: true,
          render: (clicks: number, record: Campaign) => (
            <span>
              {clicks}
              <div style={{ fontSize: '12px', color: '#888' }}>
                {record.ctr.toFixed(1)}%
              </div>
            </span>
          ),
        },
        {
          title: '预约量',
          dataIndex: 'appointments',
          key: 'appointments',
          sorter: true,
          render: (appointments: number, record: Campaign) => (
            <span>
              {appointments}
              <div style={{ fontSize: '12px', color: '#888' }}>
                {record.conversionRate.toFixed(1)}%
              </div>
            </span>
          ),
        },
      ],
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: Campaign) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewDetail(record.id)}>
            查看
          </Button>
          <Button type="link" size="small" onClick={() => handleEdit(record.id)}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => handleAnalytics(record.id)}>
            分析
          </Button>
          {(record.status === 'active' || record.status === 'paused') && (
            <Button 
              type="link" 
              danger 
              size="small" 
              onClick={() => handleStatusChange(record.id, record.status)}
            >
              {record.status === 'active' ? '暂停' : '激活'}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="搜索活动名称或房源"
              prefix={<SearchOutlined />}
              value={filters.keyword}
              onChange={e => handleFilterChange('keyword', e.target.value)}
              style={{ width: '100%' }}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="状态筛选"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={value => handleFilterChange('status', value)}
            >
              <Option value="all">所有状态</Option>
              <Option value="active">进行中</Option>
              <Option value="paused">已暂停</Option>
              <Option value="pending">待开始</Option>
              <Option value="completed">已结束</Option>
              <Option value="terminated">已终止</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="房源筛选"
              style={{ width: '100%' }}
              value={filters.property}
              onChange={value => handleFilterChange('property', value)}
            >
              <Option value="all">所有房源</Option>
              <Option value="阳光花园">阳光花园</Option>
              <Option value="城市公寓">城市公寓</Option>
              <Option value="新领地">新领地</Option>
              <Option value="经济舒适">经济舒适</Option>
              <Option value="学生公寓">学生公寓</Option>
              <Option value="地铁新城">地铁新城</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
              onChange={dates => handleFilterChange('dateRange', dates)}
            />
          </Col>
          <Col span={2} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateCampaign}
            >
              新建
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 活动列表表格 */}
      <Table
        columns={columns}
        rowKey="id"
        dataSource={campaigns}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        bordered
        size="middle"
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default CampaignList; 