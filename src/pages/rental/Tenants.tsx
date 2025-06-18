import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal, message, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  PlusOutlined, 
  UserOutlined, 
  HomeOutlined, 
  FileExcelOutlined,
  ExportOutlined 
} from '@ant-design/icons';
import { PageLayout, SearchFilter } from '../../components';
import type { TablePaginationConfig } from 'antd/es/table';
import type { StatisticItem, HeaderAction } from '../../components/PageLayout';
import type { FilterItem, ActionButton } from '../../components/SearchFilter';

interface Tenant {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  gender: '男' | '女';
  status: '在租' | '已退租' | '即将到期';
  property: string;
  checkInDate: string;
  checkOutDate: string;
  rent: number;
  contractNo: string;
}

const mockTenants: Tenant[] = [
  {
    id: 'T001',
    name: '张三',
    phone: '138****5678',
    idNumber: '110101199001010001',
    gender: '男',
    status: '在租',
    property: '阳光花园2室1厅',
    checkInDate: '2024-01-15',
    checkOutDate: '2024-07-15',
    rent: 3500,
    contractNo: 'HT2024001',
  },
  {
    id: 'T002',
    name: '李四',
    phone: '139****1234',
    idNumber: '110101199002020002',
    gender: '女',
    status: '即将到期',
    property: '城市公寓1室1厅',
    checkInDate: '2023-12-01',
    checkOutDate: '2024-06-01',
    rent: 2800,
    contractNo: 'HT2023099',
  },
  {
    id: 'T003',
    name: '王五',
    phone: '137****9012',
    idNumber: '110101199003030003',
    gender: '男',
    status: '已退租',
    property: '海珠花园3室2厅',
    checkInDate: '2023-06-01',
    checkOutDate: '2024-01-01',
    rent: 4200,
    contractNo: 'HT2023050',
  },
];

const Tenants: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [data, setData] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchText: '',
    status: undefined as string | undefined,
    property: '',
  });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 页面初始化
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      setData(mockTenants);
      setPagination(prev => ({ ...prev, total: mockTenants.length }));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = () => {
    const filtered = mockTenants.filter(tenant => {
      return (
        (!filters.searchText || 
         tenant.name.includes(filters.searchText) || 
         tenant.phone.includes(filters.searchText)) &&
        (!filters.status || tenant.status === filters.status) &&
        (!filters.property || tenant.property.includes(filters.property))
      );
    });
    setData(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({
      searchText: '',
      status: undefined,
      property: '',
    });
    setData(mockTenants);
    setPagination(prev => ({ ...prev, total: mockTenants.length, current: 1 }));
  };

  // 删除处理
  const handleDelete = (record: Tenant) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除租客"${record.name}"吗？`,
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
    { title: '租客管理' },
  ];

  // 统计数据配置
  const statistics: StatisticItem[] = [
    {
      title: '在租人数',
      value: data.filter(t => t.status === '在租').length,
      prefix: <UserOutlined />,
      valueStyle: { color: '#52c41a' },
    },
    {
      title: '即将到期',
      value: data.filter(t => t.status === '即将到期').length,
      prefix: <HomeOutlined />,
      valueStyle: { color: '#faad14' },
    },
    {
      title: '已退租',
      value: data.filter(t => t.status === '已退租').length,
      prefix: <FileExcelOutlined />,
      valueStyle: { color: '#999' },
    },
    {
      title: '总租客数',
      value: data.length,
      prefix: <UserOutlined />,
      valueStyle: { color: '#1890ff' },
    },
  ];

  // 页面头部操作按钮
  const headerActions: HeaderAction[] = [
    {
      key: 'add',
      label: '新增租客',
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => navigate('/rental/tenant/edit/new'),
    },
  ];

  // 筛选项配置
  const filterItems: FilterItem[] = [
    {
      key: 'searchText',
      type: 'input',
      placeholder: '搜索姓名或手机号',
      value: filters.searchText,
      onChange: (value: string) => setFilters(prev => ({ ...prev, searchText: value })),
      span: 6,
    },
    {
      key: 'status',
      type: 'select',
      placeholder: '入住状态',
      value: filters.status,
      onChange: (value: string) => setFilters(prev => ({ ...prev, status: value })),
      options: [
        { label: '在租', value: '在租' },
        { label: '已退租', value: '已退租' },
        { label: '即将到期', value: '即将到期' },
      ],
      span: 4,
    },
    {
      key: 'property',
      type: 'input',
      placeholder: '关联房源',
      value: filters.property,
      onChange: (value: string) => setFilters(prev => ({ ...prev, property: value })),
      span: 6,
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
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Tenant) => (
        <a onClick={() => navigate(`/rental/tenant/detail/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '入住状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          '在租': { color: 'green', text: '在租' },
          '已退租': { color: 'gray', text: '已退租' },
          '即将到期': { color: 'orange', text: '即将到期' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: '在租', value: '在租' },
        { text: '已退租', value: '已退租' },
        { text: '即将到期', value: '即将到期' },
      ],
    },
    {
      title: '关联房源',
      dataIndex: 'property',
      key: 'property',
    },
    {
      title: '入住时间',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
    },
    {
      title: '退租时间',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
    },
    {
      title: '租金(元/月)',
      dataIndex: 'rent',
      key: 'rent',
      sorter: true,
      render: (rent: number) => `¥${rent.toLocaleString()}`,
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Tenant) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/rental/tenant/detail/${record.id}`)}>
            详情
          </Button>
          <Button type="link" onClick={() => navigate(`/rental/tenant/edit/${record.id}`)}>
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
      title="租客管理"
      subtitle="管理所有租客信息，包括新增、编辑、合同管理等操作"
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

export default Tenants; 