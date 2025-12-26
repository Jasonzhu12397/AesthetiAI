
import React, { useState } from 'react';
import { Settings, FileCode, Check, Copy, Server, Zap, ChevronRight, LayoutGrid } from 'lucide-react';
import { ProjectConfig, VectorDB, RAGFramework, RetrievalStrategy } from '../types';
import { generateScaffoldCode } from '../constants';

export const ProjectGenerator: React.FC = () => {
  const [config, setConfig] = useState<ProjectConfig>({
    name: 'aesthetics-rag-v1',
    vectorDB: 'Milvus',
    framework: 'LangChain',
    strategy: 'Hybrid'
  });
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateScaffoldCode(config));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="glass rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">RAG 开发套件生成器</h3>
            <p className="text-xs text-slate-500">快速构建符合垂直行业标准的 RAG 架构</p>
          </div>
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 hover:bg-slate-200 rounded-xl text-sm font-bold transition-all shadow-xl active:scale-95"
        >
          {isCopied ? <Check size={18} /> : <Copy size={18} />}
          {isCopied ? '已复制' : '复制配置代码'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="p-8 space-y-8 bg-white/[0.02]">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">项目标识符</label>
            <input 
              type="text" 
              value={config.name}
              onChange={e => setConfig({...config, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">向量数据库</label>
              <select 
                value={config.vectorDB}
                onChange={e => setConfig({...config, vectorDB: e.target.value as VectorDB})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 outline-none appearance-none cursor-pointer"
              >
                <option>Milvus</option>
                <option>Pinecone</option>
                <option>Qdrant</option>
                <option>Chroma</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">编排框架</label>
              <select 
                value={config.framework}
                onChange={e => setConfig({...config, framework: e.target.value as RAGFramework})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 outline-none appearance-none cursor-pointer"
              >
                <option>LangChain</option>
                <option>LlamaIndex</option>
                <option>Native Python</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">检索策略优化</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Simple', 'Hybrid', 'Rerank', 'GraphRAG'] as RetrievalStrategy[]).map(s => (
                <button
                  key={s}
                  onClick={() => setConfig({...config, strategy: s})}
                  className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between group ${
                    config.strategy === s 
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                      : 'bg-black/40 border-white/10 text-slate-500 hover:border-white/20'
                  }`}
                >
                  {s}
                  <ChevronRight size={14} className={config.strategy === s ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex gap-3">
            <Zap size={18} className="text-cyan-400 flex-shrink-0" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              生成的脚手架包含：<code className="text-cyan-200">docker-compose</code> 一键部署配置、领域模型清洗逻辑、以及预设的 Top-K 检索器接口。
            </p>
          </div>
        </div>

        <div className="bg-black/60 p-8 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            <FileCode size={14} /> boilerplate_structure.sh
          </div>
          <div className="flex-1 font-mono text-xs text-cyan-300/80 leading-relaxed overflow-x-auto whitespace-pre">
            {generateScaffoldCode(config)}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Deployment Readiness</span>
                <Server size={14} className="text-slate-700" />
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[88%] shadow-[0_0_12px_rgba(34,211,238,0.4)]"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
