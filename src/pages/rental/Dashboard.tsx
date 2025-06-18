import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Tabs, Select, DatePicker, Tooltip, Button, Radio } from 'antd';
import { HomeOutlined, UserOutlined, DollarOutlined, CheckCircleOutlined, 
  EyeOutlined, AimOutlined, MessageOutlined, CalendarOutlined, 
  LineChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Area, Column, Line } from '@ant-design/plots';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('7d');
  const [selectedProperties, setSelectedProperties] = useState<string[]>(['all']);
  const [chartType, setChartType] = useState<string>('multi');

  // 模拟营销数据
  const marketingStats = {
    exposures: 2560,
    exposuresChange: 15.6,
    clicks: 387,
    clicksChange: 8.4,
    inquiries: 42,
    inquiriesChange: -3.2,
    appointments: 12,
    appointmentsChange: 20.0,
    ctr: 15.12,
    ctrChange: -6.2,
    conversionRate: 3.1,
    conversionRateChange: 10.7,
  };

  // 模拟趋势数据
  const trendData = [
    { date: '2024-03-01', exposures: 320, clicks: 50, inquiries: 5, appointments: 1 },
    { date: '2024-03-02', exposures: 340, clicks: 48, inquiries: 6, appointments: 2 },
    { date: '2024-03-03', exposures: 380, clicks: 52, inquiries: 8, appointments: 1 },
    { date: '2024-03-04', exposures: 420, clicks: 60, inquiries: 7, appointments: 2 },
    { date: '2024-03-05', exposures: 390, clicks: 55, inquiries: 6, appointments: 1 },
    { date: '2024-03-06', exposures: 450, clicks: 65, inquiries: 5, appointments: 3 },
    { date: '2024-03-07', exposures: 480, clicks: 70, inquiries: 8, appointments: 2 },
  ];

  // 模拟渠道数据
  const channelData = [
    { channel: '搜索', exposures: 1230, clicks: 185 },
    { channel: '推荐', exposures: 750, clicks: 98 },
    { channel: '地图找房', exposures: 320, clicks: 65 },
    { channel: '收藏列表', exposures: 180, clicks: 34 },
    { channel: '分享链接', exposures: 80, clicks: 5 },
  ];

  // 重新构造适合多折线图的数据格式
  interface TransformedDataItem {
    date: string;
    类别: string;
    数值: number;
  }
  
  const transformedData: TransformedDataItem[] = [];
  
  // 将原始数据转换为适合多折线图的格式
  trendData.forEach(item => {
    transformedData.push({ date: item.date, 类别: '曝光量', 数值: item.exposures });
    transformedData.push({ date: item.date, 类别: '点击量', 数值: item.clicks });
    transformedData.push({ date: item.date, 类别: '咨询量', 数值: item.inquiries });
    transformedData.push({ date: item.date, 类别: '预约量', 数值: item.appointments });
  });

  // 配置多指标趋势图
  const multiMetricTrendConfig = {
    data: transformedData,
    xField: 'date',
    yField: '数值',
    seriesField: '类别',
    smooth: true,
    legend: {
      position: 'top',
    },
    xAxis: {
      title: {
        text: '日期',
      },
    },
    yAxis: {
      title: {
        text: '数量',
      },
      nice: true,
      grid: {
        line: {
          style: {
            stroke: '#e8e8e8',
            lineWidth: 1,
            lineDash: [4, 5],
            strokeOpacity: 0.7,
          },
        },
      },
      label: {
        formatter: (v: any) => {
          return parseInt(v).toLocaleString();
        },
      },
    },
    colorField: '类别',
    color: {
      '曝光量': '#1890ff',
      '点击量': '#52c41a',
      '咨询量': '#fa8c16',
      '预约量': '#f5222d'
    },
    tooltip: {
      title: '日期',
      showCrosshairs: true,
      showMarkers: true,
      shared: true,
      formatter: (datum: any) => {
        // 使用formatter代替customContent，避免原始数据结构中的重复字段
        return { name: datum.类别, value: datum.数值 };
      }
    },
    point: {
      size: 4,
      shape: 'circle',
    },
    label: false,
    slider: {
      start: 0,
      end: 1,
    },
  };

  // 配置曝光趋势图
  const areaConfig = {
    data: trendData,
    xField: 'date',
    yField: 'exposures',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
  };

  // 配置渠道分析图
  const columnConfig = {
    data: channelData,
    xField: 'channel',
    yField: 'exposures',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      exposures: {
        alias: '曝光量',
      },
    },
  };

  // 日期范围切换处理函数
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  // 房源选择处理函数
  const handlePropertySelect = (value: string[]) => {
    setSelectedProperties(value);
  };

  return (
    <div>
      <h2>首页概览</h2>
      
      {/* 基础统计指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总房源数"
              value={42}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在租租客"
              value={28}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月收入"
              value={15680}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="空置率"
              value={33.3}
              prefix={<CheckCircleOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 营销数据模块 */}
      <Card title="房源营销数据" 
        extra={
          <div style={{ display: 'flex', gap: '16px' }}>
            <Select 
              defaultValue="7d" 
              style={{ width: 120 }} 
              onChange={handleDateRangeChange}
            >
              <Option value="1d">今日</Option>
              <Option value="7d">近7天</Option>
              <Option value="30d">近30天</Option>
              <Option value="custom">自定义</Option>
            </Select>
            <Select
              mode="multiple"
              defaultValue={['all']}
              style={{ width: 220 }}
              placeholder="选择房源"
              onChange={handlePropertySelect}
            >
              <Option value="all">全部房源</Option>
              <Option value="P001">阳光花园</Option>
              <Option value="P002">城市公寓</Option>
            </Select>
            {dateRange === 'custom' && (
              <RangePicker />
            )}
          </div>
        }
      >
        {/* 营销数据统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="曝光量"
                value={marketingStats.exposures}
                prefix={<EyeOutlined />}
                suffix={
                  <Tooltip title={`较上期${Math.abs(marketingStats.exposuresChange)}%`}>
                    {marketingStats.exposuresChange > 0 ? (
                      <ArrowUpOutlined style={{ color: '#3f8600' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#cf1322' }} />
                    )}
                  </Tooltip>
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="点击量"
                value={marketingStats.clicks}
                prefix={<AimOutlined />}
                suffix={
                  <Tooltip title={`较上期${Math.abs(marketingStats.clicksChange)}%`}>
                    {marketingStats.clicksChange > 0 ? (
                      <ArrowUpOutlined style={{ color: '#3f8600' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#cf1322' }} />
                    )}
                  </Tooltip>
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="咨询量"
                value={marketingStats.inquiries}
                prefix={<MessageOutlined />}
                suffix={
                  <Tooltip title={`较上期${Math.abs(marketingStats.inquiriesChange)}%`}>
                    {marketingStats.inquiriesChange > 0 ? (
                      <ArrowUpOutlined style={{ color: '#3f8600' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#cf1322' }} />
                    )}
                  </Tooltip>
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="预约量"
                value={marketingStats.appointments}
                prefix={<CalendarOutlined />}
                suffix={
                  <Tooltip title={`较上期${Math.abs(marketingStats.appointmentsChange)}%`}>
                    {marketingStats.appointmentsChange > 0 ? (
                      <ArrowUpOutlined style={{ color: '#3f8600' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#cf1322' }} />
                    )}
                  </Tooltip>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* 转化率指标 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card>
              <Statistic
                title="点击率(CTR)"
                value={marketingStats.ctr}
                precision={2}
                suffix="%"
                prefix={<LineChartOutlined />}
                valueStyle={{ color: marketingStats.ctrChange > 0 ? '#3f8600' : '#cf1322' }}
              />
              <div style={{ fontSize: '12px', color: '#999' }}>
                点击量/曝光量 {marketingStats.ctrChange > 0 ? '+' : ''}
                {marketingStats.ctrChange}%
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="转化率"
                value={marketingStats.conversionRate}
                precision={2}
                suffix="%"
                prefix={<LineChartOutlined />}
                valueStyle={{ color: marketingStats.conversionRateChange > 0 ? '#3f8600' : '#cf1322' }}
              />
              <div style={{ fontSize: '12px', color: '#999' }}>
                咨询量/点击量 {marketingStats.conversionRateChange > 0 ? '+' : ''}
                {marketingStats.conversionRateChange}%
              </div>
            </Card>
          </Col>
        </Row>

        {/* 数据分析图表 */}
        <Tabs defaultActiveKey="trend">
          <TabPane tab="趋势分析" key="trend">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Radio.Group 
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="single">单指标</Radio.Button>
                <Radio.Button value="multi">多指标</Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ height: 300 }}>
              {chartType === 'single' ? (
                <Area {...areaConfig} />
              ) : (
                <Line {...multiMetricTrendConfig} />
              )}
            </div>
          </TabPane>
          <TabPane tab="渠道分析" key="channel">
            <div style={{ height: 300 }}>
              <Column {...columnConfig} />
            </div>
          </TabPane>
        </Tabs>

        <div style={{ textAlign: 'right', marginTop: 16 }}>
                          <Button type="primary" href="/rental/promotion/analytics/overview">查看详细分析</Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard; 