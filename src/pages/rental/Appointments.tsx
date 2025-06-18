import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Input, Select, DatePicker, Button, Tag, Space, Avatar, Modal, message, Descriptions, Timeline, Calendar, List as AntdList } from 'antd';
import { SearchOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout, SearchFilter, DetailLayout } from '../../components';
import type { TablePaginationConfig } from 'antd/es/table';
import type { StatisticItem, HeaderAction } from '../../components/PageLayout';
import type { FilterItem, ActionButton } from '../../components/SearchFilter';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Appointment {
  id: string;
  appointmentNo: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userPhone: string;
  propertyId: string;
  propertyName: string;
  propertyLayout: string;
  propertyAddress: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createTime: string;
  isNew?: boolean;
  history?: {
    time: string;
    action: string;
    operator: string;
    remark?: string;
  }[];
}

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    propertyName: '',
    status: undefined as string | undefined,
    dateRange: undefined as any,
  });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 模拟获取预约数据
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // 实际项目中应该从API获取数据
      const mockData: Appointment[] = [
        {
          id: 'A001',
          appointmentNo: 'YY20250315001',
          userId: 'U001',
          userName: '张三',
          userAvatar: 'https://example.com/avatar1.jpg',
          userPhone: '138****5678',
          propertyId: 'P001',
          propertyName: '阳光花园 2室1厅',
          propertyLayout: '2室1厅1卫',
          propertyAddress: '北京市朝阳区建国路88号',
          appointmentTime: '2025-03-15 14:30',
          status: 'pending',
          createTime: '2025-03-15 10:30',
          isNew: true,
          history: [
            { time: '2025-03-15 10:30', action: '创建预约', operator: '系统' },
          ],
        },
        {
          id: 'A002',
          appointmentNo: 'YY20250315002',
          userId: 'U002',
          userName: '李四',
          userAvatar: 'https://example.com/avatar2.jpg',
          userPhone: '139****1234',
          propertyId: 'P002',
          propertyName: '城市公寓 1室1厅',
          propertyLayout: '1室1厅1卫',
          propertyAddress: '北京市海淀区中关村大街1号',
          appointmentTime: '2025-03-15 15:00',
          status: 'confirmed',
          createTime: '2025-03-15 11:00',
          history: [
            { time: '2025-03-15 11:00', action: '创建预约', operator: '系统' },
            { time: '2025-03-15 11:30', action: '确认预约', operator: '管理员' },
          ],
        },
        {
          id: 'A003',
          appointmentNo: 'YY20250315003',
          userId: 'U003',
          userName: '王五',
          userAvatar: 'https://example.com/avatar3.jpg',
          userPhone: '137****9012',
          propertyId: 'P003',
          propertyName: '海珠花园 3室2厅',
          propertyLayout: '3室2厅2卫',
          propertyAddress: '北京市朝阳区建国路88号',
          appointmentTime: '2025-03-15 16:00',
          status: 'cancelled',
          createTime: '2025-03-15 11:30',
          history: [
            { time: '2025-03-15 11:30', action: '创建预约', operator: '系统' },
            { time: '2025-03-15 12:00', action: '拒绝预约', operator: '管理员' },
          ],
        },
        {
          id: 'A004',
          appointmentNo: 'YY20250315004',
          userId: 'U004',
          userName: '赵六',
          userAvatar: 'https://example.com/avatar4.jpg',
          userPhone: '136****3456',
          propertyId: 'P004',
          propertyName: '天河公寓 2室1厅',
          propertyLayout: '2室1厅1卫',
          propertyAddress: '北京市朝阳区建国路88号',
          appointmentTime: '2025-03-15 17:00',
          status: 'completed',
          createTime: '2025-03-15 12:00',
          history: [
            { time: '2025-03-15 12:00', action: '创建预约', operator: '系统' },
            { time: '2025-03-15 12:30', action: '确认预约', operator: '管理员' },
            { time: '2025-03-15 17:30', action: '完成看房', operator: '管理员' },
          ],
        },
        {
          id: 'A005',
          appointmentNo: 'YY20250315005',
          userId: 'U005',
          userName: '孙七',
          userAvatar: 'https://example.com/avatar5.jpg',
          userPhone: '135****8888',
          propertyId: 'P005',
          propertyName: '绿地中心 1室0厅',
          propertyLayout: '1室0厅1卫',
          propertyAddress: '北京市丰台区南三环西路99号',
          appointmentTime: '2025-03-16 10:00',
          status: 'pending',
          createTime: '2025-03-15 13:00',
          isNew: true,
          history: [
            { time: '2025-03-15 13:00', action: '创建预约', operator: '系统' },
          ],
        },
        {
          id: 'A006',
          appointmentNo: 'YY20250315006',
          userId: 'U006',
          userName: '周八',
          userAvatar: 'https://example.com/avatar6.jpg',
          userPhone: '134****6666',
          propertyId: 'P006',
          propertyName: '蓝色港湾 3室2厅',
          propertyLayout: '3室2厅2卫',
          propertyAddress: '北京市朝阳区朝阳公园路6号',
          appointmentTime: '2025-03-16 11:00',
          status: 'confirmed',
          createTime: '2025-03-15 13:30',
          history: [
            { time: '2025-03-15 13:30', action: '创建预约', operator: '系统' },
            { time: '2025-03-15 14:00', action: '确认预约', operator: '管理员' },
          ],
        },
        {
          id: 'A007',
          appointmentNo: 'YY20250315007',
          userId: 'U007',
          userName: '钱九',
          userAvatar: 'https://example.com/avatar7.jpg',
          userPhone: '133****9999',
          propertyId: 'P007',
          propertyName: '金色家园 2室2厅',
          propertyLayout: '2室2厅1卫',
          propertyAddress: '北京市石景山区鲁谷路77号',
          appointmentTime: '2025-03-16 14:00',
          status: 'cancelled',
          createTime: '2025-03-15 14:30',
          history: [
            { time: '2025-03-15 14:30', action: '创建预约', operator: '系统' },
            { time: '2025-03-15 15:00', action: '拒绝预约', operator: '管理员' },
          ],
        },
        {
          id: 'A008',
          appointmentNo: 'YY20250315008',
          userId: 'U008',
          userName: '吴十',
          userAvatar: 'https://example.com/avatar8.jpg',
          userPhone: '132****0000',
          propertyId: 'P008',
          propertyName: '银座公寓 1室1厅',
          propertyLayout: '1室1厅1卫',
          propertyAddress: '北京市西城区西直门外大街1号',
          appointmentTime: '2025-03-16 16:00',
          status: 'completed',
          createTime: '2025-03-15 15:00',
          history: [
            { time: '2025-03-15 15:00', action: '创建预约', operator: '系统' },
            { time: '2025-03-15 15:30', action: '确认预约', operator: '管理员' },
            { time: '2025-03-16 16:30', action: '完成看房', operator: '管理员' },
          ],
        },
        {
          id: 'A009',
          appointmentNo: 'YY20250315009',
          userId: 'U009',
          userName: '郑十一',
          userAvatar: 'https://example.com/avatar9.jpg',
          userPhone: '131****1111',
          propertyId: 'P009',
          propertyName: '华贸中心 2室1厅',
          propertyLayout: '2室1厅1卫',
          propertyAddress: '北京市朝阳区建国门外大街99号',
          appointmentTime: '2025-03-17 09:30',
          status: 'confirmed',
          createTime: '2025-03-16 09:00',
          history: [
            { time: '2025-03-16 09:00', action: '创建预约', operator: '系统' },
            { time: '2025-03-16 09:30', action: '确认预约', operator: '管理员' },
          ],
        },
        {
          id: 'A010',
          appointmentNo: 'YY20250315010',
          userId: 'U010',
          userName: '冯十二',
          userAvatar: 'https://example.com/avatar10.jpg',
          userPhone: '130****2222',
          propertyId: 'P010',
          propertyName: '望京SOHO 1室1厅',
          propertyLayout: '1室1厅1卫',
          propertyAddress: '北京市朝阳区望京街道1号',
          appointmentTime: '2025-03-17 14:00',
          status: 'confirmed',
          createTime: '2025-03-16 10:00',
          history: [
            { time: '2025-03-16 10:00', action: '创建预约', operator: '系统' },
            { time: '2025-03-16 10:30', action: '确认预约', operator: '管理员' },
          ],
        },
        {
          id: 'A011',
          appointmentNo: 'YY20250315011',
          userId: 'U011',
          userName: '褚十三',
          userAvatar: 'https://example.com/avatar11.jpg',
          userPhone: '139****3333',
          propertyId: 'P011',
          propertyName: '国贸公寓 3室2厅',
          propertyLayout: '3室2厅2卫',
          propertyAddress: '北京市朝阳区建国门外大街88号',
          appointmentTime: '2025-03-18 10:00',
          status: 'confirmed',
          createTime: '2025-03-17 09:00',
          history: [
            { time: '2025-03-17 09:00', action: '创建预约', operator: '系统' },
            { time: '2025-03-17 09:30', action: '确认预约', operator: '管理员' },
          ],
        },
        {
          id: 'A012',
          appointmentNo: 'YY20250315012',
          userId: 'U012',
          userName: '卫十四',
          userAvatar: 'https://example.com/avatar12.jpg',
          userPhone: '138****4444',
          propertyId: 'P012',
          propertyName: '远洋国际 2室2厅',
          propertyLayout: '2室2厅1卫',
          propertyAddress: '北京市朝阳区东三环中路36号',
          appointmentTime: '2025-03-18 15:30',
          status: 'confirmed',
          createTime: '2025-03-17 10:00',
          history: [
            { time: '2025-03-17 10:00', action: '创建预约', operator: '系统' },
            { time: '2025-03-17 10:30', action: '确认预约', operator: '管理员' },
          ],
        },
      ];
      setAppointments(mockData);
      setPagination(prev => ({ ...prev, total: mockData.length }));

      // 如果是详情页面，获取当前预约信息
      if (id) {
        const appointment = mockData.find(item => item.id === id);
        if (appointment) {
          setCurrentAppointment(appointment);
        } else {
          message.error('预约信息不存在');
          navigate('/rental/appointment');
        }
      }
    } catch (error) {
      message.error('获取预约列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [id]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, propertyName: value }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleConfirm = (record: Appointment) => {
    Modal.confirm({
      title: '确认预约',
      content: (
        <div>
          <p>确认接受该预约申请吗？</p>
          <p>用户：{record.userName}</p>
          <p>房源：{record.propertyName}</p>
          <p>时间：{record.appointmentTime}</p>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 实际项目中应该调用API更新状态
        message.success('预约已确认');
        const updatedAppointment = {
          ...record,
          status: 'confirmed' as const,
          history: [
            ...(record.history || []),
            {
              time: new Date().toLocaleString(),
              action: '确认预约',
              operator: '管理员',
            },
          ],
        };
        setAppointments(prev =>
          prev.map(item =>
            item.id === record.id ? updatedAppointment : item
          )
        );
        if (currentAppointment?.id === record.id) {
          setCurrentAppointment(updatedAppointment);
        }
      },
    });
  };

  const handleReject = (record: Appointment) => {
    Modal.confirm({
      title: '拒绝预约',
      content: (
        <div>
          <p>请选择拒绝原因：</p>
          <Select style={{ width: '100%', marginTop: 8 }}>
            <Option value="time_conflict">时间冲突</Option>
            <Option value="property_rented">房源已租</Option>
            <Option value="user_cancelled">用户取消</Option>
          </Select>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 实际项目中应该调用API更新状态
        message.success('预约已拒绝');
        const updatedAppointment = {
          ...record,
          status: 'cancelled' as const,
          history: [
            ...(record.history || []),
            {
              time: new Date().toLocaleString(),
              action: '拒绝预约',
              operator: '管理员',
            },
          ],
        };
        setAppointments(prev =>
          prev.map(item =>
            item.id === record.id ? updatedAppointment : item
          )
        );
        if (currentAppointment?.id === record.id) {
          setCurrentAppointment(updatedAppointment);
        }
      },
    });
  };

  const handleModifyTime = (record: Appointment) => {
    Modal.confirm({
      title: '修改预约时间',
      content: (
        <div>
          <p>请选择新的预约时间：</p>
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 实际项目中应该调用API更新状态
        message.success('预约时间已修改');
      },
    });
  };

  // 获取所有已确认预约
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');

  // 获取某天的已确认预约
  const getAppointmentsByDate = (dateStr: string) => {
    return confirmedAppointments.filter(a => a.appointmentTime.startsWith(dateStr));
  };

  // 日历日期渲染
  const dateCellRender = (value: any) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayAppointments = getAppointmentsByDate(dateStr);
    if (dayAppointments.length === 0) return null;
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayAppointments.map(item => (
          <li key={item.id}>
            <Tag color="green" style={{ marginBottom: 2, fontSize: 10 }}>预约{item.appointmentTime.slice(11, 16)}</Tag>
          </li>
        ))}
      </ul>
    );
  };

  // 日历弹窗内容
  const renderCalendarModal = () => (
    <Modal
      open={calendarVisible}
      title="预约看房日历"
      width={700}
      footer={null}
      onCancel={() => { setCalendarVisible(false); setSelectedDate(null); }}
    >
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <Calendar
            fullscreen={false}
            dateCellRender={dateCellRender}
            onSelect={date => setSelectedDate(date.format('YYYY-MM-DD'))}
          />
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h4 style={{ marginBottom: 12 }}>当日已确认预约</h4>
          <AntdList
            size="small"
            dataSource={selectedDate ? getAppointmentsByDate(selectedDate) : []}
            locale={{ emptyText: '暂无预约' }}
            renderItem={item => (
              <AntdList.Item
                actions={[
                  <a key="detail" onClick={() => { setCalendarVisible(false); navigate(`/rental/appointment/detail/${item.id}`); }}>查看详情</a>
                ]}
              >
                <div>
                  <div><b>{item.appointmentTime.slice(11, 16)}</b> - {item.propertyName}</div>
                  <div style={{ color: '#888', fontSize: 12 }}>{item.userName}（{item.userPhone}）</div>
                </div>
              </AntdList.Item>
            )}
          />
        </div>
      </div>
    </Modal>
  );

  const columns = [
    {
      title: '预约编号',
      dataIndex: 'appointmentNo',
      key: 'appointmentNo',
      width: 150,
    },
    {
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (_: any, record: Appointment) => (
        <Space>
          <Avatar src={record.userAvatar} />
          <div>
            <div>{record.userName}</div>
            <div style={{ color: '#999', fontSize: 12 }}>{record.userPhone}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '房源信息',
      key: 'propertyInfo',
      width: 300,
      render: (_: any, record: Appointment) => (
        <div>
          <div>{record.propertyName}</div>
          <div style={{ color: '#666', fontSize: 12 }}>{record.propertyLayout}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{record.propertyAddress}</div>
        </div>
      ),
    },
    {
      title: '看房时间',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      width: 150,
      sorter: true,
    },
    {
      title: '预约状态',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'orange', text: '待确认' },
          confirmed: { color: 'green', text: '已确认' },
          cancelled: { color: 'red', text: '已取消' },
          completed: { color: 'blue', text: '已完成' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: '待确认', value: 'pending' },
        { text: '已确认', value: 'confirmed' },
        { text: '已取消', value: 'cancelled' },
        { text: '已完成', value: 'completed' },
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Appointment) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button type="link" onClick={() => handleConfirm(record)}>确认</Button>
              <Button type="link" danger onClick={() => handleReject(record)}>拒绝</Button>
            </>
          )}
          {record.status === 'confirmed' && (
            <Button type="link" onClick={() => handleModifyTime(record)}>修改时间</Button>
          )}
          <Button type="link" onClick={() => navigate(`/rental/appointment/detail/${record.id}`)}>
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  // 渲染预约详情页面
  const renderAppointmentDetail = () => {
    if (!currentAppointment) return null;

    // 面包屑配置
    const breadcrumbs = [
      { title: '预约看房管理', path: '/rental/appointment' },
      { title: '预约详情' },
    ];

    // 详情页操作按钮
    const detailActions = [];
    if (currentAppointment.status === 'pending') {
      detailActions.push(
        {
          key: 'confirm',
          label: '确认预约',
          type: 'primary' as const,
          onClick: () => handleConfirm(currentAppointment),
        },
        {
          key: 'reject',
          label: '拒绝预约',
          danger: true,
          onClick: () => handleReject(currentAppointment),
        }
      );
    }
    if (currentAppointment.status === 'confirmed') {
      detailActions.push({
        key: 'modify',
        label: '修改时间',
        onClick: () => handleModifyTime(currentAppointment),
      });
    }

    return (
      <DetailLayout
        breadcrumbs={breadcrumbs}
        title="预约详情"
        subtitle={`预约编号：${currentAppointment.appointmentNo}`}
        backPath="/rental/appointment"
        actions={detailActions}
      >

        <Card style={{ marginBottom: 16 }}>
          <Descriptions title="基本信息" bordered>
            <Descriptions.Item label="预约编号">{currentAppointment.appointmentNo}</Descriptions.Item>
            <Descriptions.Item label="预约状态">
              <Tag color={
                currentAppointment.status === 'pending' ? 'orange' :
                currentAppointment.status === 'confirmed' ? 'green' :
                currentAppointment.status === 'cancelled' ? 'red' : 'blue'
              }>
                {
                  currentAppointment.status === 'pending' ? '待确认' :
                  currentAppointment.status === 'confirmed' ? '已确认' :
                  currentAppointment.status === 'cancelled' ? '已取消' : '已完成'
                }
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentAppointment.createTime}</Descriptions.Item>
            <Descriptions.Item label="看房时间">{currentAppointment.appointmentTime}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Descriptions title="用户信息" bordered>
            <Descriptions.Item label="用户姓名">{currentAppointment.userName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{currentAppointment.userPhone}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Descriptions title="房源信息" bordered>
            <Descriptions.Item label="房源名称">{currentAppointment.propertyName}</Descriptions.Item>
            <Descriptions.Item label="户型">{currentAppointment.propertyLayout}</Descriptions.Item>
            <Descriptions.Item label="地址">{currentAppointment.propertyAddress}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="操作记录">
          <Timeline
            items={currentAppointment.history?.map(item => ({
              color: 'blue',
              children: (
                <div>
                  <div>{item.action}</div>
                  <div style={{ color: '#999', fontSize: 12 }}>
                    {item.time} - {item.operator}
                  </div>
                  {item.remark && (
                    <div style={{ color: '#666', fontSize: 12 }}>{item.remark}</div>
                  )}
                </div>
              ),
            }))}
          />
        </Card>
      </DetailLayout>
    );
  };

  // 渲染预约列表页面
  const renderAppointmentList = () => {
    // 面包屑配置
    const breadcrumbs = [
      { title: '预约看房管理' },
    ];

    // 统计数据配置
    const statistics: StatisticItem[] = [
      {
        title: '待确认',
        value: appointments.filter(item => item.status === 'pending').length,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#faad14' },
      },
      {
        title: '已确认',
        value: appointments.filter(item => item.status === 'confirmed').length,
        prefix: <CheckCircleOutlined />,
        valueStyle: { color: '#52c41a' },
      },
      {
        title: '已取消',
        value: appointments.filter(item => item.status === 'cancelled').length,
        prefix: <CloseCircleOutlined />,
        valueStyle: { color: '#ff4d4f' },
      },
      {
        title: '总预约数',
        value: appointments.length,
        prefix: <CalendarOutlined />,
        valueStyle: { color: '#1890ff' },
      },
    ];

    // 页面头部操作按钮
    const headerActions: HeaderAction[] = [
      {
        key: 'calendar',
        label: '预约日历',
        type: 'primary',
        icon: <CalendarOutlined />,
        onClick: () => setCalendarVisible(true),
      },
    ];

    // 筛选项配置
    const filterItems: FilterItem[] = [
      {
        key: 'propertyName',
        type: 'input',
        placeholder: '搜索房源名称',
        value: filters.propertyName,
        onChange: (value: string) => setFilters(prev => ({ ...prev, propertyName: value })),
        span: 6,
      },
      {
        key: 'status',
        type: 'select',
        placeholder: '预约状态',
        value: filters.status,
        onChange: (value: string) => setFilters(prev => ({ ...prev, status: value })),
        options: [
          { label: '待确认', value: 'pending' },
          { label: '已确认', value: 'confirmed' },
          { label: '已取消', value: 'cancelled' },
          { label: '已完成', value: 'completed' },
        ],
        span: 4,
      },
      {
        key: 'dateRange',
        type: 'dateRange',
        placeholder: '预约时间',
        value: filters.dateRange,
        onChange: (value: any) => setFilters(prev => ({ ...prev, dateRange: value })),
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
    ];

    const handleSearchAction = () => {
      // 实际项目中应该调用API进行搜索
      const filtered = appointments.filter(item => {
        return (
          (!filters.propertyName || item.propertyName.includes(filters.propertyName)) &&
          (!filters.status || item.status === filters.status)
        );
      });
      setAppointments(filtered);
      setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
    };

    const handleResetAction = () => {
      setFilters({
        propertyName: '',
        status: undefined,
        dateRange: undefined,
      });
      fetchAppointments(); // 重新获取所有数据
    };

    return (
      <PageLayout
        breadcrumbs={breadcrumbs}
        title="预约看房管理"
        subtitle="管理所有用户的看房预约，包括确认、拒绝、修改时间等操作"
        headerActions={headerActions}
        statistics={statistics}
        filterContent={
          <SearchFilter
            filters={filterItems}
            actions={filterActions}
            onSearch={handleSearchAction}
            onReset={handleResetAction}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowClassName={(record) => record.isNew ? 'new-appointment-row' : ''}
          scroll={{ x: 1200 }}
        />
        {renderCalendarModal()}
        <style>
          {`
            .new-appointment-row {
              background-color: #f0f7ff;
            }
            .ant-table-wrapper {
              overflow-x: auto;
            }
          `}
        </style>
      </PageLayout>
    );
  };

  return id ? renderAppointmentDetail() : renderAppointmentList();
};

export default Appointments; 