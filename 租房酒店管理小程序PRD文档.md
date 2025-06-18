# 租房酒店管理小程序产品需求文档（PRD）

## 1. 项目概述

### 1.1 产品背景
基于现有PC端租房商家管理后台系统，开发移动端小程序版本，让商家能够随时随地管理房源、处理订单、回复咨询，提升管理效率和客户服务质量。

### 1.2 产品定位
**定位**: B端商家管理工具小程序
**目标**: 为租房商家和酒店商家提供移动端的全方位管理解决方案
**价值**: 提升管理效率、优化客户服务、增强数据洞察

### 1.3 产品目标
- **提升管理效率**: 移动端随时处理业务，响应速度提升30%
- **优化用户体验**: 简洁直观的移动端界面，操作便捷
- **增强数据洞察**: 实时数据展示，辅助商家决策
- **扩大服务范围**: 覆盖租房和酒店两大业务场景

## 2. 用户角色定义

### 2.1 租房商家
**角色描述**: 经营租房业务的商家，包括公寓运营商、房东、房产中介等
**主要需求**:
- 实时查看房源状态和租金收入
- 快速响应租客咨询和预约看房
- 管理租客信息和合同状态
- 发布和管理房源信息

**使用场景**:
- 外出时查看房态和处理紧急事务
- 带客户看房时快速调取房源信息
- 收到咨询时及时回复客户
- 定期查看经营数据和分析报告

### 2.2 酒店商家
**角色描述**: 经营酒店业务的商家，包括酒店管理者、前台经理、店长等
**主要需求**:
- 实时监控房态和订单状态
- 处理客户订单和入住登记
- 管理房价策略和促销活动
- 回复客户评价和处理投诉

**使用场景**:
- 移动办公时查看酒店运营状况
- 紧急情况下远程处理订单问题
- 客户到店时快速办理入住手续
- 随时查看客户评价并及时回复

## 3. 功能架构

### 3.1 整体架构图
```
租房酒店管理小程序
├── 认证模块
│   └── 统一登录（区分业务类型）
├── 租房管理模块
│   ├── 首页概览
│   ├── 房态管理
│   ├── 房源管理
│   ├── 租赁咨询
│   ├── 预约看房
│   ├── 租客管理
│   └── 消息通知
└── 酒店管理模块
    ├── 工作台
    ├── 订单管理
    ├── 房态房价管理
    ├── 评价管理
    └── 消息通知
```

### 3.2 核心功能模块
| 模块 | 租房管理 | 酒店管理 | 优先级 |
|------|----------|----------|--------|
| 首页概览 | ✅ 租房仪表板 | ✅ 酒店工作台 | P0 |
| 房态管理 | ✅ 房源状态 | ✅ 房态日历 | P0 |
| 房源/房价管理 | ✅ 房源信息 | ✅ 房价设置 | P0 |
| 咨询/订单管理 | ✅ 租赁咨询 | ✅ 订单处理 | P1 |
| 预约/评价管理 | ✅ 看房预约 | ✅ 客户评价 | P1 |
| 客户管理 | ✅ 租客信息 | ✅ 客户档案 | P1 |
| 消息通知 | ✅ 系统消息 | ✅ 业务提醒 | P1 |

## 4. 登录认证模块

### 4.1 功能描述
提供统一的登录入口，支持租房商家和酒店商家两种业务类型的身份认证。

### 4.2 页面结构
```
登录页面
├── Logo区域
├── 业务类型选择Tab
│   ├── 租房商家
│   └── 酒店商家
├── 登录表单
│   ├── 用户名输入框
│   ├── 密码输入框
│   └── 登录按钮
└── 快捷功能
    ├── 忘记密码
    └── 记住密码
```

### 4.3 详细设计

#### 4.3.1 业务类型选择
**交互设计**:
- 默认选中"租房商家"
- Tab切换时表单内容保持，仅切换登录逻辑
- 不同业务类型使用不同的主题色区分

**视觉设计**:
- 租房商家：蓝色主题（#1890FF）
- 酒店商家：橙色主题（#FA8C16）
- 选中状态有明显的视觉反馈

#### 4.3.2 表单验证
**用户名验证**:
- 必填项，不能为空
- 支持手机号、邮箱、用户名多种格式
- 实时验证格式正确性

