# 衍策引擎官网 - YanceEngine Website

## 项目介绍

上海衍策引擎AI科技有限公司官方网站。静态网站，纯 HTML/CSS/JS，无框架依赖，部署简单，维护方便。

## 文件结构

```
YanceEngine-Website/
├── index.html              # 首页 - 公司介绍、核心产品、解决方案概览
├── products.html           # 产品服务 - AI政策智库、AI投研助手、AI应用引擎详细介绍
├── solutions.html          # 解决方案 - 面向企业、园区、创业者的解决方案
├── articles.html           # 研究文章 - 政策解读、行业分析、投研报告、技术洞察
├── about.html              # 关于我们 - 公司介绍、团队、愿景、发展历程
├── contact.html            # 联系我们 - 联系表单、企业微信、地图、公众号/视频号
├── privacy.html            # 隐私政策
├── terms.html              # 用户协议与免责声明
├── README.md               # 项目说明文档（本文件）
├── deploy.md               # 部署指南
├── css/
│   └── style.css           # 全局样式文件
├── js/
│   └── main.js             # 全局脚本（导航切换、表单处理、动画等）
└── assets/
    ├── favicon.svg         # 网站图标（浏览器标签页图标）
    └── ...                 # 其他图片资源（Logo、二维码等占位文件）
```

## 本地运行

### 方式一：直接打开

双击 `index.html` 文件，在浏览器中直接打开即可预览。

> 注意：部分功能（如fetch请求）在 `file://` 协议下可能受限，建议使用本地服务器。

### 方式二：使用 Python 本地服务器

```bash
cd ~/QoderProjects/YanceEngine-Website
python3 -m http.server 8080
```

然后在浏览器中访问：http://127.0.0.1:8080

### 方式三：使用 VS Code Live Server 插件

1. 在 VS Code 中安装 "Live Server" 扩展
2. 右键 `index.html` → "Open with Live Server"
3. 浏览器会自动打开并支持热更新

## 如何替换 Logo

当前网站使用文字 Logo（`<span class="logo-icon">衍</span>衍策引擎`）。替换为图片 Logo 的步骤：

1. 准备你的 Logo 文件（推荐 SVG 格式，也可用 PNG）
2. 将 Logo 文件放入 `assets/` 目录，替换 `assets/logo-placeholder.svg`（或直接使用新文件名）
3. 在所有 HTML 文件中，找到 Header 区域的 Logo 部分：
   ```html
   <a href="index.html" class="logo">
       <span class="logo-icon">衍</span>衍策引擎
   </a>
   ```
   替换为：
   ```html
   <a href="index.html" class="logo">
       <img src="assets/logo-placeholder.svg" alt="衍策引擎">
   </a>
   ```
4. 根据需要调整 `css/style.css` 中 `.logo img` 的样式（宽度建议 120-180px）

**或者保持文字 Logo**，只修改 `.logo-icon` 的样式（颜色、字体、大小等）。

## 如何替换二维码

网站中有两处二维码占位图需要替换为真实图片：

### 企业微信二维码

1. 将真实的企业微信二维码图片保存为 `qrcode-wechat.png`，放入 `assets/` 目录
2. 在 `contact.html` 中找到：
   ```html
   <img src="assets/qrcode-wechat-placeholder.svg"
   ```
   替换为：
   ```html
   <img src="assets/qrcode-wechat.png"
   ```

### 视频号二维码

1. 将真实的视频号二维码图片保存为 `qrcode-video.png`，放入 `assets/` 目录
2. 在 `contact.html` 中找到：
   ```html
   <img src="assets/qrcode-video-placeholder.svg"
   ```
   替换为：
   ```html
   <img src="assets/qrcode-video.png"
   ```

## 如何修改联系方式

需要在以下位置搜索并替换联系方式：

### 需要替换的内容

| 占位内容 | 替换为 |
|---|---|
| `contact@yanceengine.com` | 你的真实邮箱 |
| `上海市徐汇区` | 你的真实办公地址 |

### 需要修改的文件

- **contact.html**：页面主体中的邮箱、地址、公众号名称、视频号名称
- **所有页面的 footer 部分**：邮箱和地址信息

可以使用全局搜索快速定位：

```bash
grep -rn "contact@yanceengine.com" *.html
grep -rn "上海市徐汇区" *.html
```

## 如何添加文章

1. 打开 `articles.html`
2. 找到对应栏目的文章列表区域
3. 复制一个现有的 `article-item` 区块：
   ```html
   <div class="article-item">
       <h3>文章标题</h3>
       <p>文章摘要描述...</p>
       <a href="#">阅读全文 →</a>
   </div>
   ```
4. 修改标题、摘要内容
5. 如果需要链接到公众号文章，将 `href="#"` 替换为公众号文章的完整 URL
6. 如需链接到站内页面，将 `href` 设置为对应的 HTML 文件名

## 如何接入表单

当前联系表单为静态演示，提交后不会真正发送数据。后续可接入以下服务：

### 1. Formspree（推荐，最快上手）

将表单的 `action` 属性改为 Formspree 提供的 URL：

```html
<form action="https://formspree.io/f/你的表单ID" method="POST">
```

### 2. 飞书多维表格

使用飞书开放平台的表单 API，在 `js/main.js` 中修改表单提交逻辑，将数据写入飞书多维表格。

### 3. 企业微信机器人

在 `js/main.js` 中添加 webhook 通知逻辑，表单提交后自动发送消息到企业微信群。

### 4. 自建后端

在 `js/main.js` 中修改表单提交逻辑，通过 `fetch` 请求将数据发送到你自己的后端 API。

## 后续扩展预留

代码中已预留扩展注释标记（搜索 `TODO` 或 `扩展` 关键字），后续可添加：

- **博客系统**：支持 Markdown 文章加载，自动渲染文章列表和详情页
- **后端 API**：对接自建后端，实现表单提交、数据查询等功能
- **客户 CRM**：对接客户管理系统，自动录入咨询线索
- **飞书多维表格**：表单数据自动同步到飞书
- **企业微信机器人**：新咨询自动推送到企业微信群
- **公众号文章同步**：自动拉取微信公众号文章列表
- **视频号脚本库**：展示视频号内容和脚本
- **RAG 知识库入口**：对接企业知识库问答系统
- **AI 政策平台 Demo 入口**：展示 AI 政策智库产品 Demo

## 技术栈

- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **框架**：无框架依赖，纯静态页面
- **响应式**：适配手机、平板、电脑等多种设备
- **SEO**：包含 title、description、keywords 等 SEO 元标签
- **Open Graph**：支持微信、微博等社交平台的分享预览卡片
- **性能**：无外部依赖加载，页面加载速度快

## 浏览器兼容性

- Chrome / Edge 90+
- Firefox 90+
- Safari 14+
- 微信内置浏览器

## 部署

详见 [部署指南](deploy.md)。

## 许可证

版权所有 (c) 2025 上海衍策引擎AI科技有限公司。保留所有权利。
