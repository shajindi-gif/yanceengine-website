# 部署指南

本文档介绍衍策引擎官网的多种部署方式，你可以根据实际需求选择合适的方案。

---

## 1. Vercel 部署（推荐）

Vercel 提供免费的静态网站托管，自动 HTTPS，国内访问速度尚可，是最推荐的部署方式。

### 步骤

1. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **将代码推送到 GitHub**
   ```bash
   cd ~/QoderProjects/YanceEngine-Website
   git init
   git add .
   git commit -m "初始化官网"
   git remote add origin https://github.com/你的用户名/YanceEngine-Website.git
   git push -u origin main
   ```

3. **在 Vercel 中导入项目**
   - 点击 Vercel Dashboard 中的 "Add New" → "Project"
   - 选择 "Import Git Repository"
   - 选择你的 GitHub 仓库
   - Framework Preset 选择 "Other"
   - 点击 "Deploy"

4. **等待部署完成**
   - 部署通常在 1-2 分钟内完成
   - 部署完成后会获得一个 `xxx.vercel.app` 的访问地址

5. **绑定自定义域名（可选）**
   - 进入项目 Settings → Domains
   - 输入你的域名（如 `www.yanceengine.com`）
   - 按提示在域名服务商处添加 CNAME 记录

### 优势

- 免费额度充足
- 自动 HTTPS
- 推送代码自动部署
- 国内大部分地区可正常访问

---

## 2. GitHub Pages 部署

GitHub Pages 是 GitHub 提供的免费静态网站托管服务。

### 步骤

1. **创建 GitHub 仓库**
   - 在 GitHub 上创建一个新的公开仓库（如 `YanceEngine-Website`）

2. **推送代码到 main 分支**
   ```bash
   cd ~/QoderProjects/YanceEngine-Website
   git init
   git add .
   git commit -m "初始化官网"
   git remote add origin https://github.com/你的用户名/YanceEngine-Website.git
   git branch -M main
   git push -u origin main
   ```

3. **开启 GitHub Pages**
   - 进入仓库的 Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 `main`，文件夹选择 `/ (root)`
   - 点击 "Save"

4. **等待部署完成**
   - 通常需要 1-5 分钟
   - 部署完成后访问地址为：`https://你的用户名.github.io/YanceEngine-Website/`

5. **绑定自定义域名（可选）**
   - 在项目根目录创建 `CNAME` 文件，内容写入你的域名
   - 在域名服务商处添加 CNAME 记录指向 `你的用户名.github.io`

### 注意事项

- 仓库必须是公开的（私有仓库需要 GitHub Pro）
- 国内访问速度较慢，建议配合 CDN 使用
- 每次推送到 main 分支会自动触发部署

---

## 3. Netlify 部署

Netlify 提供类似 Vercel 的免费静态网站托管服务。

### 方式一：拖拽部署（最快）

1. 访问 https://app.netlify.com/drop
2. 将项目文件夹直接拖拽到页面上
3. 等待上传完成，获得访问地址

### 方式二：连接 GitHub 仓库

1. **注册 Netlify 账号**
   - 访问 https://www.netlify.com
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 GitHub，授权并选择仓库
   - Build command 留空
   - Publish directory 设置为 `/`（根目录）
   - 点击 "Deploy site"

3. **绑定自定义域名（可选）**
   - 进入项目 Domain settings
   - 添加自定义域名并按提示配置 DNS

### 优势

- 支持拖拽部署，无需 Git
- 自动 HTTPS
- 免费表单处理功能（可替代 Formspree）

---

## 4. 阿里云 / 腾讯云静态部署

适合需要国内高速访问的场景，但需要先完成 ICP 备案。

### 阿里云 OSS 部署

1. **购买 OSS 存储桶**
   - 登录阿里云控制台
   - 创建 Bucket（选择按量付费，地域选择离目标用户最近的区域）
   - 读写权限设置为"公共读"

2. **开启静态网站托管**
   - 进入 Bucket → 基础设置 → 静态页面
   - 默认首页设置为 `index.html`
   - 默认 404 页面设置为 `index.html` 或自定义 404 页面

3. **上传文件**
   - 通过 OSS 控制台上传所有项目文件
   - 或使用 ossutil 命令行工具批量上传：
     ```bash
     ossutil cp -r ~/QoderProjects/YanceEngine-Website/ oss://你的Bucket名称/ --update
     ```