**密码验证**:
- 必填项，不能为空
- 最小长度6位
- 支持显示/隐藏密码

#### 4.3.3 登录流程
1. 用户选择业务类型
2. 输入用户名和密码
3. 点击登录按钮
4. 系统验证身份信息
5. 登录成功后跳转到对应业务的首页
6. 登录失败显示错误提示

### 4.4 数据结构
```typescript
interface LoginRequest {
  username: string;
  password: string;
  businessType: 'rental' | 'hotel';
}

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    userInfo: {
      id: string;
      username: string;
      businessType: 'rental' | 'hotel';
      profile: {
        avatar: string;
        name: string;
        phone: string;
      };
    };
  };
  message: string;
}
```

### 4.5 异常处理
- 网络异常：显示"网络连接失败，请检查网络设置"
- 账号密码错误：显示"用户名或密码错误"
- 账号被锁定：显示"账号已被锁定，请联系管理员"
- 服务器异常：显示"系统繁忙，请稍后重试"

## 5. 租房管理模块

### 5.1 首页概览

#### 5.1.1 功能描述
为租房商家提供核心业务数据的概览视图，包括房源状态、收入统计、今日事务等关键信息。

#### 5.1.2 页面布局
```
首页概览
├── 顶部导航
│   ├── 用户头像
│   ├── 商家名称
│   └── 消息通知图标（红点提示）
├── 核心数据卡片区域
│   ├── 总房源数
│   ├── 可租房源
│   ├── 已租房源
│   └── 本月收入
├── 快捷操作区域
│   ├── 发布房源
│   ├── 房态管理
│   ├── 查看咨询
│   └── 预约看房
├── 今日事务
│   ├── 新咨询数量
│   ├── 今日预约
│   ├── 到期提醒
│   └── 待处理事项
└── 数据趋势图表
    ├── 出租率趋势（近7天）
    └── 收入趋势（近30天）
```

#### 5.1.3 核心数据卡片设计
**总房源数卡片**:
- 数值：大字号显示总数量
- 标题："总房源"
- 副标题：与上月对比变化
- 点击跳转：房源管理页面

**可租房源卡片**:
- 数值：当前可租房源数量
- 标题："可租房源"
- 副标题：占总房源百分比
- 状态色：绿色表示健康，橙色表示偏少

**已租房源卡片**:
- 数值：当前已租房源数量
- 标题："已租房源"
- 副标题：出租率百分比
- 状态色：蓝色

**本月收入卡片**:
- 数值：本月累计收入金额
- 标题："本月收入"
- 副标题：与上月同期对比
- 状态色：红色增长，绿色持平/下降

#### 5.1.4 快捷操作设计
**操作图标**:
- 发布房源：房屋+号图标
- 房态管理：日历图标
- 查看咨询：聊天气泡图标
- 预约看房：时钟图标

**交互规则**:
- 点击快捷操作直接跳转到对应功能页面
- 长按显示功能说明tooltip
- 图标上方显示待处理数量红点提示

#### 5.1.5 数据结构
```typescript
interface RentalDashboard {
  summaryData: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    monthlyRevenue: number;
    monthlyRevenueChange: number; // 与上月对比百分比
    occupancyRate: number; // 出租率
  };
  todayTasks: {
    newInquiries: number;
    todayAppointments: number;
    expiringContracts: number;
    pendingTasks: number;
  };
  trends: {
    occupancyTrend: Array<{date: string, rate: number}>;
    revenueTrend: Array<{date: string, amount: number}>;
  };
  quickActions: Array<{
    id: string;
    title: string;
    icon: string;
    route: string;
    badge?: number;
  }>;
}
```

### 5.2 房态管理

#### 5.2.1 功能描述
提供房源状态的可视化管理，支持房态查看、状态修改、批量操作等功能。

#### 5.2.2 页面布局
```
房态管理页面
├── 搜索筛选栏
│   ├── 关键词搜索
│   ├── 状态筛选
│   ├── 房型筛选
│   └── 楼层筛选
├── 视图切换
│   ├── 列表视图
│   └── 日历视图
├── 房源列表/日历
│   ├── 房源卡片
│   ├── 状态标识
│   ├── 基本信息
│   └── 快捷操作
└── 批量操作栏
    ├── 全选
    ├── 状态修改
    └── 维修设置
```

