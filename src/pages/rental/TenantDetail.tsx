import React from 'react';
import { Descriptions, Card, Button, Tag, Timeline, Row, Col, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailLayout } from '../../components';

// mock数据与列表保持一致
const mockTenants = [
  {
    id: 'T001',
    name: '张三',
    phone: '138****5678',
    idNumber: '110101199001011234',
    gender: '男',
    status: '在租',
    property: '阳光花园 2室1厅',
    checkInDate: '2025-03-01',
    checkOutDate: '2026-03-01',
    rent: 5200,
    contractNo: 'HT2025001',
    history: [
      { time: '2025-03-01', action: '签约入住', remark: '首次入住' },
      { time: '2025-06-01', action: '缴纳租金', remark: '按时缴纳' },
    ],
  },
  {
    id: 'T002',
    name: '李四',
    phone: '139****1234',
    idNumber: '110101199202023456',
    gender: '女',
    status: '即将到期',
    property: '城市公寓 1室1厅',
    checkInDate: '2024-05-01',
    checkOutDate: '2025-05-01',
    rent: 4200,
    contractNo: 'HT2025002',
    history: [
      { time: '2024-05-01', action: '签约入住' },
      { time: '2025-04-01', action: '缴纳租金', remark: '即将到期' },
    ],
  },
  {
    id: 'T003',
    name: '王五',
    phone: '137****9012',
    idNumber: '110101198805053333',
    gender: '男',
    status: '已退租',
    property: '海珠花园 3室2厅',
    checkInDate: '2023-03-01',
    checkOutDate: '2024-03-01',
    rent: 8000,
    contractNo: 'HT2024001',
    history: [
      { time: '2023-03-01', action: '签约入住' },
      { time: '2024-03-01', action: '退租', remark: '合同到期' },
    ],
  },
  {
    id: 'T004',
    name: '赵六',
    phone: '136****3456',
    idNumber: '110101199511116666',
    gender: '女',
    status: '在租',
    property: '天河公寓 2室1厅',
    checkInDate: '2025-01-15',
    checkOutDate: '2026-01-15',
    rent: 6000,
    contractNo: 'HT2025003',
    history: [
      { time: '2025-01-15', action: '签约入住' },
    ],
  },
  {
    id: 'T005',
    name: '孙七',
    phone: '135****8888',
    idNumber: '110101199312127777',
    gender: '男',
    status: '在租',
    property: '绿地中心 1室0厅',
    checkInDate: '2025-02-01',
    checkOutDate: '2026-02-01',
    rent: 3500,
    contractNo: 'HT2025004',
    history: [
      { time: '2025-02-01', action: '签约入住' },
    ],
  },
];

const TenantDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const tenant = mockTenants.find(t => t.id === id);

  if (!tenant) {
    message.error('未找到租客信息');
    return <div>未找到租客信息</div>;
  }

  // 面包屑配置
  const breadcrumbs = [
    { title: '租客管理', path: '/rental/tenant' },
    { title: '租客详情' },
  ];

  return (
    <DetailLayout
      breadcrumbs={breadcrumbs}
      title="租客详情"
      subtitle={`租客姓名：${tenant.name} | 合同编号：${tenant.contractNo}`}
      backPath="/rental/tenant"
    >
      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="姓名">{tenant.name}</Descriptions.Item>
          <Descriptions.Item label="手机号">{tenant.phone}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{tenant.idNumber}</Descriptions.Item>
          <Descriptions.Item label="性别">{tenant.gender}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="租赁信息" bordered column={2}>
          <Descriptions.Item label="入住状态">
            <Tag color={tenant.status === '在租' ? 'green' : tenant.status === '已退租' ? 'gray' : 'orange'}>{tenant.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="关联房源">{tenant.property}</Descriptions.Item>
          <Descriptions.Item label="入住时间">{tenant.checkInDate}</Descriptions.Item>
          <Descriptions.Item label="退租时间">{tenant.checkOutDate}</Descriptions.Item>
          <Descriptions.Item label="租金(元/月)">{tenant.rent}</Descriptions.Item>
          <Descriptions.Item label="合同编号">{tenant.contractNo}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="操作/历史记录">
        <Timeline>
          {tenant.history?.map((item, idx) => (
            <Timeline.Item key={idx} color="blue">
              <div>{item.action}</div>
              <div style={{ color: '#888', fontSize: 12 }}>{item.time}</div>
              {item.remark && <div style={{ color: '#666', fontSize: 12 }}>{item.remark}</div>}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </DetailLayout>
  );
};

export default TenantDetail; 