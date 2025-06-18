import React, { useState } from 'react';
import { Card, Button, Input, Checkbox, Radio, DatePicker, Calendar, InputNumber, Space, message, Divider, Tag, Steps, Form, Select } from 'antd';
import { SearchOutlined, CalendarOutlined, SettingOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import type { RadioChangeEvent, CheckboxChangeEvent } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface RoomType {
  id: string;
  name: string;
  type: 'daily' | 'hourly';
  subTypes: RoomSubType[];
  checked: boolean;
}

interface RoomSubType {
  id: string;
  name: string;
  fullName: string;
  checked: boolean;
}

interface SelectedDate {
  date: string;
  dayOfWeek: string;
  isHoliday: boolean;
}

const BatchRoomStatus: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dateMode, setDateMode] = useState<'multi' | 'calendar'>('multi');
  const [selectedDays, setSelectedDays] = useState(0);
  const [form] = Form.useForm();

  // 模拟房型数据
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      id: '1',
      name: '高级大床房',
      type: 'daily',
      checked: false,
      subTypes: [
        {
          id: '1-1',
          name: '高级大床房-日租房',
          fullName: '高级大床房-日租房 不含早-入住当天18:00前免费取消 (1642406551)',
          checked: false,
        },
        {
          id: '1-2',
          name: '高级大床房-钟点房',
          fullName: '高级大床房-钟点房 4小时-入住前可取消 (1642720369)',
          checked: false,
        },
      ],
    },
    {
      id: '2',
      name: '商务双床房',
      type: 'daily',
      checked: false,
      subTypes: [
        {
          id: '2-1',
          name: '商务双床房-日租房',
          fullName: '商务双床房-日租房 含早-入住当天12:00前免费取消 (1642406552)',
          checked: false,
        },
      ],
    },
    {
      id: '3',
      name: '豪华套房',
      type: 'daily',
      checked: false,
      subTypes: [
        {
          id: '3-1',
          name: '豪华套房-日租房',
          fullName: '豪华套房-日租房 含双早-入住当天18:00前免费取消 (1642406553)',
          checked: false,
        },
      ],
    },
  ]);

  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);

  // 房型搜索
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAllDayRooms, setShowAllDayRooms] = useState(true);
  const [showHourlyRooms, setShowHourlyRooms] = useState(true);

  // 节假日快捷选择
  const holidays = [
    { name: '劳动节', dates: ['2024-05-01', '2024-05-02', '2024-05-03'] },
    { name: '端午节', dates: ['2024-06-10', '2024-06-11', '2024-06-12'] },
    { name: '国庆节', dates: ['2024-10-01', '2024-10-02', '2024-10-03', '2024-10-04', '2024-10-05', '2024-10-06', '2024-10-07'] },
    { name: '中秋节', dates: ['2024-09-15', '2024-09-16', '2024-09-17'] },
    { name: '元旦节', dates: ['2024-01-01', '2024-01-02', '2024-01-03'] },
  ];

  // 房型选择相关函数
  const handleRoomTypeCheck = (roomTypeId: string, checked: boolean) => {
    setRoomTypes(prev => prev.map(room => {
      if (room.id === roomTypeId) {
        return {
          ...room,
          checked,
          subTypes: room.subTypes.map(sub => ({ ...sub, checked }))
        };
      }
      return room;
    }));
  };

  const handleSubTypeCheck = (roomTypeId: string, subTypeId: string, checked: boolean) => {
    setRoomTypes(prev => prev.map(room => {
      if (room.id === roomTypeId) {
        const newSubTypes = room.subTypes.map(sub => 
          sub.id === subTypeId ? { ...sub, checked } : sub
        );
        const allChecked = newSubTypes.every(sub => sub.checked);
        const someChecked = newSubTypes.some(sub => sub.checked);
        
        return {
          ...room,
          checked: allChecked,
          subTypes: newSubTypes
        };
      }
      return room;
    }));
  };

  const handleSelectAll = () => {
    setRoomTypes(prev => prev.map(room => ({
      ...room,
      checked: true,
      subTypes: room.subTypes.map(sub => ({ ...sub, checked: true }))
    })));
  };

  const handleDeselectAll = () => {
    setRoomTypes(prev => prev.map(room => ({
      ...room,
      checked: false,
      subTypes: room.subTypes.map(sub => ({ ...sub, checked: false }))
    })));
  };

  const handleInvertSelection = () => {
    setRoomTypes(prev => prev.map(room => ({
      ...room,
      checked: !room.checked,
      subTypes: room.subTypes.map(sub => ({ ...sub, checked: !sub.checked }))
    })));
  };

  // 日期选择相关函数
  const handleDateModeChange = (e: RadioChangeEvent) => {
    setDateMode(e.target.value);
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      setDateRange(dates);
      calculateSelectedDays(dates);
    }
  };

  const calculateSelectedDays = (dates: [Dayjs | null, Dayjs | null]) => {
    if (dates[0] && dates[1]) {
      const startDate = dates[0];
      const endDate = dates[1];
      const days = endDate.diff(startDate, 'day') + 1;
      setSelectedDays(days);
    }
  };

  const handleWeekdayChange = (weekday: number, checked: boolean) => {
    if (checked) {
      setSelectedWeekdays(prev => [...prev, weekday]);
    } else {
      setSelectedWeekdays(prev => prev.filter(day => day !== weekday));
    }
  };

  const handleHolidaySelect = (holiday: typeof holidays[0]) => {
    const newDates: SelectedDate[] = holiday.dates.map(date => ({
      date,
      dayOfWeek: dayjs(date).format('dddd'),
      isHoliday: true,
    }));
    setSelectedDates(prev => [...prev, ...newDates]);
    setSelectedDays(prev => prev + holiday.dates.length);
  };

  const resetDateSelection = () => {
    setSelectedDates([]);
    setSelectedDays(0);
    setDateRange([null, null]);
  };

  // 过滤房型
  const filteredRoomTypes = roomTypes.filter(room => {
    const matchesSearch = searchKeyword === '' || 
      room.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      room.subTypes.some(sub => sub.fullName.toLowerCase().includes(searchKeyword.toLowerCase()));
    
    const matchesType = (room.type === 'daily' && showAllDayRooms) || 
                       (room.type === 'hourly' && showHourlyRooms);
    
    return matchesSearch && matchesType;
  });

  const getSelectedRoomCount = () => {
    return roomTypes.reduce((count, room) => {
      return count + room.subTypes.filter(sub => sub.checked).length;
    }, 0);
  };

  const handleSubmit = () => {
    const selectedRooms = roomTypes.flatMap(room => 
      room.subTypes.filter(sub => sub.checked).map(sub => ({
        roomTypeId: room.id,
        roomTypeName: room.name,
        subTypeId: sub.id,
        subTypeName: sub.name,
      }))
    );

    if (selectedRooms.length === 0) {
      message.error('请至少选择一个房型');
      return;
    }

    if (selectedDays === 0) {
      message.error('请选择日期');
      return;
    }

    form.validateFields().then(values => {
      console.log('批量设置数据:', {
        rooms: selectedRooms,
        dates: selectedDates.length > 0 ? selectedDates : dateRange,
        settings: values,
        selectedDays,
      });
      
      message.success(`成功设置 ${selectedRooms.length} 个房型，共 ${selectedDays} 天的房态房量`);
    });
  };

  const steps = [
    {
      title: '选择房型',
      icon: <CheckOutlined />,
    },
    {
      title: '选择日期',
      icon: <CalendarOutlined />,
    },
    {
      title: '设置房态',
      icon: <SettingOutlined />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>批量设置房态房量</h2>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          批量设置多个房型在指定日期的房态和房量信息
        </p>
      </div>

      <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

      {/* 选择房型 */}
      <Card title="选择房型" style={{ marginBottom: 24 }}>
        {/* 搜索和类型筛选 */}
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="支持ID/名称搜索"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 200 }}
          />
          <Checkbox 
            checked={showAllDayRooms}
            onChange={(e) => setShowAllDayRooms(e.target.checked)}
          >
            全日房
          </Checkbox>
          <Checkbox 
            checked={showHourlyRooms}
            onChange={(e) => setShowHourlyRooms(e.target.checked)}
          >
            钟点房
          </Checkbox>
        </Space>

        {/* 快捷选择 */}
        <Space style={{ marginBottom: 16 }}>
          <Button size="small" onClick={handleSelectAll}>全选</Button>
          <Button size="small" onClick={handleDeselectAll}>取消选择</Button>
          <Button size="small" onClick={handleInvertSelection}>反选</Button>
        </Space>

        {/* 房型列表 */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {filteredRoomTypes.map(room => (
            <div key={room.id} style={{ marginBottom: 16, border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <Checkbox
                  checked={room.checked}
                  indeterminate={room.subTypes.some(sub => sub.checked) && !room.subTypes.every(sub => sub.checked)}
                  onChange={(e) => handleRoomTypeCheck(room.id, e.target.checked)}
                >
                  <strong>{room.name}</strong>
                  <Tag color="warning" style={{ marginLeft: 8 }}>预付</Tag>
                </Checkbox>
              </div>
              <div style={{ marginLeft: 24 }}>
                {room.subTypes.map(subType => (
                  <div key={subType.id} style={{ marginBottom: 4 }}>
                    <Checkbox
                      checked={subType.checked}
                      onChange={(e) => handleSubTypeCheck(room.id, subType.id, e.target.checked)}
                    >
                      {subType.fullName}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6ffed', borderRadius: 6 }}>
          已选择 <strong>{getSelectedRoomCount()}</strong> 个房型产品
        </div>
      </Card>

      {/* 选择日期 */}
      <Card title="选择日期" style={{ marginBottom: 24 }}>
        {/* 日期模式切换 */}
        <Radio.Group value={dateMode} onChange={handleDateModeChange} style={{ marginBottom: 16 }}>
          <Radio.Button value="multi">多段模式</Radio.Button>
          <Radio.Button value="calendar">日历模式</Radio.Button>
        </Radio.Group>

        {/* 已选择天数 */}
        <div style={{ marginBottom: 16 }}>
          已选择：<span style={{ fontWeight: 'bold', color: '#1677ff' }}>{selectedDays}</span>天
          <Button type="link" size="small" onClick={resetDateSelection}>重置</Button>
        </div>

        {/* 多段模式 */}
        {dateMode === 'multi' && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                style={{ width: 300 }}
              />
              <Checkbox>
                选择多个时间段
              </Checkbox>
            </Space>
          </div>
        )}

        {/* 日历模式 */}
        {dateMode === 'calendar' && (
          <div style={{ marginBottom: 16 }}>
            <Calendar
              fullscreen={false}
              style={{ border: '1px solid #f0f0f0', borderRadius: 8 }}
            />
          </div>
        )}

        {/* 节假日选择 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>节假日快捷选择：</div>
          <Space wrap>
            {holidays.map(holiday => (
              <Button
                key={holiday.name}
                size="small"
                onClick={() => handleHolidaySelect(holiday)}
              >
                {holiday.name}
              </Button>
            ))}
          </Space>
        </div>

        {/* 适用星期 */}
        <div>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>适用星期：</div>
          <Space>
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => (
              <Checkbox
                key={day}
                checked={selectedWeekdays.includes(index + 1 === 7 ? 0 : index + 1)}
                onChange={(e) => handleWeekdayChange(index + 1 === 7 ? 0 : index + 1, e.target.checked)}
              >
                {day}
              </Checkbox>
            ))}
          </Space>
        </div>
      </Card>

      {/* 房态房量设置 */}
      <Card title="房态房量设置" style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Form.Item label="房态" name="roomStatus" initialValue="open">
              <Select>
                <Option value="open">开房</Option>
                <Option value="closed">关房</Option>
                <Option value="maintenance">维修</Option>
                <Option value="stop_sale">停售</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="可售房量" name="availableRooms" initialValue={10}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item label="价格" name="price">
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => parseFloat(value!.replace(/¥\s?|(,*)/g, '')) || 0}
                placeholder="留空则不修改"
              />
            </Form.Item>
            
            <Form.Item label="最少入住天数" name="minStay" initialValue={1}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item label="最多入住天数" name="maxStay">
              <InputNumber min={1} style={{ width: '100%' }} placeholder="不限制" />
            </Form.Item>
            
            <Form.Item label="提前预订天数" name="advanceBooking">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="不限制" />
            </Form.Item>
          </div>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ marginRight: 16 }}>
                将设置 <strong style={{ color: '#1677ff' }}>{getSelectedRoomCount()}</strong> 个房型产品，
                共 <strong style={{ color: '#1677ff' }}>{selectedDays}</strong> 天
              </span>
            </div>
            <Space>
              <Button onClick={resetDateSelection}>重置</Button>
              <Button type="primary" onClick={handleSubmit}>
                批量设置
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default BatchRoomStatus;