#### 5.2.3 房源卡片设计
**卡片信息**:
- 房间号：A101
- 房型：一室一厅
- 状态：可租/已租/维修
- 租金：￥2800/月
- 租客信息：张三（已租状态下显示）
- 租期：2024.01-2024.12（已租状态下显示）

**状态标识**:
- 可租：绿色圆点
- 已租：蓝色圆点
- 维修：红色圆点
- 预定：橙色圆点

**快捷操作**:
- 查看详情
- 修改状态
- 联系租客（已租状态）
- 发布招租（可租状态）

#### 5.2.4 状态修改流程
1. 点击房源卡片或选择批量操作
2. 弹出状态选择弹窗
3. 选择新状态（可租/已租/维修/预定）
4. 填写备注信息（可选）
5. 确认修改
6. 系统更新状态并刷新页面

#### 5.2.5 数据结构
```typescript
interface RoomStatus {
  id: string;
  roomNumber: string;
  roomType: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  rent: number;
  floor: number;
  area: number;
  tenant?: {
    name: string;
    phone: string;
    leaseStart: string;
    leaseEnd: string;
  };
  lastUpdate: string;
  images: string[];
}

interface RoomStatusFilter {
  keyword: string;
  status: string[];
  roomType: string[];
  floor: number[];
}
```

### 5.3 房源管理

#### 5.3.1 功能描述
提供房源信息的全生命周期管理，包括房源发布、编辑、上下架、删除等功能。

#### 5.3.2 页面布局
```
房源管理页面
├── 顶部操作栏
│   ├── 添加房源按钮
│   ├── 搜索框
│   └── 筛选按钮
├── 筛选条件（可折叠）
│   ├── 发布状态
│   ├── 房型筛选
│   ├── 价格区间
│   └── 位置区域
├── 房源列表
│   └── 房源卡片
│       ├── 房源图片
│       ├── 基本信息
│       ├── 状态标签
│       └── 操作按钮
└── 底部分页/加载更多
```

#### 5.3.3 房源卡片设计
**左侧图片区域**:
- 主图片：3:2比例
- 图片数量角标：如"5张"
- 状态标签：已发布/已下架/审核中

**右侧信息区域**:
- 房源标题：南山区科技园一室一厅
- 租金：￥2800/月（橙色高亮）
- 面积：45㎡
- 位置：深圳市南山区
- 发布时间：2024-01-15
- 浏览/咨询数据：浏览120次 咨询5次

**操作按钮**:
- 编辑：跳转到房源编辑页
- 上架/下架：切换发布状态
- 删除：删除房源（二次确认）
- 推广：跳转到推广设置

#### 5.3.4 房源编辑页面
```
房源编辑页面
├── 基本信息
│   ├── 房源标题
│   ├── 房源描述
│   ├── 租金设置
│   ├── 押金设置
│   └── 房型选择
├── 位置信息
│   ├── 省市区选择
│   ├── 详细地址
│   ├── 地图选点
│   └── 交通信息
├── 房源图片
│   ├── 图片上传（最多20张）
│   ├── 主图设置
│   └── 图片排序
├── 配套设施
│   ├── 基础设施选择
│   ├── 家具家电
│   └── 周边配套
└── 发布设置
    ├── 发布状态
    ├── 联系方式
    └── 有效期设置
```

#### 5.3.5 数据结构
```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  rent: number;
  deposit: number;
  area: number;
  roomType: string;
  address: {
    province: string;
    city: string;
    district: string;
    detail: string;
    coordinate: {lat: number, lng: number};
  };
  images: Array<{url: string, isMain: boolean}>;
  facilities: string[];
  furniture: string[];
  status: 'published' | 'draft' | 'offline' | 'reviewing';
  publishTime: string;
  validUntil: string;
  views: number;
  inquiries: number;
  contact: {
    name: string;
    phone: string;
  };
}
```

### 5.4 租赁咨询

#### 5.4.1 功能描述
管理客户的租房咨询，提供实时聊天、快速回复、客户信息管理等功能。

#### 5.4.2 页面布局
```
咨询管理页面
├── 顶部统计栏
│   ├── 未读消息数
│   ├── 今日新增
│   └── 待回复数
├── 搜索筛选栏
│   ├── 关键词搜索
│   ├── 状态筛选
│   └── 时间筛选
├── 咨询列表
│   └── 咨询卡片
│       ├── 客户头像
│       ├── 聊天摘要
│       ├── 时间状态
│       └── 未读标识
└── 快速回复栏
    ├── 常用话术
    └── 模板消息
```

