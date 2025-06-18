import React, { useState } from 'react';
import { Card, Tabs, Form, InputNumber, Button, Table, Select, DatePicker, Space, message, Divider, Switch, Tag, Modal, Radio, Input } from 'antd';
import type { TabsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface RoomTypePrice {
  id: string;
  name: string;
  standardPrice: number;
  floorPrice: number;
}

interface SeasonRule {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  roomTypes: string[];
  adjustType: string;
  adjustValue: number;
  status: boolean;
}

interface WeekdayRule {
  id: string;
  name: string;
  weekdays: number[];
  roomTypes: string[];
  adjustType: string;
  adjustValue: number;
  status: boolean;
}

const PriceSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [basicForm] = Form.useForm();
  const [seasonForm] = Form.useForm();
  const [weekdayForm] = Form.useForm();
  
  // 模拟数据
  const [roomTypePrices, setRoomTypePrices] = useState<RoomTypePrice[]>([
    { id: '1', name: '标准大床房', standardPrice: 388, floorPrice: 280 },
    { id: '2', name: '豪华大床房', standardPrice: 488, floorPrice: 380 },
    { id: '3', name: '豪华双床房', standardPrice: 528, floorPrice: 420 },
    { id: '4', name: '行政套房', standardPrice: 888, floorPrice: 680 },
  ]);

  const [seasonRules, setSeasonRules] = useState<SeasonRule[]>([
    { 
      id: '1', 
      name: '春季促销',
      startDate: '2024-03-01',
      endDate: '2024-05-31',
      roomTypes: ['标准大床房', '豪华大床房'],
      adjustType: 'decrease_percent',
      adjustValue: 15,
      status: true
    },
    { 
      id: '2', 
      name: '夏季旺季',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      roomTypes: ['全部房型'],
      adjustType: 'increase_percent',
      adjustValue: 20,
      status: true
    },
  ]);

  const [weekdayRules, setWeekdayRules] = useState<WeekdayRule[]>([
    { 
      id: '1', 
      name: '周末加价',
      weekdays: [5, 6], // 周五、周六
      roomTypes: ['全部房型'],
      adjustType: 'increase_percent',
      adjustValue: 25,
      status: true
    },
    { 
      id: '2', 
      name: '工作日优惠',
      weekdays: [1, 2, 3, 4], // 周一到周四
      roomTypes: ['标准大床房'],
      adjustType: 'decrease_amount',
      adjustValue: 50,
      status: true
    },
  ]);

  // 房型基础价格表格配置
  const roomTypePriceColumns: ColumnsType<RoomTypePrice> = [
    {
      title: '房型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '标准价格',
      dataIndex: 'standardPrice',
      key: 'standardPrice',
      render: (value: number, record: RoomTypePrice) => (
                 <InputNumber
           value={value}
           formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
           parser={(value) => parseFloat(value!.replace(/¥\s?|(,*)/g, '')) || 0}
           onChange={(newValue) => {
             const newData = roomTypePrices.map(item => 
               item.id === record.id ? { ...item, standardPrice: newValue || 0 } : item
             );
             setRoomTypePrices(newData);
           }}
         />
      ),
    },
    {
      title: '底价',
      dataIndex: 'floorPrice',
      key: 'floorPrice',
      render: (value: number, record: RoomTypePrice) => (
                 <InputNumber
           value={value}
           formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
           parser={(value) => parseFloat(value!.replace(/¥\s?|(,*)/g, '')) || 0}
           onChange={(newValue) => {
             const newData = roomTypePrices.map(item => 
               item.id === record.id ? { ...item, floorPrice: newValue || 0 } : item
             );
             setRoomTypePrices(newData);
           }}
         />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 季节规则表格配置
  const seasonRuleColumns: ColumnsType<SeasonRule> = [
    {
      title: '季节名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '适用房型',
      dataIndex: 'roomTypes',
      key: 'roomTypes',
      render: (roomTypes: string[]) => (
        <div>
          {roomTypes.map(type => (
            <Tag key={type} color="blue">{type}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '价格调整',
      key: 'adjustment',
      render: (_, record) => {
        const adjustTypeMap = {
          'increase_percent': '上调',
          'decrease_percent': '下调',
          'increase_amount': '加价',
          'decrease_amount': '减价',
        };
        const unit = record.adjustType.includes('percent') ? '%' : '元';
        return `${adjustTypeMap[record.adjustType as keyof typeof adjustTypeMap]} ${record.adjustValue}${unit}`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Switch checked={status} size="small" />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 周期规则表格配置
  const weekdayRuleColumns: ColumnsType<WeekdayRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '适用日期',
      dataIndex: 'weekdays',
      key: 'weekdays',
      render: (weekdays: number[]) => {
        const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
        return weekdays.map(day => `周${weekdayNames[day]}`).join('、');
      },
    },
    {
      title: '适用房型',
      dataIndex: 'roomTypes',
      key: 'roomTypes',
      render: (roomTypes: string[]) => (
        <div>
          {roomTypes.map(type => (
            <Tag key={type} color="green">{type}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '价格调整',
      key: 'adjustment',
      render: (_, record) => {
        const adjustTypeMap = {
          'increase_percent': '上调',
          'decrease_percent': '下调',
          'increase_amount': '加价',
          'decrease_amount': '减价',
        };
        const unit = record.adjustType.includes('percent') ? '%' : '元';
        return `${adjustTypeMap[record.adjustType as keyof typeof adjustTypeMap]} ${record.adjustValue}${unit}`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Switch checked={status} size="small" />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSaveBasicSettings = () => {
    basicForm.validateFields().then(values => {
      console.log('基础设置保存:', values);
      message.success('基础价格设置保存成功');
    });
  };

  const handleSaveSeasonRules = () => {
    message.success('季节价格规则保存成功');
  };

  const handleSaveWeekdayRules = () => {
    message.success('周期价格规则保存成功');
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'basic',
      label: (
        <span>
          <InfoCircleOutlined />
          基础价格设置
        </span>
      ),
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h5 style={{ margin: 0 }}>基础价格设置</h5>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveBasicSettings}>
              保存设置
            </Button>
          </div>

          <Form form={basicForm} layout="vertical">
            {/* 价格区间设置 */}
            <Card title="价格区间设置" size="small" style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item label="最低限价" name="minPrice" initialValue={350}>
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                    addonAfter="元"
                  />
                </Form.Item>
                <Form.Item label="最高限价" name="maxPrice" initialValue={1000}>
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                    addonAfter="元"
                  />
                </Form.Item>
              </div>
            </Card>

            {/* 佣金设置 */}
            <Card title="佣金设置" size="small" style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item label="基础佣金率" name="commissionRate" initialValue={12}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    addonAfter="%"
                  />
                </Form.Item>
                <Form.Item label="最低佣金" name="minCommission" initialValue={30}>
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                    addonAfter="元"
                  />
                </Form.Item>
              </div>
            </Card>

            {/* 房型基础价格 */}
            <Card 
              title="房型基础价格" 
              size="small"
              extra={
                <Button size="small" icon={<PlusOutlined />}>
                  添加房型
                </Button>
              }
            >
              <Table
                columns={roomTypePriceColumns}
                dataSource={roomTypePrices}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Form>
        </div>
      ),
    },
    {
      key: 'season',
      label: '季节价格规则',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h5 style={{ margin: 0 }}>季节价格规则</h5>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSeasonRules}>
              保存设置
            </Button>
          </div>

          <Card 
            title="季节规则列表"
            extra={
              <Button type="primary" size="small" icon={<PlusOutlined />}>
                添加规则
              </Button>
            }
          >
            <Table
              columns={seasonRuleColumns}
              dataSource={seasonRules}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>

          <Card title="使用说明" size="small" style={{ marginTop: 16, backgroundColor: '#f6ffed' }}>
            <p><InfoCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />季节价格规则用于设置不同时期的房价调整策略：</p>
            <ul style={{ marginLeft: 16, marginBottom: 0 }}>
              <li>可以设置多个季节规则，系统会自动处理规则重叠的情况</li>
              <li>可以选择特定房型或全部房型应用规则</li>
              <li>价格调整支持多种方式：百分比、固定金额、加价、减价</li>
              <li>建议提前设置好全年各季节的价格规则，以便更好地管理房价</li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      key: 'weekday',
      label: '周期价格规则',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h5 style={{ margin: 0 }}>周期价格规则</h5>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveWeekdayRules}>
              保存设置
            </Button>
          </div>

          <Card 
            title="周期规则列表"
            extra={
              <Button type="primary" size="small" icon={<PlusOutlined />}>
                添加规则
              </Button>
            }
          >
            <Table
              columns={weekdayRuleColumns}
              dataSource={weekdayRules}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>

          <Card title="使用说明" size="small" style={{ marginTop: 16, backgroundColor: '#f0f9ff' }}>
            <p><InfoCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />周期价格规则用于设置基于星期的房价调整策略：</p>
            <ul style={{ marginLeft: 16, marginBottom: 0 }}>
              <li>可以针对不同星期设置不同的价格策略（如周末加价）</li>
              <li>支持多选星期，灵活配置适用时间</li>
              <li>可以与季节规则同时生效，系统会按优先级叠加计算</li>
              <li>建议根据历史入住数据合理设置周期规则</li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      key: 'holiday',
      label: '节假日价格规则',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h5 style={{ margin: 0 }}>节假日价格规则</h5>
            <Button type="primary" icon={<SaveOutlined />}>
              保存设置
            </Button>
          </div>

          <Card title="功能开发中" style={{ textAlign: 'center', padding: '40px' }}>
            <p>节假日价格规则功能正在开发中，敬请期待...</p>
          </Card>
        </div>
      ),
    },
    {
      key: 'promotion',
      label: '促销价格规则',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h5 style={{ margin: 0 }}>促销价格规则</h5>
            <Button type="primary" icon={<SaveOutlined />}>
              保存设置
            </Button>
          </div>

          <Card title="功能开发中" style={{ textAlign: 'center', padding: '40px' }}>
            <p>促销价格规则功能正在开发中，敬请期待...</p>
          </Card>
        </div>
      ),
    },
    {
      key: 'smart',
      label: '智能价格策略',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h5 style={{ margin: 0 }}>智能价格策略</h5>
            <Button type="primary" icon={<SaveOutlined />}>
              保存设置
            </Button>
          </div>

          <Card title="功能开发中" style={{ textAlign: 'center', padding: '40px' }}>
            <p>智能价格策略功能正在开发中，敬请期待...</p>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>房价设置</h2>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          设置和管理酒店房间价格策略，包括基础价格、季节性调整、周期性规则等
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        tabPosition="left"
        style={{ minHeight: 600 }}
      />
    </div>
  );
};

export default PriceSettings;
