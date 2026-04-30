import React from 'react';
import Markdown from 'react-markdown';
import { ResearchReport } from '../types';
import { Calendar, Tag, Shield, TriangleAlert, FileText, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ReportViewerProps {
  report: ResearchReport;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const riskColor = 
    report.riskLevel === 'High' ? 'text-rose-400' : 
    report.riskLevel === 'Medium' ? 'text-amber-400' : 
    'text-emerald-400';

  const chartData = report.findings.map(f => ({
    name: f.category.length > 8 ? f.category.substring(0, 8) + '...' : f.category,
    val: Math.floor(Math.random() * 40) + 60, // Mocked sentiment score
    full: f.category
  }));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-start border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
          <div className="flex items-center gap-4 text-sm opacity-60">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> 
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={14} /> AI 自动生成
            </span>
            <span className={`flex items-center gap-1 font-medium ${riskColor}`}>
              <Shield size={14} /> 风险等级: {report.riskLevel}
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-medium">
          <Download size={14} /> 导出 PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="p-6 rounded-2xl bg-zinc-900/50 technical-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} className="text-teal-400" /> 执行摘要
            </h3>
            <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">
              {report.summary}
            </p>
          </section>

          <div className="markdown-body prose prose-invert max-w-none">
            <Markdown>{report.content}</Markdown>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 technical-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-70">
              数据透视 (情感评分)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#2dd4bf' }}
                  />
                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.val > 80 ? '#2dd4bf' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 technical-border border-rose-500/20">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-rose-400">
              <TriangleAlert size={16} /> 核心风险点
            </h3>
            <ul className="space-y-3">
              {report.risks.map((risk, idx) => (
                <li key={idx} className="text-[13px] flex gap-3 text-zinc-300">
                  <span className="text-rose-500 mt-1">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-6 rounded-2xl bg-zinc-900/50 technical-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-70">
              各维度关键发现
            </h3>
            <div className="space-y-4">
              {report.findings.map((f, idx) => (
                <div key={idx} className="group">
                  <div className="text-[11px] font-mono text-teal-500 mb-1">{f.category}</div>
                  <div className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {f.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