#### 5.4.3 咨询卡片设计
**客户信息**:
- 头像：默认头像或微信头像
- 昵称：客户姓名或微信昵称
- 标签：新客户/老客户/VIP

**聊天摘要**:
- 最新消息内容（1行，超出省略）
- 消息时间：今天显示时分，昨天及以前显示月日
- 消息状态：已读/未读

**房源信息**:
- 咨询的房源标题
- 房源租金
- 房源位置

#### 5.4.4 聊天详情页面
```
聊天详情页面
├── 顶部房源信息
│   ├── 房源图片
│   ├── 房源标题
│   ├── 租金价格
│   └── 查看详情按钮
├── 聊天消息区域
│   ├── 消息气泡
│   ├── 时间戳
│   ├── 图片消息
│   └── 系统消息
├── 客户信息卡片
│   ├── 基本信息
│   ├── 咨询记录
│   └── 意向标签
└── 消息输入栏
    ├── 文本输入框
    ├── 图片发送
    ├── 语音录制
    └── 快速回复
```

#### 5.4.5 数据结构
```typescript
interface Consultation {
  id: string;
  customer: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    tags: string[];
  };
  property: {
    id: string;
    title: string;
    rent: number;
    image: string;
  };
  lastMessage: {
    content: string;
    type: 'text' | 'image' | 'voice';
    time: string;
    sender: 'customer' | 'merchant';
  };
  unreadCount: number;
  status: 'active' | 'closed' | 'pending';
  createTime: string;
}

interface ChatMessage {
  id: string;
  consultationId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'system';
  sender: 'customer' | 'merchant' | 'system';
  time: string;
  isRead: boolean;
}
```

### 5.5 预约看房

#### 5.5.1 功能描述
管理客户的看房预约，提供预约日历、时间安排、客户信息管理等功能。

#### 5.5.2 页面布局
```
预约看房页面
├── 日历导航
│   ├── 月份切换
│   ├── 今日定位
│   └── 预约统计
├── 预约日历
│   ├── 日期网格
│   ├── 预约标记
│   ├── 状态颜色
│   └── 数量角标
├── 当日预约列表
│   └── 预约卡片
│       ├── 客户信息
│       ├── 房源信息
│       ├── 预约时间
│       └── 操作按钮
└── 快捷操作
    ├── 添加预约
    ├── 批量确认
    └── 导出安排
```

#### 5.5.3 预约卡片设计
**客户信息**:
- 头像和姓名
- 联系电话
- 客户标签：新客户/回访客户

**房源信息**:
- 房源标题和编号
- 房源地址
- 租金价格

**预约详情**:
- 预约时间：2024-01-15 14:00-15:00
- 预约状态：待确认/已确认/已完成/已取消
- 备注信息：客户特殊要求

**操作按钮**:
- 确认预约
- 联系客户
- 修改时间
- 取消预约

#### 5.5.4 数据结构
```typescript
interface Appointment {
  id: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    tags: string[];
  };
  property: {
    id: string;
    title: string;
    address: string;
    rent: number;
  };
  appointmentTime: {
    date: string;
    startTime: string;
    endTime: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createTime: string;
  confirmTime?: string;
}
```

### 5.6 租客管理

#### 5.6.1 功能描述
管理已签约租客的信息，包括合同管理、租金管理、续租提醒等功能。

#### 5.6.2 页面布局
```
租客管理页面
├── 顶部统计
│   ├── 总租客数
│   ├── 合同到期提醒
│   └── 待收租金
├── 搜索筛选
│   ├── 姓名搜索
│   ├── 合同状态
│   └── 到期时间
├── 租客列表
│   └── 租客卡片
│       ├── 基本信息
│       ├── 合同信息
│       ├── 缴费状态
│       └── 快捷操作
└── 批量操作
    ├── 发送通知
    ├── 生成账单
    └── 导出数据
```

#### 5.6.3 租客卡片设计
**基本信息**:
- 租客头像和姓名
- 联系电话
- 身份证号（脱敏显示）

**合同信息**:
- 房间号：A101
- 租期：2024.01.01 - 2024.12.31
- 月租金：￥2800
- 押金：￥5600