4. **配置 CDN 加速**
   - 在阿里云 CDN 控制台添加加速域名
   - 源站类型选择 "OSS 域名"
   - 配置 HTTPS 证书

5. **绑定域名**
   - 在域名解析中添加 CNAME 记录指向 CDN 域名

### 腾讯云 COS 部署

步骤与阿里云类似：

1. 创建 COS 存储桶，开启静态网站
2. 上传文件
3. 配置 CDN 和域名

---

## 5. 域名绑定

### 购买域名

- 推荐在阿里云万网、腾讯云 DNSPod 或 Cloudflare 购买域名
- 推荐后缀：`.com`（国际通用）、`.cn`（中国域名）
- 域名建议：`yanceengine.com`

### 配置 DNS

根据部署平台，在域名服务商处添加相应的 DNS 记录：

| 部署平台 | 记录类型 | 主机记录 | 记录值 |
|---|---|---|---|
| Vercel | CNAME | www | cname.vercel-dns.com |
| GitHub Pages | CNAME | www | 用户名.github.io |
| Netlify | CNAME | www | 项目名.netlify.app |
| 阿里云 CDN | CNAME | www | CDN 分配的域名 |

- 根域名（`@` 记录）通常使用 A 记录指向平台提供的 IP 地址，或使用 CNAME（部分服务商支持）
- DNS 生效通常需要 10 分钟到 48 小时不等

---

## 6. ICP 备案说明

### 什么时候需要备案

- 使用国内服务器或国内 CDN 加速时，**必须**完成 ICP 备案
- 使用境外服务器（Vercel、GitHub Pages、Netlify）时，**不需要**备案

### 备案流程

1. **选择接入服务商**：阿里云、腾讯云等（即你的服务器提供商）
2. **准备资料**：
   - 企业营业执照
   - 法人身份证
   - 网站负责人身份证
   - 域名证书
   - 网站核验单
3. **提交备案申请**：通过服务商的备案系统在线提交
4. **管局审核**：提交后由各省通信管理局审核
5. **备案完成**：获得 ICP 备案号

### 备案周期

- 通常为 **2-4 周**，部分省份可能更长
- 期间需要配合管局补充材料

### 建议

- **备案完成前**，建议先使用境外服务（Vercel / GitHub Pages / Netlify）上线网站
- **备案完成后**，可切换到国内 CDN 获得更好的国内访问速度
- 注意：使用境外服务器不需要备案，但国内访问速度可能较慢，建议配合 CDN 优化

---

## 7. SSL 证书

### 自动提供 HTTPS 的平台

以下平台会自动为你的网站配置 SSL 证书，无需额外操作：

- **Vercel**：自动 HTTPS，包括自定义域名
- **GitHub Pages**：自动 HTTPS（自定义域名需要先在 DNS 中正确配置）
- **Netlify**：自动 HTTPS（使用 Let's Encrypt）

### 需要手动配置的平台

- **阿里云**：可在 SSL 证书服务中申请免费证书（DV 单域名证书，每年 20 个免费额度），然后在 CDN 或 SLB 中配置
- **腾讯云**：可申请免费 SSL 证书，在 CDN 控制台中绑定

### 证书续期

- Vercel / Netlify / GitHub Pages 自动续期
- 阿里云 / 腾讯云的免费证书有效期通常为 1 年，到期前需要手动续期或重新申请

---

## 8. 后续建议

### 部署平台选择

| 需求场景 | 推荐平台 | 理由 |
|---|---|---|
| 快速上线，无备案 | Vercel | 免费、自动 HTTPS、部署简单 |
| 国内高速访问 | 阿里云 OSS + CDN | 国内节点速度快，需备案 |
| 零成本试水 | GitHub Pages | 完全免费，但国内较慢 |
| 需要表单处理 | Netlify | 内置免费表单功能 |

### 维护建议

- **定期检查部署状态**：确认网站可正常访问，SSL 证书未过期
- **关注域名到期时间**：提前续费，避免域名被他人注册
- **保持代码仓库整洁**：定期提交代码变更，方便回滚
- **监控网站可用性**：可使用 UptimeRobot 等免费工具监控网站状态
- **定期更新内容**：保持研究文章和解决方案页面的内容新鲜度

### 性能优化建议

- 图片资源建议使用 WebP 格式，减小文件体积
- 可使用 Cloudflare 免费版 CDN 加速全球访问
- 考虑添加 sitemap.xml 提升搜索引擎收录效果
- 考虑添加 robots.txt 控制搜索引擎爬取行为
