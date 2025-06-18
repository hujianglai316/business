import React, { useState } from 'react';
import { Card, Row, Col, Tabs, Select, DatePicker, Table, Button, Statistic, Tooltip, Radio, Progress, Tag } from 'antd';
import { 
  EyeOutlined, AimOutlined, MessageOutlined, CalendarOutlined, LineChartOutlined, 
  ArrowUpOutlined, ArrowDownOutlined, FireOutlined, BarChartOutlined, 
  UserOutlined, HomeOutlined, ExportOutlined, DollarOutlined 
} from '@ant-design/icons';
import { Area, Column, Pie, Line } from '@ant-design/plots';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface PropertyStats {
  id: string;
  name: string;
  exposures: number;
  clicks: number;
  ctr: number;
  inquiries: number;
  appointments: number;
  publishTime: string;
  conversionRate: number;
  trend: number;
}

const MarketingAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<string>('7d');
  const [metric, setMetric] = useState<string>('exposures');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [chartView, setChartView] = useState<string>('daily');
  const [chartType, setChartType] = useState<string>('multi');

  // 模拟营销汇总数据
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

  // 模拟每日趋势数据
  const dailyTrendData = [
    { date: '2024-03-01', exposures: 320, clicks: 50, inquiries: 5, appointments: 1 },
    { date: '2024-03-02', exposures: 340, clicks: 48, inquiries: 6, appointments: 2 },
    { date: '2024-03-03', exposures: 380, clicks: 52, inquiries: 8, appointments: 1 },
    { date: '2024-03-04', exposures: 420, clicks: 60, inquiries: 7, appointments: 2 },
    { date: '2024-03-05', exposures: 390, clicks: 55, inquiries: 6, appointments: 1 },
    { date: '2024-03-06', exposures: 450, clicks: 65, inquiries: 5, appointments: 3 },
    { date: '2024-03-07', exposures: 480, clicks: 70, inquiries: 8, appointments: 2 },
  ];

  // 模拟房源表现数据
  const propertyPerformanceData: PropertyStats[] = [
    { 
      id: 'P001', 
      name: '阳光花园 2室1厅', 
      exposures: 1240, 
      clicks: 186, 
      ctr: 15.0, 
      inquiries: 24, 
      appointments: 7, 
      publishTime: '2024-03-01', 
      conversionRate: 12.9,
      trend: 15.6
    },
    { 
      id: 'P002', 
      name: '城市公寓 1室1厅', 
      exposures: 980, 
      clicks: 156, 
      ctr: 15.9, 
      inquiries: 18, 
      appointments: 5, 
      publishTime: '2024-02-15', 
      conversionRate: 11.5,
      trend: -5.2
    },
    { 
      id: 'P003', 
      name: '新领地 3室2厅', 
      exposures: 340, 
      clicks: 45, 
      ctr: 13.2, 
      inquiries: 6, 
      appointments: 0, 
      publishTime: '2024-03-05', 
      conversionRate: 13.3,
      trend: 8.4
    },
  ];

  // 模拟渠道数据
  const channelData = [
    { channel: '搜索', exposures: 1230, clicks: 185, ctr: 15.0 },
    { channel: '推荐', exposures: 750, clicks: 98, ctr: 13.1 },
    { channel: '地图找房', exposures: 320, clicks: 65, ctr: 20.3 },
    { channel: '收藏列表', exposures: 180, clicks: 34, ctr: 18.9 },
    { channel: '分享链接', exposures: 80, clicks: 5, ctr: 6.3 },
  ];

  // 模拟用户画像数据
  const userProfileData = [
    { type: '18-24岁', value: 27 },
    { type: '25-34岁', value: 45 },
    { type: '35-44岁', value: 18 },
    { type: '45岁以上', value: 10 },
  ];

  // 配置曝光趋势图
  const trendConfig = {
    data: dailyTrendData,
    xField: 'date',
    yField: metric,
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
  };

  // 重新构造适合多折线图的数据格式
  interface TransformedDataItem {
    date: string;
    类别: string;
    数值: number;
  }
  
  const transformedData: TransformedDataItem[] = [];
  
  // 将原始数据转换为适合多折线图的格式
  dailyTrendData.forEach(item => {
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

  // 渠道分析图配置
  const channelConfig = {
    data: channelData,
    xField: 'channel',
    yField: metric === 'ctr' ? 'ctr' : metric,
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      exposures: { alias: '曝光量' },
      clicks: { alias: '点击量' },
      ctr: { alias: '点击率(%)' },
    },
  };

  // 用户画像图配置
  const userProfileConfig = {
    data: userProfileData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.7,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}%',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  // 房源性能表格列定义
  const columns = [
    {
      title: '房源名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PropertyStats) => (
        <a onClick={() => navigate(`/rental/marketing-analytics/property/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '曝光量',
      dataIndex: 'exposures',
      key: 'exposures',
      sorter: (a: PropertyStats, b: PropertyStats) => a.exposures - b.exposures,
    },
    {
      title: '点击量',
      dataIndex: 'clicks',
      key: 'clicks',
      sorter: (a: PropertyStats, b: PropertyStats) => a.clicks - b.clicks,
    },
    {
      title: '点击率',
      dataIndex: 'ctr',
      key: 'ctr',
      render: (ctr: number) => `${ctr.toFixed(2)}%`,
      sorter: (a: PropertyStats, b: PropertyStats) => a.ctr - b.ctr,
    },
    {
      title: '咨询量',
      dataIndex: 'inquiries',
      key: 'inquiries',
      sorter: (a: PropertyStats, b: PropertyStats) => a.inquiries - b.inquiries,
    },
    {
      title: '预约量',
      dataIndex: 'appointments',
      key: 'appointments',
      sorter: (a: PropertyStats, b: PropertyStats) => a.appointments - b.appointments,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: number) => (
        <span>
          {trend > 0 ? (
            <ArrowUpOutlined style={{ color: '#3f8600' }} />
          ) : (
            <ArrowDownOutlined style={{ color: '#cf1322' }} />
          )}
          {Math.abs(trend)}%
        </span>
      ),
      sorter: (a: PropertyStats, b: PropertyStats) => a.trend - b.trend,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PropertyStats) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/rental/marketing-analytics/property/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>房源营销数据分析</h2>
        <div>
          <Select 
            defaultValue="7d" 
            style={{ width: 120, marginRight: 16 }} 
            onChange={(value) => setDateRange(value)}
          >
            <Option value="1d">今日</Option>
            <Option value="7d">近7天</Option>
            <Option value="30d">近30天</Option>
            <Option value="custom">自定义</Option>
          </Select>
          {dateRange === 'custom' && (
            <RangePicker style={{ marginRight: 16 }} />
          )}
          <Button icon={<ExportOutlined />}>导出数据</Button>
        </div>
      </div>

      {/* 营销数据摘要 */}
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
            <Progress 
              percent={marketingStats.ctr} 
              size="small" 
              showInfo={false}
              status={marketingStats.ctrChange > 0 ? 'success' : 'exception'}
              style={{ marginTop: 8 }}
            />
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
            <Progress 
              percent={marketingStats.conversionRate * 5} // 放大显示
              size="small" 
              showInfo={false}
              status={marketingStats.conversionRateChange > 0 ? 'success' : 'exception'}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 数据分析选项卡 */}
      <Card>
        <Tabs defaultActiveKey="trend">
          <TabPane tab="趋势分析" key="trend">
            <div style={{ marginBottom: 16 }}>
              <Radio.Group value={metric} onChange={(e) => setMetric(e.target.value)} style={{ marginRight: 16 }}>
                <Radio.Button value="exposures">曝光量</Radio.Button>
                <Radio.Button value="clicks">点击量</Radio.Button>
                <Radio.Button value="inquiries">咨询量</Radio.Button>
                <Radio.Button value="appointments">预约量</Radio.Button>
              </Radio.Group>
              
              <Radio.Group value={chartView} onChange={(e) => setChartView(e.target.value)}>
                <Radio.Button value="daily">日视图</Radio.Button>
                <Radio.Button value="weekly">周视图</Radio.Button>
                <Radio.Button value="monthly">月视图</Radio.Button>
              </Radio.Group>

              <Radio.Group 
                style={{ marginLeft: 16 }}
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="single">单指标</Radio.Button>
                <Radio.Button value="multi">多指标</Radio.Button>
              </Radio.Group>
            </div>
            
            <div style={{ height: 360, marginBottom: 24 }}>
              {chartType === 'single' ? (
                <Area {...trendConfig} />
              ) : (
                <Line {...multiMetricTrendConfig} />
              )}
            </div>
          </TabPane>
          
          <TabPane tab="渠道分析" key="channel">
            <div style={{ marginBottom: 16 }}>
              <Radio.Group value={metric} onChange={(e) => setMetric(e.target.value)}>
                <Radio.Button value="exposures">曝光量</Radio.Button>
                <Radio.Button value="clicks">点击量</Radio.Button>
                <Radio.Button value="ctr">点击率</Radio.Button>
              </Radio.Group>
            </div>
            
            <div style={{ height: 300, marginBottom: 24 }}>
              <Column {...channelConfig} />
            </div>
          </TabPane>
          
          <TabPane tab="用户画像" key="user">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="访问用户年龄分布">
                  <div style={{ height: 300 }}>
                    <Pie {...userProfileConfig} />
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="用户画像标签">
                  <div style={{ marginBottom: 16 }}>
                    <h4>兴趣偏好</h4>
                    <div>
                      <Tag color="blue">刚需家庭</Tag>
                      <Tag color="blue">年轻白领</Tag>
                      <Tag color="blue">通勤便利</Tag>
                      <Tag color="blue">周边配套</Tag>
                      <Tag color="blue">精装修</Tag>
                    </div>
                  </div>
                  <div>
                    <h4>关注因素</h4>
                    <div>
                      <Tag color="green">价格</Tag>
                      <Tag color="green">地段</Tag>
                      <Tag color="green">户型</Tag>
                      <Tag color="green">交通</Tag>
                      <Tag color="green">学区</Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 房源表现列表 */}
      <Card title="房源表现排行" style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Select 
            defaultValue="all" 
            style={{ width: 150 }} 
            onChange={(value) => setPropertyType(value)}
          >
            <Option value="all">全部房源类型</Option>
            <Option value="住宅">住宅</Option>
            <Option value="公寓">公寓</Option>
            <Option value="别墅">别墅</Option>
          </Select>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={propertyPerformanceData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default MarketingAnalytics; 