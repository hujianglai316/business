import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Space, 
  Select, 
  DatePicker, 
  Button, 
  Radio, 
  Statistic, 
  Divider, 
  Tabs,
  Typography,
  Table,
  Progress,
  Tooltip
} from 'antd';
import { 
  LineChartOutlined, 
  BarChartOutlined, 
  PieChartOutlined, 
  RollbackOutlined,
  DownloadOutlined,
  SyncOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Column, Pie } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface DailyData {
  date: string;
  impressions: number;
  clicks: number;
  leads: number;
  spent: number;
}

interface CampaignAnalytics {
  id: string;
  name: string;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  totalSpent: number;
  clickRate: number;
  conversionRate: number;
  costPerClick: number;
  costPerLead: number;
  dailyData: DailyData[];
}

// 活动数据分析页面
const CampaignAnalytics: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  
  // 状态管理
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [metrics, setMetrics] = useState<string[]>(['impressions', 'clicks', 'appointments']);
  const [chartType, setChartType] = useState<string>('line');
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // 模拟获取数据
  useEffect(() => {
    setLoading(true);
    // 模拟API调用获取数据
    setTimeout(() => {
      const mockData: CampaignAnalytics = {
        id: id!,
        name: '示例推广活动',
        totalImpressions: 50000,
        totalClicks: 2500,
        totalLeads: 100,
        totalSpent: 3500,
        clickRate: 5,
        conversionRate: 4,
        costPerClick: 1.4,
        costPerLead: 35,
        dailyData: Array.from({ length: 30 }, (_, index) => ({
          date: dayjs().subtract(29 - index, 'days').format('YYYY-MM-DD'),
          impressions: 1000 + Math.floor(Math.random() * 1000),
          clicks: 50 + Math.floor(Math.random() * 50),
          leads: 2 + Math.floor(Math.random() * 5),
          spent: 100 + Math.floor(Math.random() * 100),
        })),
      };
      setAnalytics(mockData);
      setLoading(false);
    }, 1000);
  }, [id]);

  // 返回详情页
  const handleBack = () => {
          navigate(`/rental/promotion/detail/${id}`);
  };

  // 导出数据
  const handleExport = () => {
    console.log('导出数据功能待实现');
  };

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    // 这里应该重新调用API获取数据
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  // 处理指标选择变化
  const handleMetricsChange = (values: string[]) => {
    setMetrics(values);
  };

  // 处理图表类型变化
  const handleChartTypeChange = (e: any) => {
    setChartType(e.target.value);
  };

  if (loading || !analytics) {
    return <Card loading={true}></Card>;
  }

  // 图表公共配置
  const commonConfig = {
    data: analytics.dailyData,
    xField: 'date',
    tooltip: {
      title: '日期',
      showMarkers: true,
      showContent: true,
      customContent: (title: string, items: any) => {
        return (
          `<div style="padding: 8px; color: #666; background: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            <div style="margin-bottom: 8px; font-weight: 500;">${title}</div>
            ${items.map((item: any) => `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; background-color: ${item.color};"></div>
                <div style="flex: 1; display: flex; justify-content: space-between;">
                  <span>${item.name}</span>
                  <span style="margin-left: 30px; font-weight: 500;">${item.value}</span>
                </div>
              </div>
            `).join('')}
          </div>`
        );
      }
    }
  };

  // 配置多指标趋势图
  const lineConfig = {
    ...commonConfig,
    yField: 'value',
    seriesField: 'category',
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
    },
    color: {
      '曝光量': '#1890ff',
      '点击量': '#52c41a',
      '获取线索': '#fa8c16',
      '花费金额': '#f5222d'
    },
    tooltip: {
      shared: true,
    },
    point: {
      size: 4,
      shape: 'circle',
    },
  };

  // 柱状图配置
  const columnConfig = {
    ...commonConfig,
    yField: 'value',
    seriesField: 'category',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: {
      '曝光量': '#1890ff',
      '点击量': '#52c41a',
      '获取线索': '#fa8c16',
      '花费金额': '#f5222d'
    },
  };

  // 饼图配置
  const pieConfig = {
    data: [
      { type: 'PC端', value: 40 },
      { type: '移动端', value: 45 },
      { type: '小程序', value: 15 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#1890ff', '#52c41a', '#fa8c16'],
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 趋势分析表格列配置
  const trendColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '展示次数',
      dataIndex: 'impressions',
      key: 'impressions',
      sorter: (a: DailyData, b: DailyData) => a.impressions - b.impressions,
    },
    {
      title: '点击次数',
      dataIndex: 'clicks',
      key: 'clicks',
      sorter: (a: DailyData, b: DailyData) => a.clicks - b.clicks,
    },
    {
      title: '获取线索',
      dataIndex: 'leads',
      key: 'leads',
      sorter: (a: DailyData, b: DailyData) => a.leads - b.leads,
    },
    {
      title: '花费金额',
      dataIndex: 'spent',
      key: 'spent',
      render: (spent: number) => `¥${spent.toFixed(2)}`,
      sorter: (a: DailyData, b: DailyData) => a.spent - b.spent,
    },
  ];

  const transformedData = analytics.dailyData.reduce((acc: any[], curr) => {
    const base = { date: curr.date };
    return acc.concat([
      { ...base, category: '展示次数', value: curr.impressions },
      { ...base, category: '点击次数', value: curr.clicks },
      { ...base, category: '获取线索', value: curr.leads },
      { ...base, category: '花费金额', value: curr.spent },
    ]);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <RollbackOutlined 
          onClick={handleBack} 
          style={{ fontSize: 16, marginRight: 8, cursor: 'pointer' }}
        />
        <Title level={3} style={{ margin: 0 }}>{analytics.name} - 数据分析</Title>
      </div>

      {/* 筛选器和操作按钮 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Text>日期范围：</Text>
            <RangePicker 
              allowClear={false}
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
          <Col span={8}>
            <Text>数据指标：</Text>
            <Select
              mode="multiple"
              value={metrics}
              onChange={handleMetricsChange}
              style={{ width: '100%', marginTop: 8 }}
            >
              <Option value="impressions">曝光量</Option>
              <Option value="clicks">点击量</Option>
              <Option value="leads">获取线索</Option>
              <Option value="spent">花费金额</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Text>图表类型：</Text>
            <div style={{ marginTop: 8 }}>
              <Radio.Group value={chartType} onChange={handleChartTypeChange}>
                <Radio.Button value="line"><LineChartOutlined /> 折线图</Radio.Button>
                <Radio.Button value="column"><BarChartOutlined /> 柱状图</Radio.Button>
              </Radio.Group>
            </div>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出数据
              </Button>
              <Button icon={<SyncOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 总体数据概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span>
                  总展示次数 
                  <Tooltip title="用户看到您广告的次数">
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              value={analytics.totalImpressions}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span>
                  总点击次数 
                  <Tooltip title="用户点击您广告的次数">
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              value={analytics.totalClicks}
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <Tooltip title="点击率">
                  <span style={{ fontSize: '14px', marginLeft: '8px', color: '#52c41a' }}>
                    ({analytics.clickRate}%)
                  </span>
                </Tooltip>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span>
                  总获取线索 
                  <Tooltip title="通过广告完成预约的次数">
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              value={analytics.totalLeads}
              valueStyle={{ color: '#fa8c16' }}
              suffix={
                <Tooltip title="转化率">
                  <span style={{ fontSize: '14px', marginLeft: '8px', color: '#fa8c16' }}>
                    ({analytics.conversionRate}%)
                  </span>
                </Tooltip>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span>
                  总花费金额 
                  <Tooltip title="活动总消耗的预算">
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              value={analytics.totalSpent}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 数据详情卡片 */}
      <Card 
        style={{ marginBottom: 24 }}
        tabList={[
          { key: 'overview', tab: '数据概览' },
          { key: 'trend', tab: '趋势分析' },
          { key: 'audience', tab: '受众分析' },
          { key: 'time', tab: '时间分析' },
        ]}
        activeTabKey={activeTab}
        onTabChange={(key) => setActiveTab(key)}
      >
        {activeTab === 'overview' && (
          <div>
            <Title level={5}>数据趋势</Title>
            {chartType === 'line' ? (
              <Line {...lineConfig} height={400} />
            ) : (
              <Column {...columnConfig} height={400} />
            )}
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={16}>
                <Title level={5}>转化漏斗</Title>
                <div style={{ padding: '20px 0' }}>
                  <Row gutter={[0, 16]}>
                    <Col span={24}>
                      <Tooltip title={`展示次数: ${analytics.totalImpressions}`}>
                        <div>
                          <Text>展示</Text>
                          <Progress 
                            percent={100} 
                            strokeWidth={30}
                            strokeColor="#1890ff"
                            showInfo={false}
                          />
                          <div style={{ textAlign: 'right' }}>
                            <Text strong style={{ color: '#1890ff' }}>{analytics.totalImpressions}</Text>
                          </div>
                        </div>
                      </Tooltip>
                    </Col>
                    <Col span={24}>
                      <Tooltip title={`点击次数: ${analytics.totalClicks} (${analytics.clickRate}%)`}>
                        <div>
                          <Text>点击</Text>
                          <Progress 
                            percent={analytics.clickRate} 
                            strokeWidth={30}
                            strokeColor="#52c41a"
                            showInfo={false}
                          />
                          <div style={{ textAlign: 'right' }}>
                            <Text strong style={{ color: '#52c41a' }}>
                              {analytics.totalClicks} ({analytics.clickRate}%)
                            </Text>
                          </div>
                        </div>
                      </Tooltip>
                    </Col>
                    <Col span={24}>
                      <Tooltip title={`获取线索: ${analytics.totalLeads} (${analytics.conversionRate}% 转化率)`}>
                        <div>
                          <Text>获取线索</Text>
                          <Progress 
                            percent={(analytics.totalLeads / analytics.totalImpressions) * 100} 
                            strokeWidth={30}
                            strokeColor="#fa8c16"
                            showInfo={false}
                          />
                          <div style={{ textAlign: 'right' }}>
                            <Text strong style={{ color: '#fa8c16' }}>
                              {analytics.totalLeads} ({analytics.conversionRate}%)
                            </Text>
                          </div>
                        </div>
                      </Tooltip>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col span={8}>
                <Title level={5}>设备分布</Title>
                <Pie {...pieConfig} height={300} />
              </Col>
            </Row>
          </div>
        )}
        
        {activeTab === 'trend' && (
          <div>
            <Title level={5}>每日数据</Title>
            <Table 
              dataSource={analytics.dailyData} 
              columns={trendColumns}
              rowKey="date"
              pagination={false}
              scroll={{ y: 400 }}
            />
          </div>
        )}
        
        {activeTab === 'audience' && (
          <div>
            <Title level={5}>趋势分析</Title>
            <Line {...lineConfig} data={transformedData} height={400} />
          </div>
        )}
        
        {activeTab === 'time' && (
          <div>
            <Title level={5}>时段分析</Title>
            <Column 
              {...columnConfig}
              data={analytics.dailyData.reduce((result: any[], item: any) => {
                ['impressions', 'clicks', 'leads'].forEach(metric => {
                  result.push({
                    hour: item.date.split('-')[2],
                    value: item[metric],
                    category: metric === 'impressions' ? '展示次数' : 
                             metric === 'clicks' ? '点击次数' : '获取线索'
                  });
                });
                return result;
              }, [])}
              height={400}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default CampaignAnalytics; 