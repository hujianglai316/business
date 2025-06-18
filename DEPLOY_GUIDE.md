# GitHub 部署指南

## 📋 部署前检查清单

### ✅ 已完成的配置

1. **`.gitignore`** - 已配置忽略不必要的文件
2. **`vite.config.ts`** - 已配置 GitHub Pages 部署路径
3. **`package.json`** - 已添加 homepage 字段
4. **GitHub Actions** - 已配置自动部署工作流
5. **README.md** - 已创建项目文档

### 📦 需要上传的文件

以下文件和目录需要上传到 GitHub 仓库：

```
租房商家管理后台/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
├── public/
├── .gitignore
├── README.md
├── DEPLOY_GUIDE.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── index.html
```

### 🚫 不需要上传的文件

这些文件已在 `.gitignore` 中配置忽略：
- `node_modules/` - 依赖包目录
- `dist/` - 构建输出目录
- `.DS_Store` - macOS 系统文件
- `*.swp` - 临时编辑文件

## 🚀 部署步骤

### 1. 初始化 Git 仓库并推送代码

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit: 租房商家管理后台项目"

# 添加远程仓库
git remote add origin https://github.com/hujianglai316/business.git

# 推送到主分支
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 进入 GitHub 仓库页面: https://github.com/hujianglai316/business
2. 点击 **Settings** 选项卡
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

### 3. 自动部署触发

一旦代码推送到 `main` 分支，GitHub Actions 将自动：
1. 检出代码
2. 安装依赖 (`npm ci`)
3. 构建项目 (`npm run build`)
4. 部署到 GitHub Pages

### 4. 访问部署的应用

部署完成后，应用将在以下地址可访问：
**https://hujianglai316.github.io/business/**

## 🔧 故障排除

### 构建失败
- 检查 `package.json` 中的依赖版本
- 确保所有 TypeScript 错误已修复
- 查看 GitHub Actions 日志获取详细错误信息

### 部署失败
- 确保 GitHub Pages 已正确配置
- 检查仓库权限设置
- 验证 `vite.config.ts` 中的 base 路径配置

### 页面无法访问
- 确认 GitHub Pages 已启用
- 检查 DNS 解析（可能需要几分钟生效）
- 验证部署状态在 Actions 选项卡中

## 📝 后续维护

### 更新部署
只需推送代码到 `main` 分支，自动部署将重新运行：

```bash
git add .
git commit -m "更新功能"
git push origin main
```

### 本地测试
在推送前，建议本地测试构建：

```bash
npm run build
npm run preview
```

## 🎯 性能优化建议

1. **代码分割**: 已配置 vendor、antd、router 分块
2. **资源压缩**: Vite 自动处理 JS/CSS 压缩
3. **缓存策略**: GitHub Pages 自动设置静态资源缓存

## ✨ 部署完成

恭喜！您的租房管理后台已成功配置为自动部署到 GitHub Pages。 