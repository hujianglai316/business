import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal, message, Input, Select, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  PlusOutlined, 
  FileSearchOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  HomeOutlined,
  ExportOutlined 
} from '@ant-design/icons';
import { PageLayout, SearchFilter } from '../../components';
import type { TablePaginationConfig } from 'antd/es/table';
import type { StatisticItem, HeaderAction } from '../../components/PageLayout';
import type { FilterItem, ActionButton } from '../../components/SearchFilter';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Property {
  key: string;
  id: string;
  name: string;
  type: string;
  rentType: string;
  layout: string;
  status: string;
  publishTime: string;
  minRentPeriod: number;
  depositType: string;
}

const Properties: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchText: '',
    type: undefined as string | undefined,
    status: undefined as string | undefined,
    depositType: undefined as string | undefined,
    dateRange: undefined as any,
  });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模拟数据
  const mockData: Property[] = [
    {
      key: '1',
      id: 'P001',
      name: '阳光花园 2室1厅',
      type: '住宅',
      rentType: '整租',
      layout: '2室1厅1卫',
      status: '待审核',
      publishTime: '2024-03-15',
      minRentPeriod: 3,
      depositType: '押一付一',
    },
    {
      key: '2',
      id: 'P002',
      name: '城市公寓 1室1厅',
      type: '公寓',
      rentType: '整租',
      layout: '1室1厅1卫',
      status: '审核通过',
      publishTime: '2024-03-14',
      minRentPeriod: 6,
      depositType: '押二付一',
    },
    // ... 更多数据
  ];

  // 页面初始化
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
      setPagination(prev => ({ ...prev, total: mockData.length }));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = () => {
    // 实际项目中应该调用API进行搜索
    const filtered = mockData.filter(item => {
      return (
        (!filters.searchText || item.name.includes(filters.searchText)) &&
        (!filters.type || item.type === filters.type) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.depositType || item.depositType === filters.depositType)
      );
    });
    setData(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({
      searchText: '',
      type: undefined,
      status: undefined,
      depositType: undefined,
      dateRange: undefined,
    });
    setData(mockData);
    setPagination(prev => ({ ...prev, total: mockData.length, current: 1 }));
  };

  // 删除处理
  const handleDelete = (record: Property) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除房源"${record.name}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功');
        const newData = data.filter(item => item.id !== record.id);
        setData(newData);
        setPagination(prev => ({ ...prev, total: newData.length }));
      },
    });
  };

  // 表格分页处理
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  // 面包屑配置
  const breadcrumbs = [
    { title: '房源管理' },
  ];

  // 统计数据配置
  const statistics: StatisticItem[] = [
    {
      title: '待审核房源',
      value: data.filter(item => item.status === '待审核').length,
      prefix: <FileSearchOutlined />,
      valueStyle: { color: '#faad14' },
    },
    {
      title: '已出租房源',
      value: data.filter(item => item.status === '已出租').length,
      prefix: <CheckCircleOutlined />,
      valueStyle: { color: '#52c41a' },
    },
    {
      title: '审核不通过',
      value: data.filter(item => item.status === '审核不通过').length,
      prefix: <CloseCircleOutlined />,
      valueStyle: { color: '#ff4d4f' },
    },
    {
      title: '总房源数',
      value: data.length,
      prefix: <HomeOutlined />,
      valueStyle: { color: '#1890ff' },
    },
  ];

  // 页面头部操作按钮
  const headerActions: HeaderAction[] = [
    {
      key: 'add',
      label: '新增房源',
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => navigate('/rental/property/add'),
    },
  ];

  // 筛选项配置
  const filterItems: FilterItem[] = [
    {
      key: 'searchText',
      type: 'input',
      placeholder: '搜索房源名称',
      value: filters.searchText,
      onChange: (value: string) => setFilters(prev => ({ ...prev, searchText: value })),
      span: 6,
    },
    {
      key: 'type',
      type: 'select',
      placeholder: '房源类型',
      value: filters.type,
      onChange: (value: string) => setFilters(prev => ({ ...prev, type: value })),
      options: [
        { label: '住宅', value: '住宅' },
        { label: '公寓', value: '公寓' },
        { label: '别墅', value: '别墅' },
        { label: '商铺', value: '商铺' },
      ],
      span: 4,
    },
    {
      key: 'status',
      type: 'select',
      placeholder: '房源状态',
      value: filters.status,
      onChange: (value: string) => setFilters(prev => ({ ...prev, status: value })),
      options: [
        { label: '待审核', value: '待审核' },
        { label: '审核通过', value: '审核通过' },
        { label: '审核不通过', value: '审核不通过' },
        { label: '已下架', value: '已下架' },
        { label: '已出租', value: '已出租' },
      ],
      span: 4,
    },
    {
      key: 'depositType',
      type: 'select',
      placeholder: '押金方式',
      value: filters.depositType,
      onChange: (value: string) => setFilters(prev => ({ ...prev, depositType: value })),
      options: [
        { label: '无押金', value: '无押金' },
        { label: '押一付一', value: '押一付一' },
        { label: '押二付一', value: '押二付一' },
        { label: '押三付一', value: '押三付一' },
      ],
      span: 4,
    },
    {
      key: 'dateRange',
      type: 'dateRange',
      placeholder: '发布时间',
      value: filters.dateRange,
      onChange: (value: any) => setFilters(prev => ({ ...prev, dateRange: value })),
      span: 4,
    },
  ];

  // 筛选操作按钮
  const filterActions: ActionButton[] = [
    {
      key: 'export',
      label: '导出',
      icon: <ExportOutlined />,
      onClick: () => message.info('导出功能开发中'),
    },
    {
      key: 'batch',
      label: '批量操作',
      onClick: () => message.info('批量操作功能开发中'),
    },
  ];

  // 表格列配置
  const columns = [
    {
      title: '房源名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Property) => (
        <a onClick={() => navigate(`/rental/property/detail/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '房源类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '住宅', value: '住宅' },
        { text: '公寓', value: '公寓' },
        { text: '别墅', value: '别墅' },
        { text: '商铺', value: '商铺' },
      ],
    },
    {
      title: '租赁方式',
      dataIndex: 'rentType',
      key: 'rentType',
    },
    {
      title: '户型',
      dataIndex: 'layout',
      key: 'layout',
    },
    {
      title: '最短起租',
      dataIndex: 'minRentPeriod',
      key: 'minRentPeriod',
      render: (period: number) => `${period}月`,
    },
    {
      title: '押金方式',
      dataIndex: 'depositType',
      key: 'depositType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          '待审核': { color: 'orange', text: '待审核' },
          '审核通过': { color: 'green', text: '审核通过' },
          '审核不通过': { color: 'red', text: '审核不通过' },
          '已下架': { color: 'gray', text: '已下架' },
          '已出租': { color: 'blue', text: '已出租' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: '待审核', value: '待审核' },
        { text: '审核通过', value: '审核通过' },
        { text: '审核不通过', value: '审核不通过' },
        { text: '已下架', value: '已下架' },
        { text: '已出租', value: '已出租' },
      ],
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Property) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/rental/property/detail/${record.id}`)}>
            查看详情
          </Button>
          <Button type="link" onClick={() => navigate(`/rental/property/edit/${record.id}`)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title="房源管理"
      subtitle="管理所有房源信息，包括新增、编辑、审核、上下架等操作"
      headerActions={headerActions}
      statistics={statistics}
      filterContent={
        <SearchFilter
          filters={filterItems}
          actions={filterActions}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: 1200 }}
      />
    </PageLayout>
  );
};

export default Properties; 