**状态标识**:
- 合同状态：正常/即将到期/已到期
- 缴费状态：已缴费/待缴费/逾期

#### 5.6.4 数据结构
```typescript
interface Tenant {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  avatar: string;
  room: {
    id: string;
    number: string;
    address: string;
  };
  contract: {
    startDate: string;
    endDate: string;
    monthlyRent: number;
    deposit: number;
    status: 'active' | 'expiring' | 'expired';
  };
  payments: Array<{
    month: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    paidTime?: string;
  }>;
}
```

## 6. 酒店管理模块

### 6.1 工作台

#### 6.1.1 功能描述
为酒店商家提供核心运营数据的概览视图，包括今日入住、房态概况、收入统计等关键信息。

#### 6.1.2 页面布局
```
酒店工作台
├── 顶部导航
│   ├── 酒店名称
│   ├── 当前时间
│   └── 消息通知
├── 今日概览
│   ├── 入住人数
│   ├── 退房人数
│   ├── 入住率
│   └── 今日收入
├── 房态概览
│   ├── 总房间数
│   ├── 可用房间
│   ├── 已入住
│   └── 维修房间
├── 待处理事项
│   ├── 待确认订单
│   ├── 即将入住
│   ├── 即将退房
│   └── 待处理评价
├── 快捷操作
│   ├── 订单管理
│   ├── 房态设置
│   ├── 价格调整
│   └── 客户服务
└── 营收趋势
    ├── 近7天入住率
    └── 近30天收入
```

#### 6.1.3 数据结构
```typescript
interface HotelDashboard {
  todayOverview: {
    checkIns: number;
    checkOuts: number;
    occupancyRate: number;
    dailyRevenue: number;
  };
  roomOverview: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    maintenanceRooms: number;
  };
  pendingTasks: {
    pendingOrders: number;
    upcomingCheckIns: number;
    upcomingCheckOuts: number;
    pendingReviews: number;
  };
  trends: {
    occupancyTrend: Array<{date: string, rate: number}>;
    revenueTrend: Array<{date: string, amount: number}>;
  };
}
```

### 6.2 订单管理

#### 6.2.1 功能描述
管理酒店订单的全生命周期，包括订单确认、入住登记、退房结算等功能。

#### 6.2.2 页面布局
```
订单管理页面
├── 顶部统计栏
│   ├── 今日订单
│   ├── 待确认
│   ├── 已确认
│   └── 已完成
├── 状态筛选Tab
│   ├── 全部订单
│   ├── 待确认
│   ├── 已确认
│   ├── 已入住
│   ├── 已完成
│   └── 已取消
├── 搜索筛选栏
│   ├── 订单号搜索
│   ├── 客户姓名
│   ├── 房型筛选
│   └── 时间范围
├── 订单列表
│   └── 订单卡片
│       ├── 订单信息
│       ├── 客户信息
│       ├── 房间信息
│       └── 操作按钮
└── 批量操作
    ├── 批量确认
    ├── 批量取消
    └── 导出订单
```

#### 6.2.3 订单卡片设计
**订单基本信息**:
- 订单号：HT2024011501
- 订单状态：待确认/已确认/已入住/已完成
- 预订时间：2024-01-10 15:30
- 入住时间：2024-01-15 14:00
- 退房时间：2024-01-17 12:00

**客户信息**:
- 客户姓名：张先生
- 联系电话：138****8888
- 客户备注：需要无烟房间

**房间信息**:
- 房型：豪华大床房
- 房间号：2088（已分配）或待分配
- 房间数量：1间
- 入住人数：2人

**费用信息**:
- 房费：￥298/晚 × 2晚
- 总费用：￥596

**操作按钮**:
- 确认订单
- 分配房间
- 办理入住
- 办理退房
- 取消订单
- 联系客户

#### 6.2.4 数据结构
```typescript
interface HotelOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  customer: {
    name: string;
    phone: string;
    idCard: string;
    notes: string;
  };
  room: {
    type: string;
    number?: string;
    count: number;
    guests: number;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  pricing: {
    roomRate: number;
    totalAmount: number;
    paid: number;
    currency: string;
  };
  createTime: string;
  confirmTime?: string;
  checkInTime?: string;
  checkOutTime?: string;
}
```

### 6.3 房态房价管理

#### 6.3.1 功能描述
管理酒店房间的状态和价格，支持日历视图、批量设置、动态调价等功能。

