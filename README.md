# HKUST Smart City Research Group 网站维护手册

这是 Sen Li 教授及其研究组的英文网站。网站使用 Astro 生成静态页面。日常维护只需编辑数据文件。页面和图片均由网站自身提供，文字使用设备上的系统字体。

## 在电脑上预览

先安装 Node.js 24，再在包含 `package.json` 的项目文件夹中打开终端。 [Node.js 24 官方下载](https://nodejs.org/en/download/archive/v24)

```bash
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

打开终端显示的网址，默认是 `http://localhost:4321/`。修改文件并保存后，网页会自动更新。按 Ctrl+C 停止预览。

准备发布时，用以下命令生成 `dist/`、检查构建结果，再打开 `pnpm preview` 显示的网址验收。

```bash
pnpm build
pnpm test
pnpm preview
```

## 更新研究组内容

| 要更新的内容 | 编辑的文件 |
| --- | --- |
| 教授简介、联系方式、人员和校友 | [`src/data/people.json`](src/data/people.json) |
| 任职、教育、荣誉、服务及教学 | [`src/data/academic-profile.json`](src/data/academic-profile.json) |
| 研究方向、项目、图表及来源 | [`src/data/research.json`](src/data/research.json) |
| 论文、会议成果和专利 | [`src/data/publications.json`](src/data/publications.json) |
| 招聘、日期和申请入口 | [`src/data/opportunities.json`](src/data/opportunities.json) |
| 研究组新闻存档 | [`src/data/news.json`](src/data/news.json) |

可在电脑上用文本编辑器修改，也可在 GitHub 打开文件后点铅笔图标。新增资料时复制现有条目再更新字段。JSON 使用双引号，条目之间加逗号，最后一项后省略逗号。发布前对照原始资料核对人名、日期、职位和链接。

- **论文**。新增记录时给 `id` 一个未使用的编号，填写 `title`（标题）、`authors`（作者）、`year`（数字）、`venue`（刊物或会议）和 `type`（`journal`、`conference` 或 `patent`）。用 `details` 记录卷页或文章编号，用 `note` 记录奖项等说明。每条 DOI、代码或数据链接都可加入 `links`，包含 `label` 和 `url`。如已维护 BibTeX，按上述字段把已核实的信息录入 JSON。期刊用 J、会议用 C，分别接续各自最大的编号。J/C 编号用于长期链接，页面上的倒序编号从该类论文的总数自动生成，更新书目信息时请保留原有 ID。首页代表作按照 `src/lib/research.ts` 中的会议与期刊规则从同一份书目自动选取。
- **人员**。在对应栏目的 `people` 中新增资料。毕业时可把原条目移到 Alumni 并更新职务、学位和链接。新肖像放入 `public/images/people/`，数据中的 `image` 填写类似 `images/people/sen-li.webp` 的路径。无肖像时可省略 `image`。
- **研究**。在 `methods` 中维护理论与方法，`areas` 中维护交通与电力两个应用方向。`methodsParagraphs` 保存理论介绍的段落，`areas[].paragraphs` 保存每个应用方向的段落。每个方向有标题、本地图像、替代文字和图片来源。`slug` 用于首页直达链接。保留原锚点可让旧书签继续指向新版研究页。旧案例的完整资料供原有独立链接使用。
- **招生与招聘**。每次更新实际职位或名额时，同步更新 `opportunities.json` 中的公告日期与正文，区分已确认开放的职位和历史公告。官方申请规则和日期以研究生院页面为准。 [HKUST 研究生申请](https://fytgs.hkust.edu.hk/admissions/Admission-to-Hong-Kong-Campus/submitting-an-application/how-to-apply)
- **新闻**。使用 `YYYY-MM` 格式填写 `date`，新消息放在列表前面。各年的完整记录见页脚的 Group news。

课题组肖像来自旧站 Home、Group 及成员个人主页。赵子健照片取自其个人主页，来源记于 `people.json` 的 `imageSource`。研究图与来源记录见 `research.json`。替换图片时保留来源记录及适用的署名。 [Wix Home](https://www.smartcityhkust.com/) · [Wix Group](https://www.smartcityhkust.com/team-4)

初次迁移覆盖 Wix 的主页、研究、团队、成果、招生和独立案例。人员资料结合学校名录与成员主页核对，图片保留原站署名。 [Wix 论文目录](https://www.smartcityhkust.com/publications) · [Wix 研究页面](https://www.smartcityhkust.com/projects-3) · [HKUST 教师资料](https://researchportal.hkust.edu.hk/en/persons/sen-li/)

## 首页内容和栏目安排

| 栏目 | 放在这里的内容 |
| --- | --- |
| About | 学术简介按现职、教育和博士后经历、研究、奖项及编辑职务排列。简介正文共两段，研究、荣誉和学术服务合写在第二段。研究兴趣列出理论与方法及应用领域。代表作连续排列，每条使用作者、年份、题名、发表出处和卷页信息，选自 NeurIPS、ICLR、Transportation Science、Transportation Research Part B 和 IEEE Transactions on Automatic Control。 |
| Research | 面向非专业读者，用完整段落介绍理论与方法、交通系统、电力系统，说明研究问题、方法及社会意义，并保留两个应用方向配图。 |
| Publications | 先列期刊，再列会议。两个清单各自按总数向下连续编号，每条保留发表年份、出处与可用的论文或代码链接。 |
| People / Join Us | 团队页呈现负责人照片和成员资料，招生页集中说明研究契合度、资历、联系及正式申请渠道。 |
| Teaching / Academic profile | 课程排序为 CIVL 3610、4640、4100K、5610。履历收录任职、学历、荣誉、服务和专利申请。 |

任职日期及现任编辑职务依据作者补充。HKUST 副教授任职自 2026 年 7 月 1 日起，助理教授任职为 2019 年 12 月至 2026 年 6 月。IEEE Transactions on Intelligent Transportation Systems 副主编、Communications in Transportation Research 青年编委、Transportmetrica A: Transport Science 编委均在简介和履历呈现。学术履历的其余内容来自作者的 CV 及各条列出的相关公开资料。 [HKUST 研究档案](https://researchportal.hkust.edu.hk/en/persons/sen-li/)

## 免费发布到 GitHub Pages

1. 在个人或课题组账号下创建一个公开仓库，例如 `smartcity-hkust`。GitHub Free 的 Pages 支持公开仓库，仓库文件对公众可见。 [GitHub Pages 类型和可用范围](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
2. 把项目文件提交到仓库的 `main` 分支。确认仓库中包含 `package.json`、`pnpm-lock.yaml`、`src/`、`public/` 和 `.github/workflows/pages.yml`。 `dist/` 会在发布时重新生成。
3. 打开仓库的 **Settings → Pages**。在 **Build and deployment → Source** 选择 **GitHub Actions**。 [设置 GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
4. 打开 **Actions → Publish to GitHub Pages → Run workflow**，选择 `main` 并运行。工作流安装依赖、构建、检查并发布 `dist/`。以后更新合并到 `main` 会自动发布。 [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
5. 发布成功后，从 **Settings → Pages** 或 Actions 的发布记录打开网址。项目仓库通常使用 `https://账号.github.io/仓库名/`。名为 `账号.github.io` 的用户或组织站点仓库使用 `https://账号.github.io/`。工作流根据 GitHub 返回的域名和路径生成链接。 [Astro 的 Pages 路径说明](https://docs.astro.build/en/guides/deploy/github/)

如果用 Git 命令首次提交到空仓库，先把 `YOUR_ACCOUNT` 和 `YOUR_REPOSITORY` 换成自己的账号和仓库名，在项目文件夹运行以下命令。已有仓库时可直接把文件加入该仓库并按团队的提交方式合并到 `main`。

```bash
git init -b main
git add .
git commit -m "Add Smart City Research Group website"
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

若首次运行早于 Pages 设置并报错，完成第 3 步后重新运行。遇到构建失败，在 **Actions** 打开该次运行及第一个标红步骤。内容更新有误时修正后重新提交。若需恢复线上内容，可撤销引入问题的提交并重新发布。

## 迁移到香港静态托管

选定正式网址后，构建时将协议和域名填入 `SITE_URL`，将发布目录填入 `SITE_BASE`。

| 站点访问地址示例 | `SITE_URL` | `SITE_BASE` |
| --- | --- | --- |
| `https://research.example.org/` | `https://research.example.org` | `/` |
| `https://research.example.org/lab/` | `https://research.example.org` | `/lab` |

以下命令适用于 macOS 或 Linux，请用实际域名替换示例。

```bash
export SITE_URL=https://research.example.org
export SITE_BASE=/
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm preview
```

Windows PowerShell 将前两行写为 `$env:SITE_URL = "https://research.example.org"` 和 `$env:SITE_BASE = "/"`，其余命令相同。

上传 `dist/` 中的所有文件到托管商提供的目标目录。若使用 `/lab/`，就部署到该子目录。让托管服务在访问目录网址时提供其中的 `index.html`，并将 `404.html` 用作自定义错误页。正式网站运行时只需静态文件。更换正式域名或网址路径后，使用新配置重新构建和上传。

### 兼容原有页面地址

| 旧 Wix 路径 | 对应新路径 |
| --- | --- |
| `/` | `/` |
| `/projects-3` | `/research/` |
| `/team-4` | `/people/` |
| `/publications` | `/publications/` |
| `/contact-me` | `/join-us/` |
| `/single-project` | `/research/mapping-safety-perception/` |

新站为改名的旧路径提供自动跳转。表中的路径以新站的发布目录为起点。若香港托管支持网址重定向，也可为改名路径设置永久跳转。

### 日后使用自有域名

先使用 GitHub 默认网址或香港托管临时网址验收。正式切换现有域名之前，由域名管理员备份原有记录，确认新站正常运行，再安排切换。连接 GitHub Pages 时先在 GitHub 验证域名并在 **Settings → Pages → Custom domain** 添加域名，再按 GitHub 指引改动 DNS，待证书就绪后开启 **Enforce HTTPS**。连接香港托管时使用该服务提供的 DNS 值。 [GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 发布后验收

1. 用桌面和手机打开正式网址。检查导航、研究详情、图片、联系方式和申请入口，再打开旧路径确认到达对应页面。
2. 从首页一篇代表作进入 Publications，确认链接定位到该文，期刊和会议编号各自倒序连续。打开 Research 两个应用方向和 Teaching 的课程链接。
3. 用香港和中国内地的实际网络分别打开首页和论文页。内地可各用一次移动数据和校园或办公室网络，无代理时记录运营商、时间、页面加载和图片显示情况。可在浏览器的网络面板确认页面、图片和脚本请求来自正式站点。论文 DOI、数据和申请链接由各外部站点提供，可抽查常用链接。不同网络的访问体验以实际测试为准。
