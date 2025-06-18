import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tabs, Select, DatePicker, Statistic, Tooltip, Progress, 
  Divider, Button, Radio, List, Avatar, Timeline, Tag } from 'antd';
import { 
  EyeOutlined, AimOutlined, MessageOutlined, CalendarOutlined, LineChartOutlined, 
  ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ExportOutlined, 
  CheckCircleOutlined, FireOutlined, ClockCircleOutlined, PropertySafetyOutlined,
  DollarOutlined, CompassOutlined, HomeOutlined, SearchOutlined
} from '@ant-design/icons';
import { Area, Pie, DualAxes, Radar, Funnel, Line } from '@ant-design/plots';
import { useParams, useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PropertyMarketingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [dateRange, setDateRange] = useState<string>('7d');
  const [metric, setMetric] = useState<string>('exposures');
  const [loading, setLoading] = useState<boolean>(true);
  const [property, setProperty] = useState<any>(null);
  const [chartType, setChartType] = useState<string>('multi');

  // 模拟获取房源数据
  useEffect(() => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      // 模拟房源数据
      setProperty({
        id: id,
        name: '阳光花园 2室1厅',
        type: '住宅',
        rentType: '整租',
        area: 85,
        price: 5000,
        address: '北京市朝阳区建国路88号',
        layout: '2室1厅1卫',
        publishDate: '2024-03-01',
        status: '审核通过',
        minRentPeriod: 3,
        depositType: '押一付一',
        marketingStats: {
          exposures: 1240,
          exposuresChange: 15.6,
          clicks: 186,
          clicksChange: 8.4,
          inquiries: 24,
          inquiriesChange: -3.2,
          appointments: 7,
          appointmentsChange: 20.0,
          ctr: 15.0,
          ctrChange: -6.2,
          conversionRate: 12.9,
          conversionRateChange: 10.7,
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  // 模拟每日趋势数据
  const dailyTrendData = [
    { date: '2024-03-01', exposures: 180, clicks: 28, inquiries: 4, appointments: 1 },
    { date: '2024-03-02', exposures: 155, clicks: 22, inquiries: 3, appointments: 1 },
    { date: '2024-03-03', exposures: 220, clicks: 35, inquiries: 5, appointments: 0 },
    { date: '2024-03-04', exposures: 178, clicks: 26, inquiries: 2, appointments: 1 },
    { date: '2024-03-05', exposures: 165, clicks: 24, inquiries: 3, appointments: 1 },
    { date: '2024-03-06', exposures: 198, clicks: 31, inquiries: 4, appointments: 2 },
    { date: '2024-03-07', exposures: 210, clicks: 35, inquiries: 5, appointments: 1 },
  ];

  // 模拟用户画像数据
  const userProfileData = [
    { type: '18-24岁', value: 22 },
    { type: '25-34岁', value: 52 },
    { type: '35-44岁', value: 18 },
    { type: '45岁以上', value: 8 },
  ];

  // 模拟咨询内容分析
  const inquiryAnalysis = [
    { question: '房租是否包含物业费？', count: 8 },
    { question: '可以养宠物吗？', count: 6 },
    { question: '最早什么时候可以入住？', count: 5 },
    { question: '有没有停车位？', count: 4 },
    { question: '周边有什么公共交通？', count: 3 },
  ];

  // 模拟竞品对比数据
  const competitorData = [
    { field: '曝光量', thisProperty: 1240, competitor1: 980, competitor2: 1060 },
    { field: '点击量', thisProperty: 186, competitor1: 145, competitor2: 172 },
    { field: '点击率', thisProperty: 15.0, competitor1: 14.8, competitor2: 16.2 },
    { field: '咨询转化率', thisProperty: 12.9, competitor1: 11.0, competitor2: 9.8 },
    { field: '平均访问时长', thisProperty: 126, competitor1: 98, competitor2: 113 },
  ];

  // 模拟转化漏斗数据
  const funnelData = [
    { stage: '曝光', value: 1240 },
    { stage: '点击', value: 186 },
    { stage: '咨询', value: 24 },
    { stage: '预约', value: 7 },
    { stage: '看房', value: 4 },
    { stage: '签约', value: 1 },
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
    slider: {
      start: 0,
      end: 1,
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

  // 竞品对比图配置
  const competitorConfig = {
    data: [competitorData],
    xField: 'field',
    yField: ['thisProperty', 'competitor1', 'competitor2'],
    meta: {
      thisProperty: { alias: '本房源' },
      competitor1: { alias: '竞品A' },
      competitor2: { alias: '竞品B' },
    },
    geometryOptions: [
      {
        geometry: 'line',
        smooth: true,
        point: {
          size: 3,
          shape: 'circle',
          style: {
            fill: 'white',
            stroke: '#1890ff',
            lineWidth: 2,
          },
        },
      },
      {
        geometry: 'line',
        smooth: true,
        point: {
          size: 3,
          shape: 'circle',
          style: {
            fill: 'white',
            stroke: '#2ca02c',
            lineWidth: 2,
          },
        },
      },
      {
        geometry: 'line',
        smooth: true,
        point: {
          size: 3,
          shape: 'circle',
          style: {
            fill: 'white',
            stroke: '#ff7f0e',
            lineWidth: 2,
          },
        },
      },
    ],
  };

  // 转化漏斗图配置
  const funnelConfig = {
    data: funnelData,
    xField: 'stage',
    yField: 'value',
    compareField: 'stage',
    label: {
      position: 'middle',
      content: (datum: any) => `${datum.stage}\n${datum.value}`,
    },
  };

  // 营销效果雷达图数据
  const radarData = [
    { name: '曝光效果', item: '本房源', score: 85 },
    { name: '点击率', item: '本房源', score: 82 },
    { name: '咨询转化', item: '本房源', score: 90 },
    { name: '访问时长', item: '本房源', score: 88 },
    { name: '预约率', item: '本房源', score: 78 },
    { name: '曝光效果', item: '同区域均值', score: 75 },
    { name: '点击率', item: '同区域均值', score: 78 },
    { name: '咨询转化', item: '同区域均值', score: 72 },
    { name: '访问时长', item: '同区域均值', score: 70 },
    { name: '预约率', item: '同区域均值', score: 68 },
  ];

  // 营销效果雷达图配置
  const radarConfig = {
    data: radarData,
    xField: 'name',
    yField: 'score',
    seriesField: 'item',
    meta: {
      score: {
        alias: '分数',
        min: 0,
        max: 100,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
    },
    yAxis: {
      label: false,
      grid: {
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    point: {
      size: 2,
    },
    area: {},
  };

  if (loading || !property) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Button 
            type="link" 
            icon={<ArrowUpOutlined />} 
                          onClick={() => navigate('/rental/promotion/analytics/overview')}
            style={{ padding: 0, marginRight: 8 }}
          >
            返回列表
          </Button>
          <h2 style={{ display: 'inline' }}>房源营销详情: {property.name}</h2>
        </div>
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

      {/* 房源基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>房源基本信息</div>
              <p><HomeOutlined /> 类型：{property.type} | {property.rentType}</p>
              <p><PropertySafetyOutlined /> 面积：{property.area}㎡ | 户型：{property.layout}</p>
              <p><DollarOutlined /> 租金：{property.price}元/月</p>
              <p><CompassOutlined /> 地址：{property.address}</p>
              <p><ClockCircleOutlined /> 发布时间：{property.publishDate}</p>
              <Tag color={property.status === '审核通过' ? 'green' : 'orange'}>{property.status}</Tag>
            </div>
          </Col>
          <Col span={16}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="曝光量"
                  value={property.marketingStats.exposures}
                  prefix={<EyeOutlined />}
                  suffix={
                    <Tooltip title={`较上期${Math.abs(property.marketingStats.exposuresChange)}%`}>
                      {property.marketingStats.exposuresChange > 0 ? (
                        <ArrowUpOutlined style={{ color: '#3f8600' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#cf1322' }} />
                      )}
                    </Tooltip>
                  }
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="点击量"
                  value={property.marketingStats.clicks}
                  prefix={<AimOutlined />}
                  suffix={
                    <Tooltip title={`较上期${Math.abs(property.marketingStats.clicksChange)}%`}>
                      {property.marketingStats.clicksChange > 0 ? (
                        <ArrowUpOutlined style={{ color: '#3f8600' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#cf1322' }} />
                      )}
                    </Tooltip>
                  }
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="咨询量"
                  value={property.marketingStats.inquiries}
                  prefix={<MessageOutlined />}
                  suffix={
                    <Tooltip title={`较上期${Math.abs(property.marketingStats.inquiriesChange)}%`}>
                      {property.marketingStats.inquiriesChange > 0 ? (
                        <ArrowUpOutlined style={{ color: '#3f8600' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#cf1322' }} />
                      )}
                    </Tooltip>
                  }
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="预约量"
                  value={property.marketingStats.appointments}
                  prefix={<CalendarOutlined />}
                  suffix={
                    <Tooltip title={`较上期${Math.abs(property.marketingStats.appointmentsChange)}%`}>
                      {property.marketingStats.appointmentsChange > 0 ? (
                        <ArrowUpOutlined style={{ color: '#3f8600' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#cf1322' }} />
                      )}
                    </Tooltip>
                  }
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="点击率(CTR)"
                  value={property.marketingStats.ctr}
                  precision={2}
                  suffix="%"
                  prefix={<LineChartOutlined />}
                  valueStyle={{ color: property.marketingStats.ctrChange > 0 ? '#3f8600' : '#cf1322' }}
                />
                <Progress 
                  percent={property.marketingStats.ctr} 
                  size="small" 
                  showInfo={false}
                  status={property.marketingStats.ctrChange > 0 ? 'success' : 'exception'}
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="咨询转化率"
                  value={property.marketingStats.conversionRate}
                  precision={2}
                  suffix="%"
                  prefix={<LineChartOutlined />}
                  valueStyle={{ color: property.marketingStats.conversionRateChange > 0 ? '#3f8600' : '#cf1322' }}
                />
                <Progress 
                  percent={property.marketingStats.conversionRate} 
                  size="small" 
                  showInfo={false}
                  status={property.marketingStats.conversionRateChange > 0 ? 'success' : 'exception'}
                  style={{ marginTop: 8 }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

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
          
          <TabPane tab="转化漏斗" key="funnel">
            <Row gutter={16}>
              <Col span={16}>
                <div style={{ height: 400 }}>
                  <Funnel {...funnelConfig} />
                </div>
              </Col>
              <Col span={8}>
                <Card title="转化率分析" bordered={false}>
                  <Timeline>
                    <Timeline.Item color="blue">
                      <p>曝光 → 点击: <b>{(186/1240*100).toFixed(1)}%</b></p>
                      <p style={{ fontSize: '12px', color: '#999' }}>用户从看到您的房源到点击查看详情的比率</p>
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <p>点击 → 咨询: <b>{(24/186*100).toFixed(1)}%</b></p>
                      <p style={{ fontSize: '12px', color: '#999' }}>用户从查看详情到发起咨询的比率</p>
                    </Timeline.Item>
                    <Timeline.Item color="orange">
                      <p>咨询 → 预约: <b>{(7/24*100).toFixed(1)}%</b></p>
                      <p style={{ fontSize: '12px', color: '#999' }}>用户从咨询到预约看房的比率</p>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <p>预约 → 看房: <b>{(4/7*100).toFixed(1)}%</b></p>
                      <p style={{ fontSize: '12px', color: '#999' }}>用户从预约到实际看房的比率</p>
                    </Timeline.Item>
                    <Timeline.Item color="purple">
                      <p>看房 → 签约: <b>{(1/4*100).toFixed(1)}%</b></p>
                      <p style={{ fontSize: '12px', color: '#999' }}>用户从看房到最终签约的比率</p>
                    </Timeline.Item>
                  </Timeline>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="用户画像" key="user">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="访问用户年龄分布">
                  <div style={{ height: 300 }}>
                    <Pie {...userProfileConfig} />
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="常见咨询问题" style={{ height: '100%' }}>
                  <List
                    dataSource={inquiryAnalysis}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<MessageOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                          title={item.question}
                          description={`出现${item.count}次`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="用户画像标签" style={{ height: '100%' }}>
                  <div style={{ marginBottom: 16 }}>
                    <h4>用户类型</h4>
                    <div>
                      <Tag color="blue">刚需家庭</Tag>
                      <Tag color="blue">年轻白领</Tag>
                      <Tag color="blue">通勤族</Tag>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <h4>关注因素</h4>
                    <div>
                      <Tag color="green">交通便利</Tag>
                      <Tag color="green">配套完善</Tag>
                      <Tag color="green">性价比高</Tag>
                      <Tag color="green">楼层适中</Tag>
                    </div>
                  </div>
                  <div>
                    <h4>来源渠道</h4>
                    <div>
                      <Tag color="orange">搜索</Tag>
                      <Tag color="orange">推荐</Tag>
                      <Tag color="orange">地图找房</Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="竞品分析" key="competitor">
            <Row gutter={16}>
              <Col span={16}>
                <div style={{ height: 400 }}>
                  <DualAxes {...competitorConfig} />
                </div>
              </Col>
              <Col span={8}>
                <Card title="竞争力分析">
                  <div style={{ height: 300 }}>
                    <Radar {...radarConfig} />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 优化建议 */}
      <Card title="智能优化建议" style={{ marginTop: 24 }}>
        <List
          itemLayout="horizontal"
        >
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<FireOutlined />} style={{ backgroundColor: '#ff4d4f' }} />}
              title="提高曝光量"
              description={'建议完善房源标题关键词，增加"地铁口""精装修"等高转化词汇，有助于提升搜索曝光量。'}
            />
            <Button type="primary" size="small">应用建议</Button>
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<SearchOutlined />} style={{ backgroundColor: '#1890ff' }} />}
              title="优化房源图片"
              description="您的房源图片中，客厅图片点击率最高。建议将客厅图片设为封面，并增加更多高质量的客厅照片。"
            />
            <Button type="primary" size="small">查看详情</Button>
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<CalendarOutlined />} style={{ backgroundColor: '#52c41a' }} />}
              title="增加促约率"
              description="数据显示，回复速度与预约转化率正相关。建议缩短消息回复时间，保持在15分钟以内。"
            />
            <Button type="primary" size="small">设置提醒</Button>
          </List.Item>
        </List>
      </Card>
    </div>
  );
};

export default PropertyMarketingDetail; 