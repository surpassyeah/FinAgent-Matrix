export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AgentType {
  SNIFFER = 'sniffer',
  ANALYST = 'analyst',
  REVIEWER = 'reviewer',
  FORMATTER = 'formatter',
}

export interface AgentState {
  type: AgentType;
  status: AgentStatus;
  message: string;
  progress: number;
}

export interface ResearchReport {
  id: string;
  title: string;
  summary: string;
  content: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  risks: string[];
  findings: {
    category: string;
    details: string;
  }[];
  createdAt: string;
}

export interface AgentLog {
  id: string;
  agent: AgentType;
  timestamp: string;
  message: string;
  level: 'info' | 'warn' | 'error';
}
