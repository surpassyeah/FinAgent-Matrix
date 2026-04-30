# 📈 FinAgent-Matrix: 自动化深度投研与风控多 Agent 协作网络

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.10+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/Framework-LangChain%20%7C%20AutoGen-green.svg" alt="Framework">
  <img src="https://img.shields.io/badge/LLM-Xiaomi%20AI%20%7C%20OpenAI-orange.svg" alt="LLM">
  <img src="https://img.shields.io/badge/License-MIT-success.svg" alt="License">
</p>

## 项目简介 (Introduction)

**FinAgent-Matrix** 是一个基于大语言模型（LLM）驱动的**多 Agent 协作框架**，专为金融投研、企业战略分析及市场风控场景设计。

面对动辄数百页的财报、招股书和碎片化的海量市场新闻，传统的人工信息提取效率低下且易遗漏风险点。本项目通过引入 ReAct（推理与行动）机制和长链推理技术，构建了一个由多个虚拟专家组成的“AI 投研团队”。它们能够自动完成数据抓取、长文理解、交叉验证、自我纠错，并最终输出带有深度洞察和排版精美的 Markdown/PDF 研报。

项目旨在将分析师从繁杂的资料梳理中解放出来，将深度报告的撰写周期从**数天缩短至分钟级**。

## 核心特性 (Core Features)

- ** 多 Agent 协同工作流**：不再是单一的对话模型，而是构建了具备特定角色的 Agent 团队（情报收集、深度分析、风控审查、排版输出），实现流水线式作业。
- ** 极致长上下文处理与 RAG**：专为超长文档（如几十万字的 PDF 财报）优化，结合检索增强生成（RAG）技术，精准定位核心财务数据与高管发言。
- ** 独创的“红蓝对抗”审查机制**：内置严苛的“Reviewer Agent”，对生成的初稿进行挑刺与反思（Self-Reflection），强制触发重写机制，最大限度降低 AI 幻觉（Hallucination）。
- ** 长链推理 (Long-chain Reasoning)**：不仅能总结，还能进行逻辑关联。例如自动将“本季度营收下滑”的财务数据与“供应链新闻”进行因果逻辑链条拼接。

##  Agent 架构设计 (Agent Architecture)

系统内部流转逻辑如下：

1.  **Scout Agent (情报嗅探者)**: 负责连接外部 API (如 SEC 数据库、新闻 API)，定时抓取并解析最新的长文本研报、财报，进行格式清理和向量化存储。
2.  **Analyst Agent (深度分析师)**: 拥有财务和商业知识背景的 Agent。它会从向量库中提取核心切片，对财务指标、行业趋势进行多维度的长链推理分析，生成初稿。
3.  **Reviewer Agent (风控审查官)**: 扮演“魔鬼代言人”。对初稿进行事实核查和逻辑漏洞扫描。如果发现结论缺乏数据支撑或存在矛盾，将打回给 Analyst Agent 要求重写。
4.  **Publisher Agent (排版主编)**: 收集最终通过审查的内容，将其转化为带有图表占位符、结构清晰的 Markdown 或 HTML 深度研报。

## 🛠 技术栈 (Tech Stack)

- **核心框架**: AutoGen / CrewAI / LangChain (选择你实际使用的)
- **大模型支持**: 兼容 OpenAI API 协议的模型
- **向量数据库**: Milvus / Qdrant / Chroma (用于本地 RAG 知识检索)
- **文档解析**: Unstructured / PyPDF / OCR 工具包
- **后端 API**: FastAPI (用于提供微服务调用)

## 🚀 快速开始 (Getting Started)


```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/FinAgent-Matrix.git

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量 (在 .env 文件中填入你的 API Key)
cp .env.example .env

# 4. 运行主 Agent 流程
python main_workflow.py --target "TSLA 2023 Q4 财报分析"
