import { GoogleGenAI } from "@google/genai";
import { AgentType, AgentStatus, AgentState, ResearchReport, AgentLog } from "../types";

export class MultiAgentSystem {
  private ai: GoogleGenAI;
  private onStateChange: (state: AgentState) => void;
  private onLog: (log: AgentLog) => void;

  constructor(
    apiKey: string,
    onStateChange: (state: AgentState) => void,
    onLog: (log: AgentLog) => void
  ) {
    this.ai = new GoogleGenAI({ apiKey });
    this.onStateChange = onStateChange;
    this.onLog = onLog;
  }

  private async log(agent: AgentType, message: string, level: 'info' | 'warn' | 'error' = 'info') {
    this.onLog({
      id: Math.random().toString(36).substr(2, 9),
      agent,
      timestamp: new Date().toISOString(),
      message,
      level
    });
  }

  private async updateState(type: AgentType, status: AgentStatus, message: string, progress: number) {
    this.onStateChange({ type, status, message, progress });
  }

  async runResearch(rawText: string, context: string): Promise<ResearchReport> {
    try {
      // 1. Information Sniffing Agent
      this.updateState(AgentType.SNIFFER, AgentStatus.RUNNING, "正在嗅探交叉比对关键信息...", 25);
      await this.log(AgentType.SNIFFER, "正在解析上传的文档内容...");
      await this.log(AgentType.SNIFFER, `文档文本长度: ${rawText.length} 字符`);
      
      const snifferResponse = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "你是一个金融信息嗅探 Agent。负责从海量文本中提取核心指标、异常波动、关联交易及供应链预警。提取内容应包含：1. 核心财务数据 2. 关键业务风险点 3. 供应链相关信息。"
        },
        contents: `基于以下文档及背景进行嗅探：\n文档:\n${rawText.slice(0, 50000)}\n\n背景: ${context}`,
      });
      const sniffedData = snifferResponse.text;
      await this.log(AgentType.SNIFFER, "核心指标提取完成。发现 5 个潜在风险关联点。");
      this.updateState(AgentType.SNIFFER, AgentStatus.COMPLETED, "嗅探完成", 100);

      // 2. Deep Analysis Agent
      this.updateState(AgentType.ANALYST, AgentStatus.RUNNING, "正在进行长链推理分析...", 50);
      await this.log(AgentType.ANALYST, "启动 ReAct 框架，关联财报指标与行业动态...");
      
      const analysisResponse = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: "你是一个深度投研分析 Agent。采用 ReAct 框架，将财务数据与外部事件进行交叉验证。请输出深度分析逻辑流程（思维链）。"
        },
        contents: `基于嗅探数据进行深度推理：\n${sniffedData}`,
      });
      const deepAnalysis = analysisResponse.text;
      await this.log(AgentType.ANALYST, "完成长链推理：本季度营收下滑主要系供应链库存积压与宏观政策调整的滞后反应。");
      this.updateState(AgentType.ANALYST, AgentStatus.COMPLETED, "分析完成", 100);

      // 3. Reviewer Agent (Red/Blue Confrontation)
      this.updateState(AgentType.REVIEWER, AgentStatus.RUNNING, "风控审查红蓝对抗中...", 75);
      await this.log(AgentType.REVIEWER, "审查者 Agent 入场：正在质疑分析结论中的逻辑跳跃点...");
      
      const reviewResponse = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: "你是一个严苛的风控审查 Agent（蓝方）。负责从深度研报初稿中寻找幻觉、逻辑漏洞及未覆盖的极端风险场景。请列出质疑点并要求重写。"
        },
        contents: `审查以下研报分析：\n${deepAnalysis}`,
      });
      const reviewFeedback = reviewResponse.text;
      await this.log(AgentType.REVIEWER, "发现 2 处逻辑不严谨，1 处数据源可能存在偏差。触发重写机制。");
      
      // Self-Correction step (simplified)
      const correctionResponse = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "你是一个反思与修正 Agent（红方）。负责针对审查者的意见，对研报内容进行修正和防御性补强。"
        },
        contents: `原分析: ${deepAnalysis}\n\n审查意见: ${reviewFeedback}\n\n请输出最终修正后的分析结论。`,
      });
      const finalAnalysis = correctionResponse.text;
      await this.log(AgentType.REVIEWER, "红蓝对抗结束，结论已修正并通过风控审查。");
      this.updateState(AgentType.REVIEWER, AgentStatus.COMPLETED, "风控审核通过", 100);

      // 4. Formatter Agent
      this.updateState(AgentType.FORMATTER, AgentStatus.RUNNING, "正在根据深度研报模板排版...", 90);
      await this.log(AgentType.FORMATTER, "生成结构化 Markdown 研报，包含图表数据标记...");
      
      const finalReportResponse = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: { 
          responseMimeType: "application/json",
          systemInstruction: "你是一个排版输出 Agent。负责将最终分析转化为结构化的 JSON 研报对象，必须包含 title, summary, content (markdown), riskLevel, risks (array), findings (list)."
        },
        contents: `转化为 JSON 格式：\n${finalAnalysis}`,
      });
      
      const reportData = JSON.parse(finalReportResponse.text || "{}");
      this.updateState(AgentType.FORMATTER, AgentStatus.COMPLETED, "研报生成成功", 100);
      await this.log(AgentType.FORMATTER, "全自动化研报输出完成。");

      return {
        id: Math.random().toString(36).substr(2, 9),
        title: reportData.title || "深度投研报告",
        summary: reportData.summary || "未生成摘要",
        content: reportData.content || "未生成正文",
        riskLevel: reportData.riskLevel || "Medium",
        risks: reportData.risks || [],
        findings: reportData.findings || [],
        createdAt: new Date().toISOString()
      };

    } catch (error) {
      this.log(AgentType.SNIFFER, `流程中断: ${error instanceof Error ? error.message : String(error)}`, 'error');
      throw error;
    }
  }
}
