# 🌸 AesthetiAI: 医美 RAG 全栈实战平台

[![Docker](https://img.shields.io/badge/Docker-Deploy-blue?logo=docker)](./docker-compose.yml)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![RAG](https://img.shields.io/badge/RAG-Fullstack-rose)](https://github.com)

本项目是一个面向大模型应用开发者的 **RAG (检索增强生成)** 技术全栈实战案例。以“医美咨询助理”为业务背景，旨在帮助开发者掌握从数据处理、索引构建到本地/云端 LLM 集成的完整闭环。

---

## 🚀 快速启动 (Docker 一键部署)

确保您已安装 [Docker](https://www.docker.com/) 和 [Docker Compose](https://docs.docker.com/compose/)。

1. **克隆项目并进入目录**
   ```bash
   git clone <project-repo-url>
   cd aesthetiai-rag
   ```

2. **启动全栈环境**
   此操作将同时启动 **前端应用 (Nginx)** 和 **本地模型引擎 (Ollama)**。
   ```bash
   docker-compose up -d
   ```

3. **访问应用**
   打开浏览器访问：`http://localhost`

---

## 🤖 模型集成指南

本项目支持多种 LLM 接入方式，通过页面右上角的 **齿轮图标 (Settings)** 即可实时配置。

### 方式 A：本地部署 (推荐用于 RAG 实验)
利用内置的 Ollama 容器，您可以完全离线运行。

1. **下载模型** (在宿主机执行):
   ```bash
   # 以 Llama3 为例
   docker exec -it ollama-local ollama run llama3
   ```
2. **UI 配置**:
   - **Endpoint**: `http://ollama:11434/v1`
   - **Model ID**: `llama3`
   - **API Key**: 任意填写

### 方式 B：云端部署 (DeepSeek / Gemini)
1. **获取 API Key**: 从 [DeepSeek 开放平台](https://platform.deepseek.com/) 获取。
2. **UI 配置**:
   - **Endpoint**: `https://api.deepseek.com/v1`
   - **Model ID**: `deepseek-chat`
   - **API Key**: `sk-your-key`

---

## 🛠️ 开发者进阶：RAG 实验室

本项目包含一个隐藏的 **开发者管理后台**，用于观察 RAG 底层逻辑。

- **进入方式**: 滚动到页面底部（Footer），点击右侧极淡的 **Settings 图标**。
- **功能**:
  - **知识库命中观察**: 实时查看 AI 回答时检索到了哪些原始医学片段。
  - **脚手架生成**: 根据您的技术栈（Milvus/Pinecone/LangChain）自动生成后端 Python 骨架代码。
  - **性能监控**: 查看 RAG 准确率与检索延迟。

---

## 📂 项目结构

```text
.
├── components/          # React 组件 (Chat, Generator 等)
├── services/            # AI 与 RAG 核心逻辑 (geminiService.ts)
├── constants.ts         # 领域知识库与品牌配置
├── types.ts             # TypeScript 类型定义
├── docker-compose.yml   # 容器编排 (Frontend + Ollama)
├── nginx.conf           # 生产环境 Web 配置
└── vite.config.ts       # 构建工具配置
```

---

## ⚠️ 开发注意事项

1. **CORS 问题**: 如果在本地开发（npm run dev）时访问 Ollama 遇到跨域错误，请设置环境变量 `OLLAMA_ORIGINS="*"` 并重启 Ollama。
2. **数据持久化**: 模型文件存储在 Docker Volume `ollama_data` 中，删除容器不会导致模型丢失。
3. **安全提示**: 在生产环境下，请勿将敏感 API Key 硬编码在 `constants.ts` 中，建议通过 UI 手动配置或使用环境变量。

---

## 💡 RAG 技术路径
本项目是《RAG 全栈全系列教程》的配套实践。通过本项目，您可以深入学习：
- [x] **数据分块 (Chunking)**: `services/geminiService.ts` 中的模拟检索逻辑。
- [x] **多模型路由**: 适配 Open-AI 兼容接口。
- [x] **提示词工程 (Prompt Engineering)**: 医疗行业合规约束提示词。

---
© 2025 AesthetiAI Team. Built for Developers.