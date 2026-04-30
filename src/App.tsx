import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileUp, 
  Terminal, 
  BarChart3, 
  History as HistoryIcon, 
  Settings, 
  Plus, 
  Zap, 
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  BrainCircuit
} from 'lucide-react';
import { MultiAgentSystem } from './services/agentService';
import { AgentType, AgentStatus, AgentState, ResearchReport, AgentLog } from './types';
import { AgentMonitor } from './components/AgentMonitor';
import { ReportViewer } from './components/ReportViewer';

const INITIAL_STATES: Record<AgentType, AgentState> = {
  [AgentType.SNIFFER]: { type: AgentType.SNIFFER, status: AgentStatus.IDLE, message: '等待任务...', progress: 0 },
  [AgentType.ANALYST]: { type: AgentType.ANALYST, status: AgentStatus.IDLE, message: '等待任务...', progress: 0 },
  [AgentType.REVIEWER]: { type: AgentType.REVIEWER, status: AgentStatus.IDLE, message: '等待任务...', progress: 0 },
  [AgentType.FORMATTER]: { type: AgentType.FORMATTER, status: AgentStatus.IDLE, message: '等待任务...', progress: 0 },
};

export default function App() {
  const [states, setStates] = useState<Record<AgentType, AgentState>>(INITIAL_STATES);
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isResearching, setIsResearching] = useState(false);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState<ResearchReport[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleStartResearch = async () => {
    if (!inputText.trim()) return;

    setIsResearching(true);
    setReport(null);
    setStates(INITIAL_STATES);
    setLogs([]);

    const system = new MultiAgentSystem(
      process.env.GEMINI_API_KEY!,
      (state) => {
        setStates(prev => ({ ...prev, [state.type]: state }));
        if (state.status === AgentStatus.RUNNING) {
          setActiveAgent(state.type);
        }
      },
      (log) => {
        setLogs(prev => [...prev, log]);
      }
    );

    try {
      const result = await system.runResearch(inputText, "医药与新能源行业交叉分析");
      setReport(result);
      setHistory(prev => [result, ...prev]);
    } catch (error) {
      console.error("Research failed:", error);
    } finally {
      setIsResearching(false);
      setActiveAgent(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-950 z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Zap className="text-white fill-current" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">DeepInvest</span>
          </div>
          
          <button 
            onClick={() => { setReport(null); setInputText(''); }}
            className="w-full py-2 px-4 rounded-lg bg-teal-600 hover:bg-teal-500 transition-colors flex items-center justify-center gap-2 text-sm font-semibold mb-8"
          >
            <Plus size={16} /> 新建投研任务
          </button>

          <nav className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-2">分析工具</div>
            {[
              { icon: BarChart3, label: '投研仪表盘' },
              { icon: TrendingUp, label: '行业嗅探' },
              { icon: ShieldAlert, label: '风险扫描' },
              { icon: BrainCircuit, label: '智能问答' },
            ].map((item, i) => (
              <a key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${i === 0 ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}>
                <item.icon size={18} /> {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-zinc-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4 px-2">历史研报</div>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {history.map((h) => (
              <button 
                key={h.id} 
                onClick={() => setReport(h)}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-900 transition-colors group"
              >
                <div className="text-[11px] font-medium text-zinc-300 truncate group-hover:text-emerald-400">
                  {h.title}
                </div>
                <div className="text-[9px] text-zinc-600 mt-1">
                  {new Date(h.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" />
            <div className="text-xs">
              <div className="font-medium">分析师 01</div>
              <div className="text-[10px] text-zinc-500">Pro Plan</div>
            </div>
          </div>
          <Settings size={18} className="text-zinc-500 cursor-pointer hover:text-white" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 data-grid-bg opacity-10 pointer-events-none" />
        
        {/* Header bar */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold">自动化深度投研工作台</h2>
            <ChevronRight size={14} className="text-zinc-600" />
            <span className="text-xs text-zinc-400">
              {report ? report.title : isResearching ? 'Agent 正在协作生成中...' : '准备就绪'}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">System Live</span>
            </div>
            <div className="text-[10px] text-zinc-500">
              NODE_ID: AIS-7483-NODE
            </div>
          </div>
        </header>

        {/* Dynamic Canvas */}
        <div className="flex-1 overflow-y-auto z-10">
          <AnimatePresence mode="wait">
            {!report && !isResearching && (
              <motion.div 
                key="input"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex items-center justify-center p-8"
              >
                <div className="max-w-2xl w-full text-center">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <FileUp size={32} className="text-teal-400" />
                  </div>
                  <h1 className="text-4xl font-bold mb-4 tracking-tight">上传长文本、研报或输入财务数据</h1>
                  <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                    系统将通过 4 个协作 Agent 进行信息嗅探、深度分析、逻辑挑战及格式化输出，为您在 15 分钟内生成高质量投研报告。
                  </p>
                  
                  <div className="relative group">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="粘贴财报内容或关键业务数据进行分析..."
                      className="w-full h-48 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all resize-none mb-4"
                    />
                    <div className="absolute bottom-6 right-6 flex gap-3">
                      <button className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors">
                        <HistoryIcon size={20} />
                      </button>
                      <button 
                        onClick={handleStartResearch}
                        disabled={!inputText.trim()}
                        className="px-6 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-black font-bold text-sm transition-all shadow-xl shadow-teal-500/20"
                      >
                        启动智能投研
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {isResearching && (
              <motion.div 
                key="researching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col p-8"
              >
                <div className="max-w-6xl mx-auto w-full space-y-8">
                  <AgentMonitor states={states} activeType={activeAgent} />
                  
                  {/* Console Log */}
                  <div className="flex-1 min-h-[400px] rounded-2xl bg-black border border-zinc-800 flex flex-col overflow-hidden shadow-2xl">
                    <div className="h-10 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-zinc-500" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Agent Collaboration Log</span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      </div>
                    </div>
                    <div className="flex-1 p-6 font-mono text-[11px] space-y-2 overflow-y-auto">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2">
                          <span className="text-zinc-700 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                          <span className={`uppercase font-bold w-12 shrink-0 ${
                            log.agent === AgentType.SNIFFER ? 'text-blue-500' :
                            log.agent === AgentType.ANALYST ? 'text-teal-500' :
                            log.agent === AgentType.REVIEWER ? 'text-rose-500' : 'text-amber-500'
                          }`}>{log.agent}</span>
                          <span className={`${log.level === 'error' ? 'text-rose-400 font-bold' : 'text-zinc-300'}`}>
                            {log.message}
                          </span>
                        </div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {report && !isResearching && (
              <motion.div 
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <ReportViewer report={report} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
