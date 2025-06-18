# 租房商家管理后台

一个基于 React + TypeScript + Vite + Ant Design 构建的现代化租房管理平台。

## 🚀 功能特性

- 📊 数据可视化仪表板
- 🏠 房源管理系统
- 💰 收益分析
- 👥 用户管理
- 📈 推广中心
- 🔧 系统设置

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design
- **路由**: React Router DOM
- **样式**: Styled Components
- **图表**: Ant Design Charts

## 📦 安装运行

### 本地开发

```bash
# 克隆项目
git clone https://github.com/hujianglai316/business.git

# 进入项目目录
cd business

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🌐 在线访问

项目已自动部署到 GitHub Pages: [https://hujianglai316.github.io/business/](https://hujianglai316.github.io/business/)

## 📁 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── layouts/         # 布局组件
├── pages/          # 页面组件
│   ├── auth/       # 认证相关页面
│   ├── hotel/      # 酒店管理页面
│   └── rental/     # 租房管理页面
├── utils/          # 工具函数
├── types.d.ts      # 类型定义
└── main.tsx        # 应用入口
```

## 🚀 自动部署

项目配置了 GitHub Actions 自动部署流程：

1. 推送代码到 `main` 或 `master` 分支
2. 自动触发构建和部署
3. 部署到 GitHub Pages

## 📝 开发说明

- 使用 ESLint 进行代码规范检查
- 支持 TypeScript 类型检查
- 采用模块化组件设计
- 响应式布局，支持多设备访问

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

本项目采用 MIT 许可证。 