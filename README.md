# 综合教资备考工作台

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%2F%20PWA-4285F4?logo=googlechrome&logoColor=white)](https://badcodez.github.io/Jiazi-Practice-Platform/)
[![Release](https://img.shields.io/github/v/release/BadCodeZ/Jiazi-Practice-Platform?label=Release)](https://github.com/BadCodeZ/Jiazi-Practice-Platform/releases)
[![Author](https://img.shields.io/badge/Author-BadCodeZ-181717?logo=github)](https://github.com/BadCodeZ)

**Comprehensive Teacher Certification Preparation Workbench — Single-file Offline Web App**  
面向教师资格证考试（科一/科二/科三）的离线优先网页备考应用，零安装、零注册、零服务器，单文件打开即用，数据自持。

**Language**: [中文](#中文版) · [English](#english)

---

## 中文版

### 目录

- [概览](#概览)
- [相关项目](#相关项目)
- [版本对比](#版本对比)
- [版本更新说明（V1.1 → V1.2）](#版本更新说明v11--v12)
- [版本命名说明](#版本命名说明)
- [功能特性](#功能特性)
- [界面概览](#界面概览)
- [下载与安装](#下载与安装)
- [本地运行与质量门禁（源码）](#本地运行与质量门禁源码)
- [快速上手](#快速上手)
- [技术架构](#技术架构)
- [技术规格](#技术规格)
- [数据安全与隐私](#数据安全与隐私)
- [常见问题](#常见问题)
- [版本历史](#版本历史)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

### 概览

**综合教资备考工作台（网页端）** 是安卓端「综合教资备考平台」的网页正式版，完整覆盖核心练习闭环，并针对浏览器场景做了离线单文件、PWA 安装、键盘流与主动回忆等优化。

| 项目 | 说明 |
|------|------|
| 版本 | **V1.2**（对外版本号；内部 meta 2.0） |
| 主文件 | `综合教资备考工作台.html`（单文件，2.49 MB） |
| 内置题量 | 3,342 道（覆盖科一/科二全章节 + 科三 17 个学科） |
| 运行环境 | 任意现代浏览器（Chrome / Edge 推荐）；支持「添加到主屏幕」变 PWA |
| 网络依赖 | 核心功能全部离线可用，仅 AI 讲评、AI 出题与 WebDAV 同步需联网 |
| 源码 | 单文件 HTML，全部开源 |
| 作者 | BadCodeZ |

### 相关项目

- **安卓端**：`jiaozi-android` — 手机版备考应用，与网页端数据互通
  - 仓库：https://github.com/BadCodeZ/jiaozi-android
  - 安装包：https://github.com/BadCodeZ/jiaozi-android/releases

### 版本对比

| 项目 | V1.1 | V1.2（本版本） |
|------|------|----------------|
| 主文件 | `综合教资备考工作台.html` | `综合教资备考工作台.html` |
| 大小 | 2.95 MB | 2.49 MB |
| MD5 | `7c10091b03f64b71083399b0a2c705cf` | `db9f849a2f71248f23763a3ab766d7a2` |
| 主要变化 | 上一稳定发布版 | 见「版本更新说明」 |

本版本在 V1.1 基础上进行了体验增强与质量校正，属增量迭代。

---

### 版本更新说明（V1.1 → V1.2）

本版在 V1.1 基础上，主要优化与新增如下：

**练习体验**
- **练习限时倒计时**：可开启时间限制，剩余 1 分钟高亮提醒，模考前帮你掐准节奏。
- **练习键盘流**：练习中支持 `1–4` / `A–D` 选答，`空格` / `Enter` 进下一题（已作答时）、主观题对答案。
- **主动回忆遮挡**：新增「主动回忆」开关，客观题先遮挡选项，按 `空格` 揭晓，先回想再看答案，符合检索练习效应。

**答题与总结**
- **答题总结增强**：练习结束的总结页新增「答题卡回顾」，逐题展示你的作答、正确答案、解析与用时，错题标红、对题标绿，可一键加入复习计划。

**知识库与仪表盘**
- **知识库 AI 自测**：每张知识卡可一键生成 3 道自测题，答题判分并留痕（`quizLog`），随时检验记忆效果。
- **学习仪表盘**：今日视图新增「每日回顾」卡片；统计视图新增「周报」（7 天刷题量、正确率趋势、薄弱章节分布）。

**首页精简**
- **首页去重**：去掉与统计页重复的累计统计行，首页聚焦「今日待办」与「行动入口」。

**题库与质量**
- **题库数据校正**：修正部分题目的答案、解析与章节归类错误，提升刷题准确性。

**更新提示**
- **更新弹窗**：首次打开提示 V1.2 更新内容，含「不再提醒」（按版本号，V1.3 仍会提示）与「我知道了」；仅首次加载触发，切换模块不弹。

---

### 版本命名说明

**网页端沿用「V1.x」对外版本号（当前 V1.2，内部 meta 2.0）。**

- 网页端与安卓端版本号互不对齐属正常（安卓端内部版本号为 V2.x），二者仅数据互通，不共用版本线。
- 历史文档中出现的「meta 1.0 / meta 2.0」为内部标记，对外以 V1.x 为主称呼。

---

### 功能特性

#### 练习系统

- **多种练习模式**：随机全科 / 按科目 / 章节练习 / 薄弱优先 / 仅复习错题，支持自定义题量（10/20/30/50）
- **客观题即时判**：点选选项即显示正确答案，答错后需标记错因（半强制，至少选一项），用于后续智能组卷
- **主观题两步流**：先写草稿要点，再展开参考答案自评「答对了/还不会」，作答记录可追溯回看
- **练习限时倒计时**：可开启时间限制，剩余 1 分钟高亮提醒
- **全科模考**：按章节权重加权随机抽题，模拟真实考试比例；带倒计时，归零强制交卷
- **答题卡回顾**：练习结束总结页逐题展示作答、正确答案、解析与用时，错题标红、对题标绿

#### 键盘流与主动回忆（网页端专属）

- **键盘选答**：练习中 `1–4` / `A–D` 直接选选项，`空格` / `Enter` 进下一题或揭晓答案
- **主动回忆遮挡**：开启后客观题选项先模糊遮挡，按 `空格` 揭晓，先凭记忆回想再看选项

#### 错题与校订

- **智能错题本**：答错题自动归类，按错因（5 类）筛选分组，支持导出 PDF 打印
- **薄弱度排序**：按错误频次降序排列，seed 种子确保可复现
- **章节归类**：手动指派章节归属，辅助题库维护
- **AI 复核**：自动检测解析过短或缺失答案的题目，供人工复核

#### 知识管理

- **知识卡片**：按章节组织考点，支持收藏标记、搜索与到期复习提醒
- **知识图谱**：可缩放平移的图形化知识图谱导航
- **备课模块**：十二要素教案编辑器 + 模板库（科一/科二/科三模板）+ 课标库/教材库上传引用
- **科三教学设计训练**：抽题写简案，六维评分（目标/过程/策略/评价/重难点/板书）
- **知识库 AI 自测**：每张知识卡一键生成 3 题，判分留痕

#### AI 辅助（可选，需联网）

- **AI 讲评**：练习结算页可生成错因分析 + 纵向回顾（历史正确率、同类对比、薄弱提示）
- **AI 出题**：基于已有知识点生成新题辅助练习
- **多服务商支持**：DeepSeek / OpenAI / Moonshot，配置 API Key 后使用
- **离线兜底**：无 Key 时自动降级，不予联网报错，展示通用备考建议

#### 文档解析

- **PDF/Word 解析**：课标库 / 教材库上传支持 `.docx`（mammoth 解析）和 `.pdf`（pdf.js 解析），运行时按需加载，离线环境降级为手动粘贴

#### 多端同步

- **WebDAV 同步**：与安卓端「综合教资备考平台」数据互通，支持仅上传/仅下载/双向合并三种方向
- **加密传输**：AES-GCM 零知识加密（SYNCPKG1 格式），服务器不可读
- **离线备份**：导出同步包文本，换设备粘贴导入即可合并

---

### 界面概览

本应用为单文件网页，包含「今日 / 练习 / 统计 / 知识库 / 备课 / 设置」等视图。运行效果见在线 Demo：https://badcodez.github.io/Jiazi-Practice-Platform/

---

### 下载与安装

#### 下载

- **单文件**：从 [Releases 页面](https://github.com/BadCodeZ/Jiazi-Practice-Platform/releases) 下载 `综合教资备考工作台.html` 一个文件即可（约 2.49 MB）。
- **在线使用**：直接访问 https://badcodez.github.io/Jiazi-Practice-Platform/ （GitHub Pages 托管，无需下载）。

#### 三种运行方式

1. **双击打开**：直接双击 `综合教资备考工作台.html`，用 Chrome / Edge 打开即可使用。
   - 注意：`file://` 协议下浏览器通常不持久化 `localStorage`，进度可能丢失，仅适合临时预览。
2. **本地静态服务（推荐，数据持久化）**：在文件目录起一个静态服务，通过 `http://` 访问，即可正常读写本地数据并启用 PWA 离线缓存。
3. **添加到主屏幕（PWA）**：通过 http(s) 访问后，浏览器「分享 → 添加到主屏幕」，获得类原生 App 体验与离线能力。

#### 版本更新（覆盖升级）

用同名新版 `综合教资备考工作台.html` 覆盖旧文件即可，**不会清空用户数据**——浏览器 `localStorage` 中的 `artwb_v2_data` 独立于 html 文件，用户记录全部保留。

---

### 本地运行与质量门禁（源码）

本应用为**单文件 HTML，免构建**——所有 CSS/JS/数据均内联，无打包步骤。

#### 本地预览

```bash
# 1. 克隆仓库
git clone https://github.com/BadCodeZ/Jiazi-Practice-Platform.git
cd Jiazi-Practice-Platform

# 2. 本地静态托管（任选其一）
python -m http.server 8080
# 然后访问 http://localhost:8080/综合教资备考工作台.html

# 或直接双击 综合教资备考工作台.html（file:// 仅预览）
```

#### 质量门禁

仓库内置 `gate.js` 十项门禁（语法/渲染/关键函数/数据一致性等）。修改源码后建议本地跑一遍：

```bash
node gate.js   # 期望输出 10/10 全绿
```

> 说明：题库与知识库内置在 html 内联数据中，不随 WebDAV 同步包导出；AI Key 存于独立键 `ai_key`，不进备份、不同步。

---

### 快速上手

#### 三步开始

1. **设置目标日**：首页点击「设置目标日」，选择笔试日期，首页出现倒计时。
2. **开始练习**：首页点击「开始练习」（默认随机全科 20 题），或进入「练习」选项卡选择模式/题量/科目。
3. **复习错题**：答错题自动进入「错题本」，在「统计 → 错题」查看，或「练习 → 仅复习」按间隔重练。

#### 数据迁移（换设备）

旧设备导出 → 新设备导入，两步完成：

1. 旧设备：设置 → 数据同步 → 「导出同步包」 → 复制文本
2. 新设备：打开工作台 → 设置 → 数据同步 → 「导入同步包」 → 粘贴文本 + 输入口令 → 解密合并

> 完整图文使用手册见仓库内 `使用说明.pdf` / `使用说明.docx`。

---

### 技术架构

#### 应用架构

```
┌──────────────────────────────────────────────────────────────┐
│                       Presentation Layer                      │
│  单文件 HTML · 内联 CSS/JS · 自绘 SVG 图标系统                  │
│  SPA 视图状态机（今日/练习/统计/知识库/备课/设置）             │
├──────────────────────────────────────────────────────────────┤
│                        Logic Layer                            │
│  练习引擎 · 错题归因(5类) · 间隔复习 · 弱章评分                  │
│  同步合并引擎 · AI Provider 适配 · 文档解析(pdf.js/mammoth)     │
├──────────────────────────────────────────────────────────────┤
│                         Data Layer                            │
│  localStorage(artwb_v2_data) · IndexedDB(原文)                │
│  WebDAV Client · SyncCrypto(AES-GCM, SYNCPKG1)                │
└──────────────────────────────────────────────────────────────┘
```

#### 技术栈

| 类别 | 技术选型 |
|------|----------|
| 语言 | HTML5 / CSS3 / 原生 JavaScript（ES2020） |
| 架构 | 单文件 SPA · 视图状态机 |
| 数据持久化 | localStorage（`artwb_v2_data`）+ IndexedDB（原文） |
| 离线 | PWA Service Worker（`artwb-v22`） |
| 同步 | WebDAV + AES-GCM（`SYNCPKG1`） |
| AI | Fetch → DeepSeek / OpenAI / Moonshot |
| 文档解析 | pdf.js / mammoth（按需加载） |
| 构建 | 无构建，单文件双击即运行 |

---

### 技术规格

| 项目 | 值 |
|------|------|
| 主文件 | `综合教资备考工作台.html` |
| 大小 | 2.49 MB（2,606,758 字节） |
| MD5 | `db9f849a2f71248f23763a3ab766d7a2` |
| 对外版本 | V1.2（内部 meta 2.0） |
| SW 版本 | `artwb-v22` |
| 内置题量 | 3,342 道 |
| 科三学科 | 17 个 |
| 数据键名 | `artwb_v2_data`（localStorage） |
| 同步格式 | `SYNCPKG1`（AES-GCM） |
| AI Key 存储 | 独立键 `ai_key`，不进同步包、不随备份外泄 |
| 设计主题 | 宣纸 / 水墨 / 青绿 / 朱砂印章 |

---

### 数据安全与隐私

- **零服务器数据收集**：所有练习记录、错题、自建题、备课数据只存于本机浏览器 `localStorage`，不上传任何第三方服务器。
- **AI Key 单独存储**：API Key 独立存储于 `ai_key`，不进入同步包，不随备份外泄。
- **同步端到端加密**：WebDAV 同步采用 AES-GCM 零知识加密，同步服务方不可读取数据内容。
- **最小权限原则**：网页应用不申请任何系统权限；PWA 仅在使用「添加到主屏幕」时由浏览器托管，无额外授权。

---

### 常见问题

#### 安装与运行

- **打开后白屏**：请用 Chrome / Edge 打开。若之前访问过旧版本，硬刷新一次（Ctrl+Shift+R）以绕过旧 PWA 缓存。
- **`file://` 下数据没保存**：`file://` 协议浏览器通常不持久化 `localStorage`。请通过本地静态服务（如 `python -m http.server`）或 http(s) 托管访问。
- **微信内打不开/功能异常**：微信内浏览器功能受限。请用系统浏览器打开并「添加到主屏幕」。

#### 数据与备份

- **数据丢失怎么办**：只要未清缓存、未换浏览器，记录都在 `localStorage`。丢失请用「导入同步包」恢复。
- **换电脑如何迁移**：用导出/导入同步包或 WebDAV 互通，无需重练。
- **覆盖升级会清数据吗**：不会，用户数据存于 `localStorage`（`artwb_v2_data`），与 html 文件独立，覆盖同名 html 保留全部进度。

#### 功能相关

- **AI 功能无法使用**：确认已在设置页配置服务商和 API Key。无 Key 时自动使用离线通用备考建议兜底。
- **是否需要联网**：核心刷题/错题/模考/备课/知识库全部离线；仅 AI 讲评/出题/帮手/WebDAV 同步需联网。
- **如何切换科三学科**：设置中切换学科，题库和知识图谱随当前科三学科隔离。
- **PDF/Word 解析失败**：离线环境自动降级为手动粘贴。CAJ 文件请先转 PDF。

---

### 版本历史

#### V1.2 — 体验增强与质量校正

- 练习限时倒计时、键盘流选答、主动回忆遮挡
- 答题总结「答题卡回顾」逐题回顾
- 知识库 AI 自测（每张卡 3 题判分留痕）
- 学习仪表盘：每日回顾卡片 + 统计周报
- 首页去重（去掉与统计页重复的累计统计）
- 题库数据校正（答案/解析/章节归类）
- 更新弹窗（首次打开提示，按版本号「不再提醒」）

#### V1.1 — 稳定发布版

- 单文件离线工作台基础能力：练习系统（随机/按科目/章节/薄弱优先/仅复习）、智能错题本、全科模考、知识卡片、备课模块、AI 讲评/出题、WebDAV 多端同步、知识图谱。

---

### 贡献指南

欢迎提交 Issue 或 Pull Request。请确保：

1. 提交 Issue 前搜索是否已有类似问题
2. 描述清晰，包含复现步骤（如适用）
3. 代码提交前通过 `node gate.js` 质量门禁（10/10 全绿）

---

### 许可证

```
Copyright 2026 BadCodeZ

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## English

### Overview

**Jiazi-Practice-Platform** is an **offline-first single-file web app** for Chinese Teacher Certification (教师资格证) exam preparation. It runs entirely in your browser — no installation, no registration, no server required. All your study data stays on your own device.

| Item | Value |
|------|-------|
| Release | V1.2 (meta 2.0) |
| Main File | `综合教资备考工作台.html` (2.49 MB) |
| File Integrity | MD5: `db9f849a2f71248f23763a3ab766d7a2` |
| Built-in Questions | 3,342 (covering Subject 1/2 all chapters + Subject 3 across 17 subjects) |
| Platform | Any modern browser (Chrome/Edge recommended); installable as PWA |
| Network | Core features are fully offline; only AI commentary, AI generation and WebDAV sync require internet |
| Source Code | Single-file HTML, fully open source |
| Author | BadCodeZ |

### Related Projects

- **Android App**: `jiaozi-android` — Mobile companion with native features, data-compatible with this web app
  - Repository: https://github.com/BadCodeZ/jiaozi-android
  - Releases: https://github.com/BadCodeZ/jiaozi-android/releases

### Key Features

- **Practice Modes**: Random, by subject, by chapter, weak-point priority, error-only review (10/20/30/50 questions)
- **Instant grading**: Tap an option to see the correct answer immediately; wrong answers require an error-cause tag (≥1, semi-forced) for smart regrouping
- **Subjective two-step flow**: Draft key points first, then reveal the reference answer and self-rate
- **Timed practice**: Optional countdown with last-minute highlight to train exam pacing
- **Mock exams**: Weighted random sampling based on chapter importance
- **Answer-card review**: Post-practice summary shows each answer, correct key, explanation and time spent; wrong in red, right in green
- **Keyboard flow**: `1–4` / `A–D` to answer, `Space` / `Enter` for next; "active recall" mode hides options until revealed
- **Smart error tracking**: Auto-categorize mistakes with 5 error types, weighted review sessions
- **Knowledge cards**: Chapter-based review cards with bookmarking and spaced-repetition reminders
- **Knowledge graph**: Zoomable, pannable knowledge graph navigation
- **AI self-quiz on cards**: Generate 3 quiz questions per card, auto-graded and logged
- **Lesson planning**: Built-in 12-element lesson plan editor with template library
- **AI commentary** (optional): Integration with DeepSeek / OpenAI / Moonshot for question explanations
- **WebDAV sync**: Encrypted cross-device sync with the Android app (AES-GCM)

### Download & Install

Download the single file `综合教资备考工作台.html` from the [Releases page](https://github.com/BadCodeZ/Jiazi-Practice-Platform/releases), or use the live Demo at https://badcodez.github.io/Jiazi-Practice-Platform/.

**Run**:
1. Double-click the HTML file (preview only under `file://`, data may not persist)
2. Or serve locally: `python -m http.server 8080` then open `http://localhost:8080/综合教资备考工作台.html` (recommended, data persists)
3. Or add to Home Screen via browser share menu to get PWA offline support

Upgrading: overwrite the old HTML with the new same-named file — your `localStorage` data (`artwb_v2_data`) is preserved.

### Run from Source

```bash
git clone https://github.com/BadCodeZ/Jiazi-Practice-Platform.git
cd Jiazi-Practice-Platform
python -m http.server 8080
```

Quality gate (after edits): `node gate.js` (expect 10/10 green).

### Technical Spec

| Item | Value |
|------|-------|
| Main file | `综合教资备考工作台.html` |
| Size | 2.49 MB (2,606,758 bytes) |
| MD5 | `db9f849a2f71248f23763a3ab766d7a2` |
| Release | V1.2 (meta 2.0) |
| SW | `artwb-v22` |
| Built-in questions | 3,342 |
| Subject 3 tracks | 17 |
| Data store | localStorage (`artwb_v2_data`) + IndexedDB |
| Sync format | `SYNCPKG1` (AES-GCM) |

### Version History

#### V1.2 — Enhancement & fixes
- Timed practice, keyboard answering, active-recall blur
- Answer-card review on summary
- AI self-quiz on knowledge cards (3 questions, graded & logged)
- Dashboard: Daily Review card + weekly stats report
- Home cleanup (removed duplicate cumulative stats)
- Question-bank fixes (answers/explanations/chapter mappings)
- Update popup on first launch (per-version "don't show again")

#### V1.1 — Stable release
- Core offline workbench: practice system, smart error notebook, mock exams, knowledge cards, lesson planning, AI commentary/generation, WebDAV sync, knowledge graph.

### License

```
Copyright 2026 BadCodeZ
Licensed under the Apache License, Version 2.0.
```

---

**综合教资备考工作台**  
作者：BadCodeZ  
仓库：https://github.com/BadCodeZ/Jiazi-Practice-Platform  
相关安卓端：https://github.com/BadCodeZ/jiaozi-android  
在线使用：https://badcodez.github.io/Jiazi-Practice-Platform/
