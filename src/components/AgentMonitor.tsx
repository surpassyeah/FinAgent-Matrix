import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, Search, LayoutTemplate, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { AgentType, AgentStatus, AgentState } from '../types';

interface AgentMonitorProps {
  states: Record<AgentType, AgentState>;
  activeType: AgentType | null;
}

const AGENT_INFO = {
  [AgentType.SNIFFER]: { icon: Search, label: '信息嗅探 Agent', color: 'text-blue-400' },
  [AgentType.ANALYST]: { icon: Activity, label: '深度剖析 Agent', color: 'text-teal-400' },
  [AgentType.REVIEWER]: { icon: ShieldCheck, label: '红蓝对抗 Agent', color: 'text-rose-400' },
  [AgentType.FORMATTER]: { icon: LayoutTemplate, label: '排版输出 Agent', color: 'text-amber-400' },
};

export const AgentMonitor: React.FC<AgentMonitorProps> = ({ states, activeType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      {(Object.keys(AGENT_INFO) as AgentType[]).map((type) => {
        const info = AGENT_INFO[type];
        const state = states[type];
        const isActive = activeType === type;
        const Icon = info.icon;

        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl glass-card transition-all duration-500 ${
              isActive ? 'ring-2 ring-teal-500/50 scale-[1.02] bg-teal-500/5' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-zinc-900 ${info.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex items-center gap-2">
                {state.status === AgentStatus.RUNNING && (
                  <Loader2 size={14} className="animate-spin text-teal-400" />
                )}
                {state.status === AgentStatus.COMPLETED && (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                )}
                {state.status === AgentStatus.FAILED && (
                  <AlertCircle size={14} className="text-rose-400" />
                )}
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                  {state.status}
                </span>
              </div>
            </div>
            
            <h3 className="text-sm font-medium mb-1">{info.label}</h3>
            <p className="text-[11px] opacity-60 h-8 line-clamp-2 mb-3">
              {state.message}
            </p>

            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${state.progress}%` }}
                className={`h-full ${
                  state.status === AgentStatus.FAILED ? 'bg-rose-500' : 'bg-teal-500'
                }`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