#### 6.3.2 页面布局
```
房态房价管理页面
├── 管理类型切换
│   ├── 房态管理
│   └── 房价管理
├── 日历导航
│   ├── 月份切换
│   ├── 今日定位
│   └── 视图切换
├── 房型选择
│   ├── 全部房型
│   ├── 标准间
│   ├── 大床房
│   └── 套房
├── 日历网格
│   ├── 日期标题
│   ├── 房态/价格显示
│   ├── 可用数量
│   └── 状态颜色
├── 快捷操作栏
│   ├── 批量设置
│   ├── 价格策略
│   ├── 房态调整
│   └── 历史记录
└── 设置面板
    ├── 日期范围选择
    ├── 房型选择
    ├── 状态/价格设置
    └── 应用按钮
```

#### 6.3.3 房态日历设计
**日期网格**:
- 每个格子显示日期
- 背景色表示房态状态
- 数字显示可用房间数量

**房态颜色编码**:
- 绿色：房间充足（可用房间>总房间70%）
- 黄色：房间紧张（可用房间30%-70%）
- 红色：房间售罄（可用房间<30%）
- 灰色：暂停销售

**交互操作**:
- 点击单个日期：设置当日房态
- 长按开始选择：批量设置日期范围
- 双击：查看详细信息

#### 6.3.4 房价日历设计
**价格显示**:
- 每个格子显示房价
- 高于平均价格显示红色
- 低于平均价格显示绿色
- 特价房显示特殊标识

**动态调价**:
- 根据入住率自动调价
- 节假日价格策略
- 提前预订优惠
- 淡旺季价格调整

#### 6.3.5 数据结构
```typescript
interface RoomStatus {
  date: string;
  roomType: string;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  status: 'available' | 'tight' | 'sold_out' | 'closed';
}

interface RoomPrice {
  date: string;
  roomType: string;
  basePrice: number;
  currentPrice: number;
  discount: number;
  priceStrategy: 'base' | 'dynamic' | 'promotion' | 'holiday';
}
```

### 6.4 评价管理

#### 6.4.1 功能描述
管理客户对酒店的评价，包括评价查看、回复管理、评分统计等功能。

#### 6.4.2 页面布局
```
评价管理页面
├── 评价统计
│   ├── 总体评分
│   ├── 评价数量
│   ├── 好评率
│   └── 评分分布
├── 筛选条件
│   ├── 评分筛选
│   ├── 平台来源
│   ├── 时间范围
│   └── 回复状态
├── 评价列表
│   └── 评价卡片
│       ├── 客户信息
│       ├── 评分详情
│       ├── 评价内容
│       ├── 酒店回复
│       └── 操作按钮
└── 快速回复
    ├── 常用回复模板
    ├── 感谢语模板
    └── 解决方案模板
```

#### 6.4.3 评价卡片设计
**客户信息**:
- 客户昵称（脱敏显示）
- 入住时间
- 房型信息
- 平台来源：美团/携程/飞猪

**评分详情**:
- 总体评分：4.5星
- 分项评分：
  - 服务：5星
  - 卫生：4星
  - 设施：4星
  - 位置：5星

**评价内容**:
- 评价文字内容
- 评价图片（如有）
- 评价时间

**酒店回复**:
- 回复内容
- 回复时间
- 回复状态：已回复/待回复

#### 6.4.4 数据结构
```typescript
interface CustomerReview {
  id: string;
  customer: {
    nickname: string;
    checkInDate: string;
    roomType: string;
    platform: 'meituan' | 'ctrip' | 'fliggy' | 'direct';
  };
  rating: {
    overall: number;
    service: number;
    cleanliness: number;
    facilities: number;
    location: number;
  };
  content: {
    text: string;
    images: string[];
    createTime: string;
  };
  reply?: {
    content: string;
    replyTime: string;
    replier: string;
  };
  status: 'pending' | 'replied';
}
```

## 7. 消息通知模块

### 7.1 功能描述
为租房和酒店商家提供统一的消息通知管理，包括系统消息、业务提醒、客户消息等。

### 7.2 页面布局
```
消息通知页面
├── 消息分类Tab
│   ├── 全部消息
│   ├── 系统消息
│   ├── 业务提醒
│   └── 客户消息
├── 消息筛选
│   ├── 已读/未读
│   ├── 时间筛选
│   └── 消息类型
├── 消息列表
│   └── 消息卡片
│       ├── 消息图标
│       ├── 消息标题
│       ├── 消息内容
│       ├── 时间戳
│       └── 操作按钮
└── 批量操作
    ├── 全部已读
    ├── 批量删除
    └── 消息设置
```

### 7.3 消息类型设计
**系统消息**:
- 系统维护通知
- 功能更新提醒
- 政策变更通知

**业务提醒**:
- 合同到期提醒
- 缴费逾期提醒
- 订单异常提醒
- 评价提醒

**客户消息**:
- 新咨询消息
- 预约确认消息
- 投诉建议消息

### 7.4 数据结构
```typescript
interface Notification {
  id: string;
  type: 'system' | 'business' | 'customer';
  category: string;
  title: string;
  content: string;
  isRead: boolean;
  createTime: string;
  data?: any; // 附加数据
  actions?: Array<{
    text: string;
    action: string;
    primary?: boolean;
  }>;
}
```

## 8. 自定义TabBar设计

### 8.1 功能描述
根据用户的业务类型（租房/酒店）动态显示不同的Tab导航，提供便捷的功能入口。

### 8.2 租房商家TabBar
```typescript
const rentalTabs = [
  {
    text: '首页',
    iconPath: '/images/rental/home.png',
    selectedIconPath: '/images/rental/home-active.png',
    pagePath: '/pages/rental/dashboard/index'
  },
  {
    text: '房态',
    iconPath: '/images/rental/room.png',
    selectedIconPath: '/images/rental/room-active.png',
    pagePath: '/pages/rental/room-status/index'
  },
  {
    text: '房源',
    iconPath: '/images/rental/property.png',
    selectedIconPath: '/images/rental/property-active.png',
    pagePath: '/pages/rental/properties/index'
  },
  {
    text: '咨询',
    iconPath: '/images/rental/chat.png',
    selectedIconPath: '/images/rental/chat-active.png',
    pagePath: '/pages/rental/consultations/index',
    badge: true // 显示未读消息数量
  },
  {
    text: '我的',
    iconPath: '/images/rental/profile.png',
    selectedIconPath: '/images/rental/profile-active.png',
    pagePath: '/pages/rental/profile/index'
  }
];
```

### 8.3 酒店商家TabBar
```typescript
const hotelTabs = [
  {
    text: '工作台',
    iconPath: '/images/hotel/dashboard.png',
    selectedIconPath: '/images/hotel/dashboard-active.png',
    pagePath: '/pages/hotel/dashboard/index'
  },
  {
    text: '订单',
    iconPath: '/images/hotel/order.png',
    selectedIconPath: '/images/hotel/order-active.png',
    pagePath: '/pages/hotel/orders/index',
    badge: true // 显示待处理订单数量
  },
  {
    text: '房价',
    iconPath: '/images/hotel/price.png',
    selectedIconPath: '/images/hotel/price-active.png',
    pagePath: '/pages/hotel/room-price/index'
  },
  {
    text: '评价',
    iconPath: '/images/hotel/review.png',
    selectedIconPath: '/images/hotel/review-active.png',
    pagePath: '/pages/hotel/reviews/index',
    badge: true // 显示待回复评价数量
  },
  {
    text: '我的',
    iconPath: '/images/hotel/profile.png',
    selectedIconPath: '/images/hotel/profile-active.png',
    pagePath: '/pages/hotel/profile/index'
  }
];
```

## 9. 交互设计规范

### 9.1 页面跳转规范
- 使用小程序原生导航栏，支持返回操作
- 重要操作页面使用模态弹窗，避免页面栈过深
- Tab切换不刷新页面状态，保持用户操作连续性

### 9.2 反馈交互规范
- 网络请求时显示加载状态
- 操作成功显示成功提示（Toast）
- 操作失败显示错误信息和重试按钮
- 重要操作提供二次确认（确认取消订单等）

### 9.3 数据刷新规范
- 下拉刷新：更新当前页面数据
- 上拉加载：分页加载更多数据
- 页面切回前台：自动刷新关键数据
- 实时数据：WebSocket推送更新

本PRD文档详细定义了租房酒店管理小程序的产品需求，包含完整的功能设计、页面布局、交互规范和数据结构，可作为小程序开发的标准指导文档。 